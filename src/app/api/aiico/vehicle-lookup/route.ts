import { NextResponse, type NextRequest } from 'next/server'
import { getVehicleDetails } from '@/lib/aiico/api'
import { aiicoErrorResponse } from '@/lib/aiico/http'

/** `GET /api/aiico/vehicle-lookup?plate=SOJ003` — looks up a vehicle registered with AutoReg. */
export async function GET(request: NextRequest) {
  const plate = request.nextUrl.searchParams.get('plate')?.trim()
  if (!plate) {
    return NextResponse.json({ success: false, error: 'A "plate" parameter is required.' }, { status: 400 })
  }

  try {
    const data = await getVehicleDetails(plate)
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return aiicoErrorResponse(error)
  }
}
