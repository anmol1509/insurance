import { NextResponse, type NextRequest } from 'next/server'
import { deleteAgent, getAgent, updateAgent } from '@/lib/db/agents'
import { isDatabaseConfigured } from '@/lib/db/client'
import { updateAgentSchema, fieldErrors } from '@/lib/db/schemas'

function notConfiguredResponse() {
  return NextResponse.json(
    { success: false, error: 'No database is configured. Set POSTGRES_URL to enable the staff directory.' },
    { status: 503 }
  )
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()
  const { id } = await context.params

  try {
    const agent = await getAgent(id)
    if (!agent) return NextResponse.json({ success: false, error: 'Staff member not found.' }, { status: 404 })
    return NextResponse.json({ success: true, agent })
  } catch (error) {
    console.error('[admin/agents] get failed', error)
    return NextResponse.json({ success: false, error: 'Could not load this staff member.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()
  const { id } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = updateAgentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) },
      { status: 400 }
    )
  }

  try {
    const agent = await updateAgent(id, parsed.data)
    if (!agent) return NextResponse.json({ success: false, error: 'Staff member not found.' }, { status: 404 })
    return NextResponse.json({ success: true, agent })
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as { code?: string }).code === '23505') {
      return NextResponse.json({ success: false, error: 'A staff member with that email already exists.' }, { status: 409 })
    }
    console.error('[admin/agents] update failed', error)
    return NextResponse.json({ success: false, error: 'Could not update this staff member.' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()
  const { id } = await context.params

  try {
    const removed = await deleteAgent(id)
    if (!removed) return NextResponse.json({ success: false, error: 'Staff member not found.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/agents] delete failed', error)
    return NextResponse.json({ success: false, error: 'Could not remove this staff member.' }, { status: 500 })
  }
}
