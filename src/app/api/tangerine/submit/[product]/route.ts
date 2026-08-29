import { NextResponse, type NextRequest } from 'next/server'
import { generateComprehensivePolicy, generateThirdPartyPolicy, getValuationLimits } from '@/lib/tangerine/api'
import { resolveColourCode, resolveEngineCapacityCode, resolveLgaCode, resolveStateCode, resolveVehicleCodes } from '@/lib/tangerine/resolve'
import { imageHostingConfigured, uploadVehicleImage } from '@/lib/tangerine/images'
import { toTangerineDate } from '@/lib/tangerine/mappers'
import { TANGERINE_DOCUMENT_SLOTS } from '@/lib/tangerine/documents'
import { tangerineErrorResponse } from '@/lib/tangerine/http'
import { tangerineCustomerSchema, tangerineMotorSchema, fieldErrors } from '@/lib/tangerine/schemas'
import { tangerineDemoMode, tangerineUserId } from '@/lib/tangerine/config'
import { TangerineError } from '@/lib/tangerine/client'
import { validateFileBasics } from '@/lib/nsia/files'
import type { TangerineImageUrls } from '@/lib/tangerine/types'

/**
 * `POST /api/tangerine/submit/{product}` where product is `comprehensive` or
 * `thirdparty`. Accepts multipart/form-data:
 *   - `payload`: JSON string of `{ customer, motor }`
 *   - vehicle photo files under `FrontImageURL`, `ChasisImageURL`,
 *     `BackImageURL`, `SideImageURL`
 *
 * Tangerine's own numeric codes for make/model/colour/state/LGA are resolved
 * server-side by name against its master-data endpoints (see
 * `lib/tangerine/resolve.ts`) so the UI only ever deals in plain text.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ product: string }> }) {
  const { product } = await context.params
  if (product !== 'comprehensive' && product !== 'thirdparty') {
    return NextResponse.json({ success: false, error: `Unknown Tangerine product "${product}".` }, { status: 404 })
  }

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

  let payload: { customer?: unknown; motor?: unknown }
  try {
    payload = JSON.parse(rawPayload)
  } catch {
    return NextResponse.json({ success: false, error: 'The "payload" field is not valid JSON.' }, { status: 400 })
  }

  const customerParsed = tangerineCustomerSchema.safeParse(payload.customer)
  const motorParsed = tangerineMotorSchema.safeParse(payload.motor)
  if (!customerParsed.success || !motorParsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Some details are missing or invalid.',
        fields: {
          ...(customerParsed.success ? {} : prefixed('customer', fieldErrors(customerParsed.error))),
          ...(motorParsed.success ? {} : prefixed('motor', fieldErrors(motorParsed.error))),
        },
      },
      { status: 400 }
    )
  }
  const customer = customerParsed.data
  const motor = motorParsed.data

  if (!imageHostingConfigured()) {
    return NextResponse.json(
      { success: false, error: 'Vehicle photo hosting is not configured.' },
      { status: 503 }
    )
  }

  const files: Partial<Record<string, File>> = {}
  const fileErrors: Record<string, string> = {}
  for (const slot of TANGERINE_DOCUMENT_SLOTS) {
    const value = form.get(slot.slot)
    if (!value || typeof value === 'string') continue
    const problem = validateFileBasics({ name: value.name, size: value.size, type: value.type })
    if (problem) fileErrors[slot.slot] = problem
    else files[slot.slot] = value
  }
  if (Object.keys(fileErrors).length > 0) {
    return NextResponse.json({ success: false, error: 'Some photos are invalid.', fields: fileErrors }, { status: 400 })
  }
  const missing = TANGERINE_DOCUMENT_SLOTS.filter((s) => s.required && !files[s.slot])
  if (missing.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: 'Some required photos are missing.',
        fields: Object.fromEntries(missing.map((s) => [s.slot, `${s.label} is required.`])),
      },
      { status: 400 }
    )
  }

  if (!tangerineUserId() && !tangerineDemoMode()) {
    return NextResponse.json(
      { success: false, error: 'Tangerine integration is not configured.' },
      { status: 503 }
    )
  }

  try {
    const [{ makeCode, modelCode }, colourCode, state, engineCapacityCode, uploadedUrls] = await Promise.all([
      resolveVehicleCodes(product, motor.vehicleMakeModel),
      resolveColourCode(product, motor.colour),
      resolveStateCode(product, motor.state),
      resolveEngineCapacityCode(product, motor.engineCapacity),
      uploadRequiredImages(files),
    ])
    const lgaCode = await resolveLgaCode(product, state.code, motor.lga)

    if (product === 'comprehensive') {
      const limits = await getValuationLimits()
      if (motor.valuation != null && (motor.valuation < limits.lower || motor.valuation > limits.upper)) {
        throw new TangerineError(
          `Vehicle valuation must be between ${limits.lower.toLocaleString()} and ${limits.upper.toLocaleString()}.`,
          400
        )
      }

      const result = await generateComprehensivePolicy({
        InsuredName: customer.fullName,
        GSMNumber: customer.phone,
        ChasisNumber: motor.chassisNumber,
        RegistrationNo: motor.registrationNumber,
        PolicyType: customer.userType === 'corporate' ? '2' : '1',
        YearofMake: String(motor.yearOfMake),
        Email: customer.email,
        EngineCapacityCode: engineCapacityCode,
        StateCode: state.code,
        LGACode: lgaCode,
        VehicleMakeCode: makeCode,
        VehicleColorCode: colourCode,
        VehicleModelCode: modelCode,
        TIN: customer.userType === 'corporate' ? customer.tin : undefined,
        NIN: customer.nin || undefined,
        BVN: customer.bvn || undefined,
        Valuation: String(motor.valuation ?? 0),
        ContactAddress: customer.address,
        milageKM: String(motor.mileageKm ?? 0),
        VehicleRegistrationDate: toTangerineDate(motor.vehicleRegistrationDate),
        ImageUrlList: [uploadedUrls],
      })
      return NextResponse.json(toResponse(result))
    }

    const policyTypeMap = { private: '1', commercial: '2', tricycle: '3' } as const
    const result = await generateThirdPartyPolicy({
      InsuredName: customer.fullName,
      GSMNumber: customer.phone,
      ChasisNumber: motor.chassisNumber,
      RegistrationNo: motor.registrationNumber,
      VehicleMakeCode: makeCode,
      VehicleModelCode: modelCode,
      VehicleColorCode: colourCode,
      StateCode: state.code,
      LGACode: lgaCode,
      YearofMake: String(motor.yearOfMake),
      Email: customer.email,
      PolicyType: policyTypeMap[motor.usageType ?? 'private'],
      EngineCapacityCode: engineCapacityCode,
    })
    return NextResponse.json(toResponse(result))
  } catch (error) {
    return tangerineErrorResponse(error)
  }
}

async function uploadRequiredImages(files: Partial<Record<string, File>>): Promise<TangerineImageUrls> {
  const [front, chassis, back, side] = await Promise.all([
    uploadVehicleImage(files.FrontImageURL!),
    uploadVehicleImage(files.ChasisImageURL!),
    files.BackImageURL ? uploadVehicleImage(files.BackImageURL) : Promise.resolve(undefined),
    files.SideImageURL ? uploadVehicleImage(files.SideImageURL) : Promise.resolve(undefined),
  ])
  return { FrontImageURL: front, ChasisImageURL: chassis, BackImageURL: back, SideImageURL: side }
}

function toResponse(result: {
  PolicyNo?: string
  CertificateURL?: string
  CertificateURLTemp?: string
  TransactionReferenceNo?: string
  Premium?: string
  SumAssured?: string
  Message?: string
}) {
  return {
    success: true,
    policyNumber: result.PolicyNo ?? null,
    certificateUrl: result.CertificateURL ?? result.CertificateURLTemp ?? null,
    transactionReferenceNo: result.TransactionReferenceNo ?? null,
    premium: result.Premium ?? null,
    sumAssured: result.SumAssured ?? null,
    message: result.Message ?? 'Policy created successfully',
  }
}

function prefixed(prefix: string, errors: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(errors).map(([field, message]) => [`${prefix}.${field}`, message]))
}
