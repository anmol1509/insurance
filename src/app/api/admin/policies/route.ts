import { NextResponse, type NextRequest } from 'next/server'
import { createPolicy, listPolicies } from '@/lib/db/policies'
import { isDatabaseConfigured } from '@/lib/db/client'
import { createPolicySchema, fieldErrors } from '@/lib/db/schemas'

function notConfiguredResponse() {
  return NextResponse.json(
    { success: false, error: 'No database is configured. Set POSTGRES_URL to enable the policies dashboard.' },
    { status: 503 }
  )
}

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()

  const { searchParams } = request.nextUrl
  try {
    const policies = await listPolicies({
      productType: searchParams.get('productType') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    })
    return NextResponse.json({ success: true, policies })
  } catch (error) {
    console.error('[admin/policies] list failed', error)
    return NextResponse.json({ success: false, error: 'Could not load policies.' }, { status: 500 })
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

  const parsed = createPolicySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) },
      { status: 400 }
    )
  }

  try {
    const policy = await createPolicy({
      ...parsed.data,
      customerEmail: parsed.data.customerEmail || null,
      customerPhone: parsed.data.customerPhone || null,
      coverStart: parsed.data.coverStart || null,
      coverEnd: parsed.data.coverEnd || null,
      notes: parsed.data.notes || null,
    })
    return NextResponse.json({ success: true, policy }, { status: 201 })
  } catch (error) {
    console.error('[admin/policies] create failed', error)
    return NextResponse.json({ success: false, error: 'Could not create the policy.' }, { status: 500 })
  }
}
