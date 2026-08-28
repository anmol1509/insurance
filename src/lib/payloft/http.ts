/** Shared response helpers for the /api/payloft/* route handlers. */
import { NextResponse } from 'next/server'
import { PayloftError } from './client'

export function payloftErrorResponse(error: unknown): NextResponse {
  if (error instanceof PayloftError) {
    console.error(`[payloft] ${error.status} ${error.message}`, error.detail ?? '')

    const status = error.status >= 400 && error.status <= 599 ? error.status : 502
    // Payloft's own decline/validation messages are meant for the payer
    // (e.g. "insufficient funds"); transport/config failures are generic.
    const passthrough = status === 400 || status === 402 || status === 403 || status === 404 || status === 503
    return NextResponse.json(
      { success: false, error: passthrough ? error.message : 'We could not reach the payment provider. Please try again.' },
      { status }
    )
  }

  console.error('[payloft] unexpected error', error)
  return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
}

export function validationResponse(fields: Record<string, string>): NextResponse {
  return NextResponse.json({ success: false, error: 'Some payment details are missing or invalid.', fields }, { status: 400 })
}
