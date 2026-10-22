import { NextResponse, type NextRequest } from 'next/server'

const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/i
const simplify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

function findPhotoUrl(value: unknown): string | null {
  if (typeof value === 'string') {
    try {
      const url = new URL(value)
      const imageHost = url.hostname.endsWith('.data.retail') || url.hostname.endsWith('.photos.vin')
      const autoDevPhoto = url.hostname === 'api.auto.dev' && (/\/photos?\//i.test(url.pathname) || /\.(jpe?g|png|webp)$/i.test(url.pathname))
      if (url.protocol === 'https:' && (imageHost || autoDevPhoto)) return value
    } catch {}
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findPhotoUrl(item)
      if (found) return found
    }
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      const found = findPhotoUrl(item)
      if (found) return found
    }
  }
  return null
}

export async function GET(request: NextRequest) {
  const vin = request.nextUrl.searchParams.get('vin')?.trim().toUpperCase() ?? ''
  const make = request.nextUrl.searchParams.get('make')?.trim() ?? ''
  const model = request.nextUrl.searchParams.get('model')?.trim() ?? ''
  const year = request.nextUrl.searchParams.get('year')?.trim() ?? ''
  const hasVin = vinPattern.test(vin)
  if (!hasVin && (!make || !model)) return NextResponse.json({ success: false, error: 'Provide a valid VIN or a make and model.' }, { status: 400 })
  if (year && !/^\d{4}$/.test(year)) return NextResponse.json({ success: false, error: 'Year must contain four digits.' }, { status: 400 })

  const apiKey = process.env.AUTO_DEV_API_KEY
  if (!apiKey) return NextResponse.json({ success: false, error: 'Vehicle photos are unavailable.' }, { status: 503 })

  try {
    const endpoint = hasVin
      ? `https://api.auto.dev/photos/${encodeURIComponent(vin)}`
      : (() => {
          const params = new URLSearchParams({ 'vehicle.make': make, 'vehicle.model': model, limit: '10' })
          if (year) params.set('vehicle.year', year)
          return `https://api.auto.dev/listings?${params}`
        })()
    const response = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8_000),
    })
    if (!response.ok) return NextResponse.json({ success: false, error: 'No matching vehicle photo was found.' }, { status: 404 })
    const payload: unknown = await response.json()
    let imageUrl: string | null = null
    if (hasVin) {
      imageUrl = findPhotoUrl(payload)
    } else if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
      const match = (payload as { data: unknown[] }).data.find((row) => {
        if (!row || typeof row !== 'object') return false
        const vehicle = (row as { vehicle?: unknown }).vehicle
        if (!vehicle || typeof vehicle !== 'object') return false
        const fields = vehicle as Record<string, unknown>
        return typeof fields.make === 'string' && simplify(fields.make) === simplify(make)
          && typeof fields.model === 'string' && simplify(fields.model) === simplify(model)
          && (!year || String(fields.year) === year)
      })
      if (match && typeof match === 'object') {
        const retailListing = (match as { retailListing?: unknown }).retailListing
        if (retailListing && typeof retailListing === 'object') imageUrl = findPhotoUrl((retailListing as { primaryImage?: unknown }).primaryImage)
      }
    }
    if (!imageUrl) return NextResponse.json({ success: false, error: 'No matching vehicle photo was found.' }, { status: 404 })
    return NextResponse.json({ success: true, imageUrl, matchedBy: hasVin ? 'vin' : year ? 'make-model-year' : 'make-model' })
  } catch {
    return NextResponse.json({ success: false, error: 'Vehicle photos are temporarily unavailable.' }, { status: 502 })
  }
}
