import { NextResponse } from 'next/server'
import { fortisLogin } from '@/lib/fortis/client'
import { listMotorRequests } from '@/lib/fortis/api'
import { fortisErrorResponse } from '@/lib/fortis/http'

/**
 * Guide section 4 — GET /external-api/motor/requests. Lists the requests
 * this platform has submitted to Fortis's temporary review table.
 */
export async function GET() {
  try {
    const token = await fortisLogin()
    const requests = await listMotorRequests(token)
    return NextResponse.json({ success: true, requests })
  } catch (error) {
    return fortisErrorResponse(error)
  }
}
