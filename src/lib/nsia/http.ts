/** Shared response helpers for the /api/nsia/* route handlers. */
import { NextResponse } from 'next/server'
import { NsiaError } from './client'

/**
 * Turns any thrown value into a JSON response.
 *
 * Guide section 13.2 asks integrators to log the full error but show users a
 * friendly message, so only NSIA's own validation text (4xx about the
 * submitted data) is passed through. Auth, transport and infrastructure
 * failures are logged here and reported generically — those say nothing a
 * customer can act on, and can leak internal detail.
 */
export function nsiaErrorResponse(error: unknown): NextResponse {
  if (error instanceof NsiaError) {
    console.error(`[nsia] ${error.status} ${error.message}`, error.detail ?? '')

    const status = error.status >= 400 && error.status <= 599 ? error.status : 502
    return NextResponse.json(
      { success: false, error: userFacingMessage(error) },
      { status }
    )
  }

  console.error('[nsia] unexpected error', error)
  return NextResponse.json(
    { success: false, error: 'Something went wrong. Please try again.' },
    { status: 500 }
  )
}

function userFacingMessage(error: NsiaError): string {
  const { status } = error

  // 400 and 422 describe the data we sent, which is the customer's to correct.
  if (status === 400 || status === 422) return error.message
  if (status === 504) return 'The insurer took too long to respond. Please try again.'
  if (status === 503) return error.message
  if (status === 401 || status === 403) {
    return 'We could not authenticate with NSIA Insurance. Our team has been notified.'
  }
  if (status === 404) return 'That request was not recognised by NSIA Insurance.'

  return 'We could not complete this with NSIA Insurance. Please try again shortly.'
}

export function validationResponse(fields: Record<string, string>): NextResponse {
  return NextResponse.json(
    { success: false, error: 'Some details are missing or invalid.', fields },
    { status: 400 }
  )
}
