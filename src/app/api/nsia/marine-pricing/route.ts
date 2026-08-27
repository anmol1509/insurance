import { NextResponse, type NextRequest } from 'next/server'
import { calculateMarinePremium } from '@/lib/nsia/api'
import { nsiaErrorResponse, validationResponse } from '@/lib/nsia/http'
import { fieldErrors, marinePricingSchema } from '@/lib/nsia/schemas'

/** Guide section 8.2 — marine premium calculator, ahead of submission. */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Expected a JSON body.' },
      { status: 400 }
    )
  }

  const parsed = marinePricingSchema.safeParse(body)
  if (!parsed.success) return validationResponse(fieldErrors(parsed.error))

  try {
    const pricing = await calculateMarinePremium(parsed.data)
    return NextResponse.json({ success: true, pricing })
  } catch (error) {
    return nsiaErrorResponse(error)
  }
}
