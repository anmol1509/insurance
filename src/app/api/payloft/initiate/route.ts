import { NextResponse, type NextRequest } from 'next/server'
import { initiateOrder } from '@/lib/payloft/api'
import { payloftErrorResponse, validationResponse } from '@/lib/payloft/http'
import { fieldErrors, initiateSchema } from '@/lib/payloft/schemas'

/** Guide step 1 — creates a sandbox order. The secret key never leaves the server. */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = initiateSchema.safeParse(body)
  if (!parsed.success) return validationResponse(fieldErrors(parsed.error))

  try {
    const order = await initiateOrder({
      amount: parsed.data.amount,
      description: parsed.data.description,
      returnUrl: parsed.data.returnUrl,
      customerName: parsed.data.customerName,
      email: parsed.data.email || undefined,
      referenceId: parsed.data.referenceId,
    })
    return NextResponse.json({ success: true, order })
  } catch (error) {
    return payloftErrorResponse(error)
  }
}
