import { NextResponse, type NextRequest } from 'next/server'
import { getLifePolicyRenewalDetails } from '@/lib/aiico/api'
import { aiicoErrorResponse } from '@/lib/aiico/http'

/** `GET /api/aiico/life-renewal?policyNo=NCSP/IB/2017/077067` */
export async function GET(request: NextRequest) {
  const policyNo = request.nextUrl.searchParams.get('policyNo')?.trim()
  if (!policyNo) {
    return NextResponse.json({ success: false, error: 'A "policyNo" parameter is required.' }, { status: 400 })
  }

  try {
    const data = await getLifePolicyRenewalDetails(policyNo)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return aiicoErrorResponse(error)
  }
}
