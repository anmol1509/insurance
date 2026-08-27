import { NextResponse, type NextRequest } from 'next/server'
import { getDropdown } from '@/lib/nsia/api'
import { nsiaErrorResponse } from '@/lib/nsia/http'
import { dropdownParamSchema } from '@/lib/nsia/schemas'
import { NSIA_DROPDOWNS, type NsiaDropdown } from '@/lib/nsia/types'

/**
 * Guide sections 6, 7.1, 8.1 and 10.1 — master data for form dropdowns.
 *
 * `GET /api/nsia/dropdowns?name=vehicle-brand` returns one list;
 * `?name=vehicle-brand,vehicle-color` returns several in a single round trip.
 */

/** Master data barely moves, so serve it from memory for an hour. */
const CACHE_TTL_MS = 60 * 60 * 1000

const cache = new Map<NsiaDropdown, { value: unknown; expiresAt: number }>()

async function loadDropdown(name: NsiaDropdown): Promise<unknown> {
  const hit = cache.get(name)
  if (hit && hit.expiresAt > Date.now()) return hit.value

  const value = await getDropdown(name)
  cache.set(name, { value, expiresAt: Date.now() + CACHE_TTL_MS })
  return value
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('name')?.trim()

  if (!raw) {
    return NextResponse.json(
      { success: false, error: 'A "name" parameter is required.', available: NSIA_DROPDOWNS },
      { status: 400 }
    )
  }

  const requested = raw.split(',').map((part) => part.trim()).filter(Boolean)
  const names: NsiaDropdown[] = []

  for (const candidate of requested) {
    const parsed = dropdownParamSchema.safeParse(candidate)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: `Unknown dropdown "${candidate}".`, available: NSIA_DROPDOWNS },
        { status: 400 }
      )
    }
    names.push(parsed.data as NsiaDropdown)
  }

  try {
    const entries = await Promise.all(
      names.map(async (name) => [name, await loadDropdown(name)] as const)
    )
    return NextResponse.json({ success: true, data: Object.fromEntries(entries) })
  } catch (error) {
    return nsiaErrorResponse(error)
  }
}
