import { NextResponse, type NextRequest } from 'next/server'
import {
  getBodyTypes,
  getColorList,
  getGenders,
  getManufactureYears,
  getProducts,
  getProductSubClassCoverTypes,
  getTitles,
  getTravelSubClassCoverTypes,
  getVehicleMakes,
  getVehicleMakeModels,
} from '@/lib/aiico/api'
import { aiicoErrorResponse } from '@/lib/aiico/http'

/**
 * Master data for the AIICO Motor products.
 * `GET /api/aiico/dropdowns?name=titles,genders,body-types,colors,years`
 * `GET /api/aiico/dropdowns?name=makes&year=2006`
 * `GET /api/aiico/dropdowns?name=models&make=ACURA&year=2006`
 * `GET /api/aiico/dropdowns?name=subclass-covers&productId=...`
 * `GET /api/aiico/dropdowns?name=travel-subclass-covers`
 */

type DropdownName = 'titles' | 'genders' | 'body-types' | 'colors' | 'years' | 'makes' | 'models' | 'products' | 'subclass-covers' | 'travel-subclass-covers'
const DROPDOWN_NAMES: DropdownName[] = ['titles', 'genders', 'body-types', 'colors', 'years', 'makes', 'models', 'products', 'subclass-covers', 'travel-subclass-covers']

/** These lists barely change; cache for an hour to avoid refetching on every step of the flow. */
const CACHE_TTL_MS = 60 * 60 * 1000
const cache = new Map<string, { value: unknown; expiresAt: number }>()

async function cached(key: string, load: () => Promise<unknown>): Promise<unknown> {
  const hit = cache.get(key)
  if (hit && hit.expiresAt > Date.now()) return hit.value
  const value = await load()
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS })
  return value
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const raw = params.get('name')?.trim()
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
      requested.map(async (name): Promise<[string, unknown]> => {
        switch (name) {
          case 'titles': return [name, await cached('titles', getTitles)]
          case 'genders': return [name, await cached('genders', getGenders)]
          case 'body-types': return [name, await cached('body-types', getBodyTypes)]
          case 'colors': return [name, await cached('colors', getColorList)]
          case 'years': return [name, await cached('years', getManufactureYears)]
          case 'products': return [name, await cached('products', getProducts)]
          case 'makes': {
            const year = params.get('year')
            if (!year) throw Object.assign(new Error('A "year" parameter is required for "makes".'), { status: 400 })
            return [name, await cached(`makes:${year}`, () => getVehicleMakes(year))]
          }
          case 'models': {
            const make = params.get('make')
            const year = params.get('year')
            if (!make || !year) throw Object.assign(new Error('"make" and "year" parameters are required for "models".'), { status: 400 })
            return [name, await cached(`models:${make}:${year}`, () => getVehicleMakeModels(make, year))]
          }
          case 'subclass-covers': {
            const productId = params.get('productId')
            if (!productId) throw Object.assign(new Error('A "productId" parameter is required for "subclass-covers".'), { status: 400 })
            return [name, await cached(`subclass-covers:${productId}`, () => getProductSubClassCoverTypes(productId))]
          }
          case 'travel-subclass-covers': return [name, await cached('travel-subclass-covers', getTravelSubClassCoverTypes)]
        }
      })
    )
    return NextResponse.json({ success: true, data: Object.fromEntries(entries) })
  } catch (error) {
    if (error instanceof Error && 'status' in error && (error as { status?: number }).status === 400) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }
    return aiicoErrorResponse(error)
  }
}
