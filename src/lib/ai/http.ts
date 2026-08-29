/** Shared response helpers for AI-backed /api/* route handlers. */
import { NextResponse } from 'next/server'
import { AiExtractionError } from './extractMotorDetails'

export function aiExtractionErrorResponse(error: unknown): NextResponse {
  if (error instanceof AiExtractionError) {
    console.error(`[ai-extraction] ${error.status} ${error.message}`)
    const status = error.status >= 400 && error.status <= 599 ? error.status : 502
    return NextResponse.json({ success: false, error: error.message }, { status })
  }

  console.error('[ai-extraction] unexpected error', error)
  return NextResponse.json({ success: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
}
