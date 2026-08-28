import { NextResponse } from 'next/server'
import { getResult } from '@/lib/payloft/api'
import { payloftErrorResponse } from '@/lib/payloft/http'

/** Guide step 4 — the correct endpoint to poll for the final transaction status. */
export async function GET(_request: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params
  const id = Number(orderId)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ success: false, error: 'Invalid order id.' }, { status: 400 })
  }

  try {
    const result = await getResult(id)
    return NextResponse.json({ success: true, result })
  } catch (error) {
    return payloftErrorResponse(error)
  }
}
