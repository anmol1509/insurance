/**
 * NSIA Insurance API — environment configuration.
 *
 * Server-only. The access token must never reach the browser, so every call
 * goes through our own /api/nsia/* route handlers rather than direct fetches.
 */

const TEST_BASE = 'https://test-api.nsiainsurance.com/v1/api'
const LIVE_BASE = 'https://live-api.nsiainsurance.com/v1/api'

export type NsiaEnvironment = 'test' | 'live'

/** Resolves to 'live' only when NSIA_ENV is explicitly set to live/production. */
export function nsiaEnvironment(): NsiaEnvironment {
  const raw = (process.env.NSIA_ENV ?? '').trim().toLowerCase()
  return raw === 'live' || raw === 'production' ? 'live' : 'test'
}

export function nsiaBaseUrl(): string {
  const override = process.env.NSIA_BASE_URL?.trim()
  if (override) return override.replace(/\/+$/, '')
  return nsiaEnvironment() === 'live' ? LIVE_BASE : TEST_BASE
}

export function nsiaToken(): string | undefined {
  return process.env.NSIA_ACCESS_TOKEN?.trim() || undefined
}

/** Timeouts recommended by the integration guide (section 14), in milliseconds. */
export const NSIA_TIMEOUTS = {
  get: 30_000,
  post: 60_000,
  upload: 180_000,
} as const

/**
 * Premiums at or above this figure are settled offline with NSIA rather than
 * through the online payment gateway (guide section 12.1, step 4).
 */
export const NSIA_ONLINE_PAYMENT_CEILING = 5_000_000
