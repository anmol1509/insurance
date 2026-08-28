import { NextResponse, type NextRequest } from 'next/server'
import { submitPayment } from '@/lib/payloft/api'
import { payloftErrorResponse, validationResponse } from '@/lib/payloft/http'
import { fieldErrors, payRequestSchema } from '@/lib/payloft/schemas'

/**
 * Guide step 3 — submit payment (card, PayAttitude, or the first half of a
 * bank transfer). An order can only be submitted once; resubmitting one that
 * has left the 'Initiated' state is rejected by Payloft with HTTP 400.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params
  const id = Number(orderId)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ success: false, error: 'Invalid order id.' }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = payRequestSchema.safeParse(body)
  if (!parsed.success) return validationResponse(fieldErrors(parsed.error))

  try {
    const result = await submitPayment(id, parsed.data)
    return NextResponse.json({ success: true, result })
  } catch (error) {
    return payloftErrorResponse(error)
  }
}
