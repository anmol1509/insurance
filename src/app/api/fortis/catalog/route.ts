import { NextResponse } from 'next/server'

const FORTIS_BASE = 'https://jjmgloballtd.com/coreinsurance/api'

async function getToken(): Promise<string> {
  const res = await fetch(`${FORTIS_BASE}/external-api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.FORTIS_CLIENT_ID,
      client_secret: process.env.FORTIS_CLIENT_SECRET,
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Auth failed (${res.status}): ${text.slice(0, 100)}`)
  }
  const data = await res.json()
  return data.token ?? data.access_token ?? data.data?.token
}

export async function GET() {
  try {
    const token = await getToken()
    const res = await fetch(`${FORTIS_BASE}/external-api/motor/catalog`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`Catalog failed (${res.status})`)
    const catalog = await res.json()
    return NextResponse.json({ success: true, catalog })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
