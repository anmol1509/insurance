import { NextResponse } from 'next/server'
import { filterAutoDevCatalog, nigeriaCatalog } from '@/lib/autoDev/catalog'

export const revalidate = 86400

export async function GET() {
  const apiKey = process.env.AUTO_DEV_API_KEY
  if (!apiKey) {
    return NextResponse.json({ success: true, source: 'nigeria-fallback', makes: nigeriaCatalog() })
  }

  try {
    const response = await fetch('https://auto.dev/api/models', {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(8_000),
    })
    if (!response.ok) throw new Error(`Auto.dev returned ${response.status}`)
    const payload: unknown = await response.json()
    return NextResponse.json({ success: true, source: 'auto.dev', makes: filterAutoDevCatalog(payload) })
  } catch {
    return NextResponse.json({ success: true, source: 'nigeria-fallback', makes: nigeriaCatalog() })
  }
}
