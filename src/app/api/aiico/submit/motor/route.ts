import { NextResponse, type NextRequest } from 'next/server'
import { finalizePartnerPayment, postMotorSchedule } from '@/lib/aiico/api'
import { fileToBase64, toComprehensiveSchedule, toFinalizePayment, toThirdPartySchedule } from '@/lib/aiico/mappers'
import type { ResolvedCustomer, ResolvedImages, ResolvedVehicle } from '@/lib/aiico/mappers'
import { resolveBodyType, resolveColor, resolveGenderId, resolveTitleId, resolveVehicleMakeModel } from '@/lib/aiico/resolve'
import { aiicoDocumentSlots } from '@/lib/aiico/documents'
import { aiicoMotorSubmitSchema, fieldErrors } from '@/lib/aiico/schemas'
import { aiicoErrorResponse } from '@/lib/aiico/http'
import { validateFileBasics } from '@/lib/nsia/files'

/**
 * `POST /api/aiico/submit/motor` — multipart/form-data:
 *   - `payload`: JSON string of `{ line, wefDt, wetDt, customer, vehicle, payment }`
 *     (plain text — resolved against AIICO's vocabulary here, not by the caller)
 *   - files under `vehicle_license`, `identification`, and optionally
 *     `utility_bill`; `proof_of_ownership` too, but only for `comprehensive`
 *     — Third Party's documented payload never includes that field
 *
 * AIICO splits new business into two calls: `PostMotorSchedule` (registers
 * the risk and returns a `transactionRef` + the authoritative premium) and
 * `FinalizePartnerPayment` (confirms the customer has actually paid that
 * amount). This route runs both — call it only after payment has been
 * collected, since `payment.amountPaid` must match what was charged.
 */
export async function POST(request: NextRequest) {
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a multipart/form-data body.' }, { status: 400 })
  }

  const rawPayload = form.get('payload')
  if (typeof rawPayload !== 'string') {
    return NextResponse.json({ success: false, error: 'A JSON "payload" field is required.' }, { status: 400 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawPayload)
  } catch {
    return NextResponse.json({ success: false, error: 'The "payload" field is not valid JSON.' }, { status: 400 })
  }

  const parsed = aiicoMotorSubmitSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) }, { status: 400 })
  }
  const { line, wefDt, wetDt, customer, vehicle, payment } = parsed.data
  const relevantSlots = aiicoDocumentSlots(line)

  const files: Partial<Record<string, File>> = {}
  const fileErrors: Record<string, string> = {}
  for (const slot of relevantSlots) {
    const value = form.get(slot.slot)
    if (!value || typeof value === 'string') continue
    const problem = validateFileBasics({ name: value.name, size: value.size, type: value.type })
    if (problem) fileErrors[slot.slot] = problem
    else files[slot.slot] = value
  }
  const missing = relevantSlots.filter((slot) => slot.required && !files[slot.slot]).map((slot) => slot.label)
  if (missing.length > 0 || Object.keys(fileErrors).length > 0) {
    return NextResponse.json(
      { success: false, error: missing.length > 0 ? `Missing required documents: ${missing.join(', ')}.` : 'Some files could not be accepted.', fields: fileErrors },
      { status: 400 }
    )
  }

  try {
    const [titleId, genderId, bodyType, color, { make, model }, images] = await Promise.all([
      resolveTitleId(customer.title),
      customer.gender ? resolveGenderId(customer.gender) : Promise.resolve(undefined),
      resolveBodyType(vehicle.vehicleType),
      resolveColor(vehicle.color),
      resolveVehicleMakeModel(vehicle.vehicleMakeModel, vehicle.yearOfManufacture),
      (async (): Promise<ResolvedImages> => ({
        vehicleLicenseUrl: await fileToBase64(files.vehicle_license!),
        identificationUrl: await fileToBase64(files.identification!),
        proofOfOwnershipUrl: files.proof_of_ownership ? await fileToBase64(files.proof_of_ownership) : undefined,
        utilityBillUrl: files.utility_bill ? await fileToBase64(files.utility_bill) : undefined,
      }))(),
    ])

    const resolvedCustomer: ResolvedCustomer = {
      titleId,
      genderId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      dateOfBirth: customer.dateOfBirth,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      nin: customer.nin,
    }
    const resolvedVehicle: ResolvedVehicle = {
      bodyType,
      regNo: vehicle.regNo,
      yearOfManufacture: vehicle.yearOfManufacture,
      make,
      model,
      chassisNo: vehicle.chassisNo,
      color,
      engineNo: vehicle.engineNo,
      vehicleAmount: vehicle.vehicleAmount,
    }

    const schedule = line === 'third-party'
      ? await postMotorSchedule(toThirdPartySchedule(resolvedCustomer, resolvedVehicle, images, { wefDt, wetDt }, payment.amountPaid))
      : await postMotorSchedule(toComprehensiveSchedule(resolvedCustomer, resolvedVehicle, images, { wefDt, wetDt }))

    const finalized = await finalizePartnerPayment(toFinalizePayment(schedule.transactionRef, payment))

    return NextResponse.json({
      success: true,
      policyNumber: finalized.policies[0] ?? null,
      certificateUrl: finalized.printPolicyUrl,
      transactionRef: schedule.transactionRef,
    })
  } catch (error) {
    return aiicoErrorResponse(error)
  }
}
