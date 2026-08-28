/**
 * Payloft Sandbox API — environment configuration.
 *
 * The secret key is server-only and never reaches the browser: it is read
 * here from PAYLOFT_SECRET_KEY and injected into every request our own
 * /api/payloft/* routes make.
 */

/** The guide documents only this sandbox host; there is no production URL here. */
export const PAYLOFT_BASE_URL = 'https://pay.mypayloft.com'
export const PAYLOFT_API_PREFIX = '/api/sandbox/checkout'

export function payloftSecretKey(): string | undefined {
  const key = process.env.PAYLOFT_SECRET_KEY?.trim()
  return key || undefined
}

export function payloftConfigured(): boolean {
  const key = payloftSecretKey()
  return Boolean(key && key.startsWith('sk_test_'))
}

/** The hosted checkout page — distinct from the API base URL (guide, "Frontend Checkout URL"). */
export function payloftCheckoutPageUrl(orderId: number | string): string {
  return `${PAYLOFT_BASE_URL}/sandbox-pay/${orderId}`
}

export const PAYLOFT_TIMEOUT_MS = 20_000
