import { NextResponse, type NextRequest } from 'next/server'
import { createLead, listLeads } from '@/lib/db/leads'
import { isDatabaseConfigured } from '@/lib/db/client'
import { createLeadSchema, fieldErrors } from '@/lib/db/schemas'

function notConfiguredResponse() {
  return NextResponse.json(
    { success: false, error: 'No database is configured. Set POSTGRES_URL to enable the leads dashboard.' },
    { status: 503 }
  )
}

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()

  const { searchParams } = request.nextUrl
  try {
    const leads = await listLeads({
      status: searchParams.get('status') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    })
    return NextResponse.json({ success: true, leads })
  } catch (error) {
    console.error('[admin/leads] list failed', error)
    return NextResponse.json({ success: false, error: 'Could not load leads.' }, { status: 500 })
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

  const parsed = createLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) },
      { status: 400 }
    )
  }

  try {
    const lead = await createLead({ ...parsed.data, summary: parsed.data.summary || null })
    return NextResponse.json({ success: true, lead }, { status: 201 })
  } catch (error) {
    console.error('[admin/leads] create failed', error)
    return NextResponse.json({ success: false, error: 'Could not create this lead.' }, { status: 500 })
  }
}
