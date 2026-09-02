import { NextResponse, type NextRequest } from 'next/server'
import { createClaim, listClaims } from '@/lib/db/claims'
import { isDatabaseConfigured } from '@/lib/db/client'
import { createClaimSchema, fieldErrors } from '@/lib/db/schemas'

function notConfiguredResponse() {
  return NextResponse.json(
    { success: false, error: 'No database is configured. Set POSTGRES_URL to enable the claims dashboard.' },
    { status: 503 }
  )
}

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()

  const { searchParams } = request.nextUrl
  try {
    const claims = await listClaims({
      status: searchParams.get('status') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    })
    return NextResponse.json({ success: true, claims })
  } catch (error) {
    console.error('[admin/claims] list failed', error)
    return NextResponse.json({ success: false, error: 'Could not load claims.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = createClaimSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) },
      { status: 400 }
    )
  }

  try {
    const claim = await createClaim({
      ...parsed.data,
      claimDate: parsed.data.claimDate || undefined,
      description: parsed.data.description || null,
    })
    return NextResponse.json({ success: true, claim }, { status: 201 })
  } catch (error) {
    console.error('[admin/claims] create failed', error)
    return NextResponse.json({ success: false, error: 'Could not create this claim.' }, { status: 500 })
  }
}
