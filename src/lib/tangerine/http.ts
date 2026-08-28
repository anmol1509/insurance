/** Shared response helpers for the /api/tangerine/* route handlers. */
import { NextResponse } from 'next/server'
import { TangerineError } from './client'

export function tangerineErrorResponse(error: unknown): NextResponse {
  if (error instanceof TangerineError) {
    console.error(`[tangerine] ${error.status} ${error.message}`, error.detail ?? '')

    const status = error.status >= 400 && error.status <= 599 ? error.status : 502
    // Tangerine's own decline/validation messages are meant for the caller,
    // e.g. "The Registration no already exist for an Active Policy." —
    // pass those through; everything else (config, transport) is generic.
    const passthrough = status === 400 || status === 404 || status === 503
    return NextResponse.json(
      { success: false, error: passthrough ? error.message : 'We could not complete this with Tangerine. Please try again shortly.' },
      { status }
    )
  }

  console.error('[tangerine] unexpected error', error)
  return NextResponse.json(
    { success: false, error: 'Something went wrong. Please try again.' },
    { status: 500 }
  )
}
