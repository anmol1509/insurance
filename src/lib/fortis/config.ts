/**
 * Fortis Global External Motor API — environment configuration.
 *
 * Per the partner documentation, this is an isolated sandbox: submissions
 * land in a temporary table for manual review, not the live policy
 * workflow, until Fortis's internal team processes them. The docs publish a
 * literal test client ID/secret for this reason — see
 * docs/fortis-integration.md — but production credentials still belong in
 * the environment, never in code.
 */

export const FORTIS_BASE_URL = 'https://jjmgloballtd.com/coreinsurance/api'
export const FORTIS_TIMEOUT_MS = {
  auth: 8_000,
  read: 8_000,
  submit: 10_000,
} as const

export function fortisClientId(): string | undefined {
  return process.env.FORTIS_CLIENT_ID?.trim() || undefined
}

export function fortisClientSecret(): string | undefined {
  return process.env.FORTIS_CLIENT_SECRET?.trim() || undefined
}

export function fortisConfigured(): boolean {
  return Boolean(fortisClientId() && fortisClientSecret())
}
