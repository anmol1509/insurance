/**
 * Database client, via `@vercel/postgres`. This talks Neon's HTTP-based
 * serverless protocol, not raw Postgres wire protocol — so `POSTGRES_URL`
 * must point at a Neon database (directly, or through Vercel Postgres,
 * which is Neon under the hood). It will not work against a plain
 * self-hosted Postgres instance; there's no local-Postgres fallback here.
 *
 * Server-only.
 */
import { sql } from '@vercel/postgres'

export { sql }

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.POSTGRES_URL?.trim())
}

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super('No database is configured. Set POSTGRES_URL to a Postgres connection string.')
    this.name = 'DatabaseNotConfiguredError'
  }
}

export function requireDatabase(): void {
  if (!isDatabaseConfigured()) throw new DatabaseNotConfiguredError()
}
