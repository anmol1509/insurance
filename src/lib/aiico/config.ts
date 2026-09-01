/**
 * AIICO Insurance API — environment configuration. Server-only.
 *
 * The docs give every endpoint as `{BaseUrl}/api/services/app/...` without
 * pinning down the actual staging/UAT/production hosts — the one concrete
 * hint is a sample `printPolicyUrl` response pointing at
 * `https://portal-staging.aiicoplc.com`, which we use as the default only
 * for staging. UAT/production must be set explicitly once AIICO provides
 * them. Auth is a single pre-issued JWT bearer token (no login/refresh
 * endpoint is documented), so it's read straight from the environment.
 */

export type AiicoEnv = 'staging' | 'uat' | 'production'

const DEFAULT_BASE_URLS: Partial<Record<AiicoEnv, string>> = {
  staging: 'https://portal-staging.aiicoplc.com',
}

function aiicoEnvName(): AiicoEnv {
  const raw = process.env.AIICO_ENV?.trim().toLowerCase()
  return raw === 'uat' || raw === 'production' ? raw : 'staging'
}

export function aiicoBaseUrl(): string | undefined {
  const explicit = process.env.AIICO_BASE_URL?.trim()
  if (explicit) return explicit.replace(/\/+$/, '')
  return DEFAULT_BASE_URLS[aiicoEnvName()]
}

export function aiicoBearerToken(): string | undefined {
  return process.env.AIICO_BEARER_TOKEN?.trim() || undefined
}

function aiicoRealCredsPresent(): boolean {
  return Boolean(aiicoBaseUrl() && aiicoBearerToken())
}

/**
 * Explicit opt-in for demoing the flow before real AIICO credentials exist
 * — every AIICO call is simulated with fabricated data instead of hitting
 * the real API. Never overrides real credentials when both are set, and
 * must never be enabled on the production site customers actually use: a
 * demo "policy" is never submitted to AIICO and issues no real cover.
 */
export function aiicoDemoMode(): boolean {
  return process.env.AIICO_DEMO_MODE?.trim().toLowerCase() === 'true' && !aiicoRealCredsPresent()
}

export function isAiicoConfigured(): boolean {
  return aiicoRealCredsPresent() || aiicoDemoMode()
}

export const AIICO_TIMEOUT_MS = 30_000

/** Fixed product/subclass IDs from the docs — these don't change per environment. */
export const AIICO_PRODUCT_IDS = {
  motorThirdParty: 'fef672bd-faf1-e711-a2c0-005056a02281',
  motorComprehensive: 'f1326cce-47e7-e711-a2be-005056a02281',
  /** Single "Travel" product covering all five travel variants (Africa, Gold, Premium, Schengen, Schengen Plus). */
  travel: 'cb00e3f3-9feb-e711-a2be-005056a02281',
} as const

export const AIICO_SUBCLASS_COVER_IDS = {
  /** "Third Party Only" — the only cover type under Private Motor 3rd Party. */
  motorThirdParty: 'dd55d886-fcf1-e711-a2c0-005056a02281',
  /** "Auto Royale" — the cover type shown in the docs for Comprehensive; AIICO may list more via GetProductSubClassCoverTypes. */
  motorComprehensiveAutoRoyale: '02baaf3b-47e7-e711-a2be-005056a02281',
} as const
