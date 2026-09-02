/**
 * Data access for the `agents` table — the platform's own staff directory,
 * used to power the "Assign to" list on Leads and Claims (previously a
 * hardcoded array of sample names with no persistence). Server-only.
 */
import { sql } from './client'
import { ensureSchema } from './schema'

export type AgentRole = 'sales' | 'support' | 'claims' | 'admin'

export interface AgentRecord {
  id: string
  name: string
  email: string
  phone: string | null
  role: AgentRole
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface AgentInput {
  name: string
  email: string
  phone?: string | null
  role: AgentRole
  active?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toRecord(row: any): AgentRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export interface ListFilters {
  active?: boolean
  search?: string
}

export async function listAgents(filters: ListFilters = {}): Promise<AgentRecord[]> {
  await ensureSchema()

  const { active, search } = filters
  const searchTerm = search ? `%${search}%` : null

  const { rows } = await sql`
    SELECT * FROM agents
    WHERE (${active ?? null}::boolean IS NULL OR active = ${active ?? null})
      AND (
        ${searchTerm}::text IS NULL
        OR name ILIKE ${searchTerm}
        OR email ILIKE ${searchTerm}
      )
    ORDER BY name ASC
  `
  return rows.map(toRecord)
}

export async function getAgent(id: string): Promise<AgentRecord | null> {
  await ensureSchema()
  const { rows } = await sql`SELECT * FROM agents WHERE id = ${id}`
  return rows[0] ? toRecord(rows[0]) : null
}

export async function createAgent(input: AgentInput): Promise<AgentRecord> {
  await ensureSchema()
  const { rows } = await sql`
    INSERT INTO agents (name, email, phone, role, active)
    VALUES (${input.name}, ${input.email}, ${input.phone ?? null}, ${input.role}, ${input.active ?? true})
    RETURNING *
  `
  return toRecord(rows[0])
}

export async function updateAgent(id: string, input: Partial<AgentInput>): Promise<AgentRecord | null> {
  await ensureSchema()
  const existing = await getAgent(id)
  if (!existing) return null

  const merged: AgentInput = {
    name: input.name ?? existing.name,
    email: input.email ?? existing.email,
    phone: input.phone !== undefined ? input.phone : existing.phone,
    role: input.role ?? existing.role,
    active: input.active !== undefined ? input.active : existing.active,
  }

  const { rows } = await sql`
    UPDATE agents SET
      name = ${merged.name},
      email = ${merged.email},
      phone = ${merged.phone ?? null},
      role = ${merged.role},
      active = ${merged.active ?? true},
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0] ? toRecord(rows[0]) : null
}

export async function deleteAgent(id: string): Promise<boolean> {
  await ensureSchema()
  const { rowCount } = await sql`DELETE FROM agents WHERE id = ${id}`
  return (rowCount ?? 0) > 0
}
