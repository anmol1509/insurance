import { NextResponse } from 'next/server'
import { fortisLogin } from '@/lib/fortis/client'
import { getClientProfile } from '@/lib/fortis/api'
import { fortisErrorResponse } from '@/lib/fortis/http'

/** Guide section 2 — GET /external-api/me. Confirms the token and returns the client's catalog scope. */
export async function GET() {
  try {
    const token = await fortisLogin()
    const profile = await getClientProfile(token)
    return NextResponse.json({ success: true, profile })
  } catch (error) {
    return fortisErrorResponse(error)
  }
}
