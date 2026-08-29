import { NextResponse } from 'next/server'
import { fortisLogin } from '@/lib/fortis/client'
import { getMotorRequest } from '@/lib/fortis/api'
import { fortisErrorResponse } from '@/lib/fortis/http'

/** Guide section 4 — GET /external-api/motor/requests/{requestRecord}. */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const token = await fortisLogin()
    const record = await getMotorRequest(token, id)
    return NextResponse.json({ success: true, request: record })
  } catch (error) {
    return fortisErrorResponse(error)
  }
}
