import { NextResponse, type NextRequest } from 'next/server'
import { computeThirdPartyMotorPremium } from '@/lib/aiico/api'
import { aiicoErrorResponse } from '@/lib/aiico/http'

const VALID_BODY_TYPES = ['Bus', 'Car', 'Jeep - Suv', 'Truck']

/** `GET /api/aiico/premium?bodyType=Car` — the fixed Third Party premium for a body type. */
export async function GET(request: NextRequest) {
  const bodyType = request.nextUrl.searchParams.get('bodyType')?.trim()
  if (!bodyType || !VALID_BODY_TYPES.includes(bodyType)) {
    return NextResponse.json(
      { success: false, error: `A valid "bodyType" is required: ${VALID_BODY_TYPES.join(', ')}.` },
      { status: 400 }
    )
  }

  try {
    const premium = await computeThirdPartyMotorPremium(bodyType)
    return NextResponse.json({ success: true, premium })
  } catch (error) {
    return aiicoErrorResponse(error)
  }
}
