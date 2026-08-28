/**
 * Idempotent schema setup, run lazily on first use per server instance so a
 * fresh database self-heals without a separate migration step. The
 * canonical, human-readable copy of this SQL lives in `db/schema.sql`.
 */
import { sql } from './client'

let ensured = false

export async function ensureSchema(): Promise<void> {
  if (ensured) return

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`
  await sql`
    CREATE TABLE IF NOT EXISTS policies (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      policy_number TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT,
      product_type TEXT NOT NULL,
      insurer TEXT NOT NULL,
      premium NUMERIC(14, 2) NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      source TEXT NOT NULL DEFAULT 'manual',
      cover_start DATE,
      cover_end DATE,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS policies_product_type_idx ON policies (product_type)`
  await sql`CREATE INDEX IF NOT EXISTS policies_status_idx ON policies (status)`
  await sql`CREATE INDEX IF NOT EXISTS policies_policy_number_idx ON policies (policy_number)`

  ensured = true
}
