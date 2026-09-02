import { NextResponse, type NextRequest } from 'next/server'
import { deleteLead, getLead, updateLead } from '@/lib/db/leads'
import { isDatabaseConfigured } from '@/lib/db/client'
import { updateLeadSchema, fieldErrors } from '@/lib/db/schemas'

function notConfiguredResponse() {
  return NextResponse.json(
    { success: false, error: 'No database is configured. Set POSTGRES_URL to enable the leads dashboard.' },
    { status: 503 }
  )
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()
  const { id } = await context.params

  try {
    const lead = await getLead(id)
    if (!lead) return NextResponse.json({ success: false, error: 'Lead not found.' }, { status: 404 })
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('[admin/leads] get failed', error)
    return NextResponse.json({ success: false, error: 'Could not load this lead.' }, { status: 500 })
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

  const parsed = updateLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) },
      { status: 400 }
    )
  }

  try {
    const lead = await updateLead(id, parsed.data)
    if (!lead) return NextResponse.json({ success: false, error: 'Lead not found.' }, { status: 404 })
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('[admin/leads] update failed', error)
    return NextResponse.json({ success: false, error: 'Could not update this lead.' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()
  const { id } = await context.params

  try {
    const removed = await deleteLead(id)
    if (!removed) return NextResponse.json({ success: false, error: 'Lead not found.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/leads] delete failed', error)
    return NextResponse.json({ success: false, error: 'Could not remove this lead.' }, { status: 500 })
  }
}
