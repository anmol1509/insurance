import { NextResponse, type NextRequest } from 'next/server'
import { deletePolicy, getPolicy, updatePolicy } from '@/lib/db/policies'
import { isDatabaseConfigured } from '@/lib/db/client'
import { updatePolicySchema, fieldErrors } from '@/lib/db/schemas'

function notConfiguredResponse() {
  return NextResponse.json(
    { success: false, error: 'No database is configured. Set POSTGRES_URL to enable the policies dashboard.' },
    { status: 503 }
  )
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()
  const { id } = await context.params

  try {
    const policy = await getPolicy(id)
    if (!policy) return NextResponse.json({ success: false, error: 'Policy not found.' }, { status: 404 })
    return NextResponse.json({ success: true, policy })
  } catch (error) {
    console.error('[admin/policies] get failed', error)
    return NextResponse.json({ success: false, error: 'Could not load the policy.' }, { status: 500 })
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

  const parsed = updatePolicySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) },
      { status: 400 }
    )
  }

  try {
    const policy = await updatePolicy(id, parsed.data)
    if (!policy) return NextResponse.json({ success: false, error: 'Policy not found.' }, { status: 404 })
    return NextResponse.json({ success: true, policy })
  } catch (error) {
    console.error('[admin/policies] update failed', error)
    return NextResponse.json({ success: false, error: 'Could not update the policy.' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()
  const { id } = await context.params

  try {
    const removed = await deletePolicy(id)
    if (!removed) return NextResponse.json({ success: false, error: 'Policy not found.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/policies] delete failed', error)
    return NextResponse.json({ success: false, error: 'Could not delete the policy.' }, { status: 500 })
  }
}
