import { NextResponse } from 'next/server'
import { confirmTransfer } from '@/lib/payloft/api'
import { payloftErrorResponse } from '@/lib/payloft/http'

/** Guide step 3b — simulates the bank crediting the virtual account. No request body. */
export async function POST(_request: Request, context: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await context.params
  const id = Number(orderId)
  if (!Number.isInteger(id)) {
    return NextResponse.json({ success: false, error: 'Invalid order id.' }, { status: 400 })
  }

  try {
    const result = await confirmTransfer(id)
    return NextResponse.json({ success: true, result })
  } catch (error) {
    return payloftErrorResponse(error)
  }
}
