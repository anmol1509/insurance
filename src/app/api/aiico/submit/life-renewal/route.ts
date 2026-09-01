import { NextResponse, type NextRequest } from 'next/server'
import { finalizePartnerPayment, postLifeRenewalSchedule } from '@/lib/aiico/api'
import { toFinalizePayment, toLifeRenewalSchedule } from '@/lib/aiico/mappers'
import { aiicoLifeRenewalSubmitSchema, fieldErrors } from '@/lib/aiico/schemas'
import { aiicoErrorResponse } from '@/lib/aiico/http'

/**
 * `POST /api/aiico/submit/life-renewal` — same two-call pattern as Motor
 * Renewal (`PostLifeRenewalSchedule` then `FinalizePartnerPayment`); call
 * only after payment has been collected.
 */
export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = aiicoLifeRenewalSubmitSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) }, { status: 400 })
  }
  const { payment, ...rest } = parsed.data

  try {
    const schedule = await postLifeRenewalSchedule(toLifeRenewalSchedule(rest))
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
