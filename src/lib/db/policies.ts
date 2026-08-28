/**
 * Data access for the `policies` table — our own record of policies,
 * independent of any insurer's system of record. Server-only.
 */
import { sql } from './client'
import { ensureSchema } from './schema'

export type PolicyProductType = 'motor' | 'medical' | 'travel' | 'business' | 'marine' | 'personal-accident'
export type PolicyStatus = 'active' | 'expiring' | 'expired' | 'cancelled'
export type PolicySource = 'manual' | 'checkout' | 'lookup'

export interface PolicyRecord {
  id: string
  policyNumber: string
  customerName: string
  customerEmail: string | null
  customerPhone: string | null
  productType: PolicyProductType
  insurer: string
  premium: number
  status: PolicyStatus
  source: PolicySource
  coverStart: string | null
  coverEnd: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface PolicyInput {
  policyNumber: string
  customerName: string
  customerEmail?: string | null
  customerPhone?: string | null
  productType: PolicyProductType
  insurer: string
  premium: number
  status: PolicyStatus
  source?: PolicySource
  coverStart?: string | null
  coverEnd?: string | null
  notes?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRecord(row: any): PolicyRecord {
  return {
    id: row.id,
    policyNumber: row.policy_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    productType: row.product_type,
    insurer: row.insurer,
    premium: Number(row.premium),
    status: row.status,
    source: row.source,
    coverStart: row.cover_start,
    coverEnd: row.cover_end,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export interface ListFilters {
  productType?: string
  status?: string
  search?: string
}

export async function listPolicies(filters: ListFilters = {}): Promise<PolicyRecord[]> {
  await ensureSchema()

  const { productType, status, search } = filters
  const searchTerm = search ? `%${search}%` : null

  const { rows } = await sql`
    SELECT * FROM policies
    WHERE (${productType ?? null}::text IS NULL OR product_type = ${productType ?? null})
      AND (${status ?? null}::text IS NULL OR status = ${status ?? null})
      AND (
        ${searchTerm}::text IS NULL
        OR customer_name ILIKE ${searchTerm}
        OR policy_number ILIKE ${searchTerm}
        OR insurer ILIKE ${searchTerm}
      )
    ORDER BY created_at DESC
  `
  return rows.map(toRecord)
}

export async function getPolicy(id: string): Promise<PolicyRecord | null> {
  await ensureSchema()
  const { rows } = await sql`SELECT * FROM policies WHERE id = ${id}`
  return rows[0] ? toRecord(rows[0]) : null
}

export async function createPolicy(input: PolicyInput): Promise<PolicyRecord> {
  await ensureSchema()
  const { rows } = await sql`
    INSERT INTO policies (
      policy_number, customer_name, customer_email, customer_phone,
      product_type, insurer, premium, status, source, cover_start, cover_end, notes
    ) VALUES (
      ${input.policyNumber}, ${input.customerName}, ${input.customerEmail ?? null}, ${input.customerPhone ?? null},
      ${input.productType}, ${input.insurer}, ${input.premium}, ${input.status}, ${input.source ?? 'manual'},
      ${input.coverStart ?? null}, ${input.coverEnd ?? null}, ${input.notes ?? null}
    )
    RETURNING *
  `
  return toRecord(rows[0])
}

export async function updatePolicy(id: string, input: Partial<PolicyInput>): Promise<PolicyRecord | null> {
  await ensureSchema()
  const existing = await getPolicy(id)
  if (!existing) return null

  const merged: PolicyInput = {
    policyNumber: input.policyNumber ?? existing.policyNumber,
    customerName: input.customerName ?? existing.customerName,
    customerEmail: input.customerEmail !== undefined ? input.customerEmail : existing.customerEmail,
    customerPhone: input.customerPhone !== undefined ? input.customerPhone : existing.customerPhone,
    productType: input.productType ?? existing.productType,
    insurer: input.insurer ?? existing.insurer,
    premium: input.premium ?? existing.premium,
    status: input.status ?? existing.status,
    source: existing.source,
    coverStart: input.coverStart !== undefined ? input.coverStart : existing.coverStart,
    coverEnd: input.coverEnd !== undefined ? input.coverEnd : existing.coverEnd,
    notes: input.notes !== undefined ? input.notes : existing.notes,
  }

  const { rows } = await sql`
    UPDATE policies SET
      policy_number = ${merged.policyNumber},
      customer_name = ${merged.customerName},
      customer_email = ${merged.customerEmail ?? null},
      customer_phone = ${merged.customerPhone ?? null},
      product_type = ${merged.productType},
      insurer = ${merged.insurer},
      premium = ${merged.premium},
      status = ${merged.status},
      cover_start = ${merged.coverStart ?? null},
      cover_end = ${merged.coverEnd ?? null},
      notes = ${merged.notes ?? null},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0] ? toRecord(rows[0]) : null
}

export async function deletePolicy(id: string): Promise<boolean> {
  await ensureSchema()
  const { rowCount } = await sql`DELETE FROM policies WHERE id = ${id}`
  return (rowCount ?? 0) > 0
}
