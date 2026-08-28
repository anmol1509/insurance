import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { validateVehicle } from '@/lib/verifydata/client'
import { verifyDataErrorResponse } from '@/lib/verifydata/http'
import { toMotorFields } from '@/lib/verifydata/mappers'

const lookupSchema = z.object({
  regNumber: z.string().min(1, 'Enter a registration number'),
})

/** Guide "VERIFY VEHICLE" — looks up a vehicle by registration number. */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = lookupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'A registration number is required.' }, { status: 400 })
  }

  try {
    const vehicle = await validateVehicle(parsed.data.regNumber.trim().toUpperCase())
    return NextResponse.json({ success: true, vehicle, fields: toMotorFields(vehicle) })
  } catch (error) {
    return verifyDataErrorResponse(error)
  }
}
