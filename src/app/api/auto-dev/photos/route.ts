import { NextResponse, type NextRequest } from 'next/server'

const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/i

function findPhotoUrl(value: unknown): string | null {
  if (typeof value === 'string' && /^https:\/\/(api\.auto\.dev|[^/]+\.data\.retail)\//i.test(value)) return value
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
  if (!vinPattern.test(vin)) {
    return NextResponse.json({ success: false, error: 'A valid 17-character VIN is required.' }, { status: 400 })
  }

  const apiKey = process.env.AUTO_DEV_API_KEY
  if (!apiKey) return NextResponse.json({ success: false, error: 'Vehicle photos are unavailable.' }, { status: 503 })

  try {
    const response = await fetch(`https://api.auto.dev/photos/${encodeURIComponent(vin)}`, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(8_000),
    })
    if (!response.ok) return NextResponse.json({ success: false, error: 'No matching vehicle photo was found.' }, { status: 404 })
    const payload: unknown = await response.json()
    const imageUrl = findPhotoUrl(payload)
    if (!imageUrl) return NextResponse.json({ success: false, error: 'No matching vehicle photo was found.' }, { status: 404 })
    return NextResponse.json({ success: true, imageUrl })
  } catch {
    return NextResponse.json({ success: false, error: 'Vehicle photos are temporarily unavailable.' }, { status: 502 })
  }
}
