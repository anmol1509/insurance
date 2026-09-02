import { NextResponse, type NextRequest } from 'next/server'
import { addLeadNote } from '@/lib/db/leads'
import { isDatabaseConfigured } from '@/lib/db/client'
import { addLeadNoteSchema, fieldErrors } from '@/lib/db/schemas'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: 'No database is configured. Set POSTGRES_URL to enable the leads dashboard.' },
      { status: 503 }
    )
  }
  const { id } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = addLeadNoteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) },
      { status: 400 }
    )
  }

  try {
    const lead = await addLeadNote(id, { at: new Date().toISOString().slice(0, 10), text: parsed.data.text })
    if (!lead) return NextResponse.json({ success: false, error: 'Lead not found.' }, { status: 404 })
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('[admin/leads] add note failed', error)
    return NextResponse.json({ success: false, error: 'Could not add this note.' }, { status: 500 })
  }
}
