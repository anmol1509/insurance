/**
 * VerifyData (Virtuality) Vehicle Verification API — environment configuration.
 *
 * A single-endpoint service: given a registration number and a secret key,
 * it returns the vehicle's registry details. Server-only.
 */

export const VERIFYDATA_BASE_URL = 'https://vd.virtuality.com'
export const VERIFYDATA_TIMEOUT_MS = 15_000

export function verifyDataSecretKey(): string | undefined {
  return process.env.VERIFYDATA_SECRET_KEY?.trim() || undefined
}

export function verifyDataConfigured(): boolean {
  return Boolean(verifyDataSecretKey())
}
