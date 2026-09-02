import { NextResponse, type NextRequest } from 'next/server'
import { deleteClaim, getClaim, updateClaim } from '@/lib/db/claims'
import { isDatabaseConfigured } from '@/lib/db/client'
import { updateClaimSchema, fieldErrors } from '@/lib/db/schemas'

function notConfiguredResponse() {
  return NextResponse.json(
    { success: false, error: 'No database is configured. Set POSTGRES_URL to enable the claims dashboard.' },
    { status: 503 }
  )
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()
  const { id } = await context.params

  try {
    const claim = await getClaim(id)
    if (!claim) return NextResponse.json({ success: false, error: 'Claim not found.' }, { status: 404 })
    return NextResponse.json({ success: true, claim })
  } catch (error) {
    console.error('[admin/claims] get failed', error)
    return NextResponse.json({ success: false, error: 'Could not load this claim.' }, { status: 500 })
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

  const parsed = updateClaimSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Some details are missing or invalid.', fields: fieldErrors(parsed.error) },
      { status: 400 }
    )
  }

  try {
    const claim = await updateClaim(id, { ...parsed.data, claimDate: parsed.data.claimDate || undefined })
    if (!claim) return NextResponse.json({ success: false, error: 'Claim not found.' }, { status: 404 })
    return NextResponse.json({ success: true, claim })
  } catch (error) {
    console.error('[admin/claims] update failed', error)
    return NextResponse.json({ success: false, error: 'Could not update this claim.' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) return notConfiguredResponse()
  const { id } = await context.params

  try {
    const removed = await deleteClaim(id)
    if (!removed) return NextResponse.json({ success: false, error: 'Claim not found.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/claims] delete failed', error)
    return NextResponse.json({ success: false, error: 'Could not remove this claim.' }, { status: 500 })
  }
}
