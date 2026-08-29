/** Shared response helpers for the /api/fortis/* route handlers. */
import { NextResponse } from 'next/server'
import { FortisError } from './client'

export function fortisErrorResponse(error: unknown): NextResponse {
  if (error instanceof FortisError) {
    console.error(`[fortis] ${error.status} ${error.message}`, error.detail ?? '')

    const status = error.status >= 400 && error.status <= 599 ? error.status : 502
    const passthrough = status === 404 || status === 422 || status === 503
    return NextResponse.json(
      { success: false, error: passthrough ? error.message : 'We could not reach Fortis. Please try again shortly.' },
      { status }
    )
  }

  console.error('[fortis] unexpected error', error)
  return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
}
