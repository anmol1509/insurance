/**
 * Data access for the `claims` table — the Claims Queue dashboard's own
 * record, independent of any insurer's own claims system. Server-only.
 */
import { sql } from './client'
import { ensureSchema } from './schema'

export type ClaimStatus = 'submitted' | 'under_review' | 'approved' | 'settled' | 'rejected'

export interface ClaimTimelineStep {
  date: string
  event: string
  done: boolean
}

export interface ClaimRecord {
  id: string
  code: string
  claimantName: string
  policyNumber: string
  claimType: string
  amount: number
  claimDate: string
  status: ClaimStatus
  assignedTo: string | null
  description: string | null
  timeline: ClaimTimelineStep[]
  documents: string[]
  createdAt: string
  updatedAt: string
}

export interface ClaimInput {
  claimantName: string
  policyNumber: string
  claimType: string
  amount: number
  claimDate?: string
  status?: ClaimStatus
  assignedTo?: string | null
  description?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRecord(row: any): ClaimRecord {
  return {
    id: row.id,
    code: row.code,
    claimantName: row.claimant_name,
    policyNumber: row.policy_number,
    claimType: row.claim_type,
    amount: Number(row.amount),
    claimDate: row.claim_date,
    status: row.status,
    assignedTo: row.assigned_to,
    description: row.description,
    timeline: row.timeline ?? [],
    documents: row.documents ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export interface ListFilters {
  status?: string
  search?: string
}

export async function listClaims(filters: ListFilters = {}): Promise<ClaimRecord[]> {
  await ensureSchema()

  const { status, search } = filters
  const searchTerm = search ? `%${search}%` : null

  const { rows } = await sql`
    SELECT * FROM claims
    WHERE (${status ?? null}::text IS NULL OR status = ${status ?? null})
      AND (
        ${searchTerm}::text IS NULL
        OR claimant_name ILIKE ${searchTerm}
        OR policy_number ILIKE ${searchTerm}
        OR code ILIKE ${searchTerm}
      )
    ORDER BY claim_date DESC
  `
  return rows.map(toRecord)
}

export async function getClaim(id: string): Promise<ClaimRecord | null> {
  await ensureSchema()
  const { rows } = await sql`SELECT * FROM claims WHERE id = ${id}`
  return rows[0] ? toRecord(rows[0]) : null
}

export async function createClaim(input: ClaimInput): Promise<ClaimRecord> {
  await ensureSchema()
  const timeline: ClaimTimelineStep[] = [{ date: input.claimDate ?? new Date().toISOString().slice(0, 10), event: 'Claim submitted', done: true }]

  const { rows } = await sql`
    INSERT INTO claims (claimant_name, policy_number, claim_type, amount, claim_date, status, assigned_to, description, timeline)
    VALUES (
      ${input.claimantName}, ${input.policyNumber}, ${input.claimType}, ${input.amount},
      ${input.claimDate ?? new Date().toISOString().slice(0, 10)}, ${input.status ?? 'submitted'},
      ${input.assignedTo ?? null}, ${input.description ?? null}, ${JSON.stringify(timeline)}::jsonb
    )
    RETURNING *
  `
  return toRecord(rows[0])
}

export async function updateClaim(id: string, input: Partial<ClaimInput>): Promise<ClaimRecord | null> {
  await ensureSchema()
  const existing = await getClaim(id)
  if (!existing) return null

  const merged: ClaimInput = {
    claimantName: input.claimantName ?? existing.claimantName,
    policyNumber: input.policyNumber ?? existing.policyNumber,
    claimType: input.claimType ?? existing.claimType,
    amount: input.amount ?? existing.amount,
    claimDate: input.claimDate ?? existing.claimDate,
    status: input.status ?? existing.status,
    assignedTo: input.assignedTo !== undefined ? input.assignedTo : existing.assignedTo,
    description: input.description !== undefined ? input.description : existing.description,
  }

  const { rows } = await sql`
    UPDATE claims SET
      claimant_name = ${merged.claimantName},
      policy_number = ${merged.policyNumber},
      claim_type = ${merged.claimType},
      amount = ${merged.amount},
      claim_date = ${merged.claimDate},
      status = ${merged.status},
      assigned_to = ${merged.assignedTo ?? null},
      description = ${merged.description ?? null},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0] ? toRecord(rows[0]) : null
}

export async function deleteClaim(id: string): Promise<boolean> {
  await ensureSchema()
  const { rowCount } = await sql`DELETE FROM claims WHERE id = ${id}`
  return (rowCount ?? 0) > 0
}
