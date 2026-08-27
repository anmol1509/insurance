import { NextResponse, type NextRequest } from 'next/server'
import { ensureInsuredClient } from '@/lib/nsia/api'
import { nsiaErrorResponse, validationResponse } from '@/lib/nsia/http'
import { toProfilePayload } from '@/lib/nsia/mappers'
import { fieldErrors, profileRequestSchema } from '@/lib/nsia/schemas'

/**
 * Guide section 5.2 — create the insured client, or return the existing one.
 * The check-then-create pair lives on the server so a double submission can't
 * produce two profiles for the same email.
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Expected a JSON body.' },
      { status: 400 }
    )
  }

  const parsed = profileRequestSchema.safeParse(body)
  if (!parsed.success) return validationResponse(fieldErrors(parsed.error))

  try {
    const { client, created } = await ensureInsuredClient(
      parsed.data.email,
      toProfilePayload(parsed.data)
    )
    return NextResponse.json({ success: true, created, client })
  } catch (error) {
    return nsiaErrorResponse(error)
  }
}
