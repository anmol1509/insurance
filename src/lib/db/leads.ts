/**
 * Data access for the `leads` table — the Leads & Quotes dashboard's own
 * record, independent of any quote-flow session. Server-only.
 */
import { sql } from './client'
import { ensureSchema } from './schema'

export type LeadProductType = 'motor' | 'medical' | 'travel' | 'business'
export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'converted' | 'lost'

export interface LeadNote {
  at: string
  text: string
}

export interface LeadRecord {
  id: string
  code: string
  name: string
  phone: string
  email: string
  productType: LeadProductType
  summary: string | null
  estimatedPremium: number
  source: string
  status: LeadStatus
  assignedTo: string | null
  notes: LeadNote[]
  createdAt: string
  updatedAt: string
}

export interface LeadInput {
  name: string
  phone: string
  email: string
  productType: LeadProductType
  summary?: string | null
  estimatedPremium: number
  source: string
  status?: LeadStatus
  assignedTo?: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRecord(row: any): LeadRecord {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    phone: row.phone,
    email: row.email,
    productType: row.product_type,
    summary: row.summary,
    estimatedPremium: Number(row.estimated_premium),
    source: row.source,
    status: row.status,
    assignedTo: row.assigned_to,
    notes: row.notes ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export interface ListFilters {
  status?: string
  search?: string
}

export async function listLeads(filters: ListFilters = {}): Promise<LeadRecord[]> {
  await ensureSchema()

  const { status, search } = filters
  const searchTerm = search ? `%${search}%` : null

  const { rows } = await sql`
    SELECT * FROM leads
    WHERE (${status ?? null}::text IS NULL OR status = ${status ?? null})
      AND (
        ${searchTerm}::text IS NULL
        OR name ILIKE ${searchTerm}
        OR code ILIKE ${searchTerm}
        OR phone ILIKE ${searchTerm}
      )
    ORDER BY created_at DESC
  `
  return rows.map(toRecord)
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  await ensureSchema()
  const { rows } = await sql`SELECT * FROM leads WHERE id = ${id}`
  return rows[0] ? toRecord(rows[0]) : null
}

export async function createLead(input: LeadInput): Promise<LeadRecord> {
  await ensureSchema()
  const { rows } = await sql`
    INSERT INTO leads (name, phone, email, product_type, summary, estimated_premium, source, status, assigned_to)
    VALUES (
      ${input.name}, ${input.phone}, ${input.email}, ${input.productType}, ${input.summary ?? null},
      ${input.estimatedPremium}, ${input.source}, ${input.status ?? 'new'}, ${input.assignedTo ?? null}
    )
    RETURNING *
  `
  return toRecord(rows[0])
}

export async function updateLead(id: string, input: Partial<LeadInput>): Promise<LeadRecord | null> {
  await ensureSchema()
  const existing = await getLead(id)
  if (!existing) return null

  const merged: LeadInput = {
    name: input.name ?? existing.name,
    phone: input.phone ?? existing.phone,
    email: input.email ?? existing.email,
    productType: input.productType ?? existing.productType,
    summary: input.summary !== undefined ? input.summary : existing.summary,
    estimatedPremium: input.estimatedPremium ?? existing.estimatedPremium,
    source: input.source ?? existing.source,
    status: input.status ?? existing.status,
    assignedTo: input.assignedTo !== undefined ? input.assignedTo : existing.assignedTo,
  }

  const { rows } = await sql`
    UPDATE leads SET
      name = ${merged.name},
      phone = ${merged.phone},
      email = ${merged.email},
      product_type = ${merged.productType},
      summary = ${merged.summary ?? null},
      estimated_premium = ${merged.estimatedPremium},
      source = ${merged.source},
      status = ${merged.status},
      assigned_to = ${merged.assignedTo ?? null},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0] ? toRecord(rows[0]) : null
}

export async function addLeadNote(id: string, note: LeadNote): Promise<LeadRecord | null> {
  await ensureSchema()
  const { rows } = await sql`
    UPDATE leads SET
      notes = notes || ${JSON.stringify([note])}::jsonb,
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0] ? toRecord(rows[0]) : null
}

export async function deleteLead(id: string): Promise<boolean> {
  await ensureSchema()
  const { rowCount } = await sql`DELETE FROM leads WHERE id = ${id}`
  return (rowCount ?? 0) > 0
}
