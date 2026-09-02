import { NextResponse, type NextRequest } from 'next/server'
import { createAgent, listAgents } from '@/lib/db/agents'
import { isDatabaseConfigured } from '@/lib/db/client'
import { createAgentSchema, fieldErrors } from '@/lib/db/schemas'

function notConfiguredResponse() {
  return NextResponse.json(
    { success: false, error: 'No database is configured. Set POSTGRES_URL to enable the staff directory.' },
    { status: 503 }
  )
}

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()

  const { searchParams } = request.nextUrl
  const activeParam = searchParams.get('active')
  try {
    const agents = await listAgents({
      active: activeParam === null ? undefined : activeParam === 'true',
      search: searchParams.get('search') ?? undefined,
    })
    return NextResponse.json({ success: true, agents })
  } catch (error) {
    console.error('[admin/agents] list failed', error)
    return NextResponse.json({ success: false, error: 'Could not load staff.' }, { status: 500 })
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

  const parsed = createAgentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) },
      { status: 400 }
    )
  }

  try {
    const agent = await createAgent({ ...parsed.data, phone: parsed.data.phone || null })
    return NextResponse.json({ success: true, agent }, { status: 201 })
  } catch (error) {
    // Postgres unique_violation on the email column.
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === '23505') {
      return NextResponse.json({ success: false, error: 'A staff member with that email already exists.' }, { status: 409 })
    }
    console.error('[admin/agents] create failed', error)
    return NextResponse.json({ success: false, error: 'Could not add this staff member.' }, { status: 500 })
  }
}
