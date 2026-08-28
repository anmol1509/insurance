/** Shared response helpers for the /api/verifydata/* route handlers. */
import { NextResponse } from 'next/server'
import { VerifyDataError } from './client'

export function verifyDataErrorResponse(error: unknown): NextResponse {
  if (error instanceof VerifyDataError) {
    console.error(`[verifydata] ${error.status} ${error.message}`, error.detail ?? '')

    const status = error.status >= 400 && error.status <= 599 ? error.status : 502
    // 404 means the plate genuinely wasn't found — worth telling the caller.
    // Auth/wallet/transport failures are our problem, not the customer's.
    const passthrough = status === 404 || status === 503
    return NextResponse.json(
      { success: false, error: passthrough ? error.message : 'Vehicle lookup is temporarily unavailable.' },
      { status }
    )
  }

  console.error('[verifydata] unexpected error', error)
  return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
}
