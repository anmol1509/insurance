/**
 * Tangerine Motor Insurance API — environment configuration.
 *
 * Tangerine runs two entirely separate product lines at different base URLs,
 * each with its own auth header (base64 of `userid:APIKEY`). Server-only.
 */

export type TangerineLine = 'comprehensive' | 'thirdparty'

const BASE_URLS: Record<TangerineLine, string> = {
  comprehensive: 'https://motor.tangerine.africa/API/ComprehensiveAPI',
  thirdparty: 'https://motor.tangerine.africa/API/API',
}

export function tangerineBaseUrl(line: TangerineLine): string {
  return BASE_URLS[line]
}

export function tangerineUserId(): string | undefined {
  return process.env.TANGERINE_USER_ID?.trim() || undefined
}

function tangerineApiKey(): string | undefined {
  return process.env.TANGERINE_API_KEY?.trim() || undefined
}

/** `Authorization: <base64 of userid:APIKEY>`, per the manual's auth scheme. */
export function tangerineAuthHeader(): string | undefined {
  const userId = tangerineUserId()
  const apiKey = tangerineApiKey()
  if (!userId || !apiKey) return undefined
  return Buffer.from(`${userId}:${apiKey}`).toString('base64')
}

export const TANGERINE_TIMEOUT_MS = 30_000

/**
 * Cloudinary unsigned upload, used to turn a browser-uploaded vehicle photo
 * into the public URL Tangerine's `ImageUrlList` requires — Tangerine takes
 * hosted URLs, not file bytes.
 */
export function cloudinaryCloudName(): string | undefined {
  return process.env.CLOUDINARY_CLOUD_NAME?.trim() || undefined
}

export function cloudinaryUploadPreset(): string | undefined {
  return process.env.CLOUDINARY_UPLOAD_PRESET?.trim() || undefined
}

function tangerineRealCredsPresent(): boolean {
  return Boolean(tangerineAuthHeader() && cloudinaryCloudName() && cloudinaryUploadPreset())
}

/**
 * Explicit opt-in for demoing the flow before real Tangerine/Cloudinary
 * credentials exist — every Tangerine call and vehicle-photo upload is
 * simulated instead of hitting the real APIs. Never overrides real
 * credentials when both are set, and must never be enabled on the
 * production site customers actually use: a demo "policy" is never
 * submitted to Tangerine and issues no real cover.
 */
export function tangerineDemoMode(): boolean {
  return process.env.TANGERINE_DEMO_MODE?.trim().toLowerCase() === 'true' && !tangerineRealCredsPresent()
}

/** True when both the API credentials and the image-hosting step submission depends on are set, or demo mode is on. */
export function tangerineConfigured(): boolean {
  return tangerineRealCredsPresent() || tangerineDemoMode()
}
