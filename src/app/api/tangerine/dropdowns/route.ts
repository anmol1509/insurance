import { NextResponse, type NextRequest } from 'next/server'
import {
  getEngineCapacityCodes,
  getLGACodes,
  getStateCodes,
  getVehicleColours,
  getVehicleMakeCodes,
  getVehicleModelCodes,
} from '@/lib/tangerine/api'
import { tangerineErrorResponse } from '@/lib/tangerine/http'
import type { TangerineLine } from '@/lib/tangerine/config'

/**
 * Master data for both Tangerine product lines.
 * `GET /api/tangerine/dropdowns?line=comprehensive&name=makes,models,colours`
 */

type DropdownName = 'colours' | 'engine-capacity' | 'states' | 'lgas' | 'makes' | 'models'
const DROPDOWN_NAMES: DropdownName[] = ['colours', 'engine-capacity', 'states', 'lgas', 'makes', 'models']

const LOADERS: Record<DropdownName, (line: TangerineLine) => Promise<unknown>> = {
  colours: getVehicleColours,
  'engine-capacity': getEngineCapacityCodes,
  states: getStateCodes,
  lgas: getLGACodes,
  makes: getVehicleMakeCodes,
  models: getVehicleModelCodes,
}

/** These lists barely change; cache per line for an hour to avoid refetching thousands of rows. */
const CACHE_TTL_MS = 60 * 60 * 1000
const cache = new Map<string, { value: unknown; expiresAt: number }>()

async function loadDropdown(line: TangerineLine, name: DropdownName): Promise<unknown> {
  const key = `${line}:${name}`
  const hit = cache.get(key)
  if (hit && hit.expiresAt > Date.now()) return hit.value

  const value = await LOADERS[name](line)
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS })
  return value
}

export async function GET(request: NextRequest) {
  const line = request.nextUrl.searchParams.get('line') as TangerineLine | null
  if (line !== 'comprehensive' && line !== 'thirdparty') {
    return NextResponse.json(
      { success: false, error: 'A "line" parameter of "comprehensive" or "thirdparty" is required.' },
      { status: 400 }
    )
  }

  const raw = request.nextUrl.searchParams.get('name')?.trim()
  if (!raw) {
    return NextResponse.json(
      { success: false, error: 'A "name" parameter is required.', available: DROPDOWN_NAMES },
      { status: 400 }
    )
  }

  const requested = raw.split(',').map((part) => part.trim()).filter(Boolean) as DropdownName[]
  for (const name of requested) {
    if (!DROPDOWN_NAMES.includes(name)) {
      return NextResponse.json(
        { success: false, error: `Unknown dropdown "${name}".`, available: DROPDOWN_NAMES },
        { status: 400 }
      )
    }
  }

  try {
    const entries = await Promise.all(
      requested.map(async (name) => [name, await loadDropdown(line, name)] as const)
    )
    return NextResponse.json({ success: true, data: Object.fromEntries(entries) })
  } catch (error) {
    return tangerineErrorResponse(error)
  }
}
