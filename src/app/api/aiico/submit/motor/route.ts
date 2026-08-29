import { NextResponse, type NextRequest } from 'next/server'
import { finalizePartnerPayment, postMotorSchedule } from '@/lib/aiico/api'
import { toComprehensiveSchedule, toFinalizePayment, toThirdPartySchedule } from '@/lib/aiico/mappers'
import { aiicoMotorSubmitSchema, fieldErrors } from '@/lib/aiico/schemas'
import { aiicoErrorResponse } from '@/lib/aiico/http'

/**
 * `POST /api/aiico/submit/motor` — { line, wefDt, wetDt, customer, vehicle, images, payment }
 *
 * AIICO splits new business into two calls: `PostMotorSchedule` (registers
 * the risk and returns a `transactionRef` + the authoritative premium) and
 * `FinalizePartnerPayment` (confirms the customer has actually paid that
 * amount). This route runs both in one request — call it only after payment
 * has been collected, since `amountPaid` here must match what was charged.
 */
export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = aiicoMotorSubmitSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) }, { status: 400 })
  }
  const { line, wefDt, wetDt, customer, vehicle, images, payment } = parsed.data

  try {
    const schedule = line === 'third-party'
      ? await postMotorSchedule(toThirdPartySchedule(customer, vehicle, images, { wefDt, wetDt }, payment.amountPaid))
      : await postMotorSchedule(toComprehensiveSchedule(customer, vehicle, images, { wefDt, wetDt }))

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
