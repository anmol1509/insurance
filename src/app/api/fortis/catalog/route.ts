import { NextResponse } from 'next/server'
import { loginAndGetCatalog } from '@/lib/fortis/api'
import { fortisErrorResponse } from '@/lib/fortis/http'

/** Guide section 3 — GET /external-api/motor/catalog, scoped to the motor product family. */
export async function GET() {
  try {
    const { catalog } = await loginAndGetCatalog()
    return NextResponse.json({ success: true, catalog })
  } catch (error) {
    return fortisErrorResponse(error)
  }
}
