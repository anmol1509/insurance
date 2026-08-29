/** Shared response helpers for the /api/aiico/* route handlers. */
import { NextResponse } from 'next/server'
import { AiicoError } from './client'

export function aiicoErrorResponse(error: unknown): NextResponse {
  if (error instanceof AiicoError) {
    console.error(`[aiico] ${error.status} ${error.message}`, error.detail ?? '')

    const status = error.status >= 400 && error.status <= 599 ? error.status : 502
    // AIICO's own validation errors (bad productId, invalid body type, etc.)
    // are meant for the caller; config/transport failures are not.
    const passthrough = status === 400 || status === 404 || status === 503
    return NextResponse.json(
      { success: false, error: passthrough ? error.message : 'We could not complete this with AIICO. Please try again shortly.' },
      { status }
    )
  }

  console.error('[aiico] unexpected error', error)
  return NextResponse.json(
    { success: false, error: 'Something went wrong. Please try again.' },
    { status: 500 }
  )
}
