import { NextResponse, type NextRequest } from 'next/server'
import { finalizePartnerPayment, postMotorRenewalSchedule } from '@/lib/aiico/api'
import { toFinalizePayment, toRenewalSchedule } from '@/lib/aiico/mappers'
import { aiicoRenewalSubmitSchema, fieldErrors } from '@/lib/aiico/schemas'
import { aiicoErrorResponse } from '@/lib/aiico/http'

/**
 * `POST /api/aiico/submit/motor-renewal` — same two-call pattern as new
 * business (`PostMotorRenewalSchedule` then `FinalizePartnerPayment`); call
 * only after payment has been collected.
 */
export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = aiicoRenewalSubmitSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) }, { status: 400 })
  }
  const { payment, ...rest } = parsed.data

  try {
    const schedule = await postMotorRenewalSchedule(toRenewalSchedule(rest))
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
