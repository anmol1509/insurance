/**
 * NSIA bearer-token management. Server-only: reads NSIA_LOGIN_EMAIL /
 * NSIA_LOGIN_PASSWORD / NSIA_ACCESS_TOKEN.
 *
 * NSIA's API issues access tokens that last 24 hours (login and refresh both
 * answer `expiresIn: 86400`), so a single token pasted into an environment
 * variable stops working the next day. When a login is configured this signs
 * in on demand, caches the token in memory, renews it shortly before it
 * expires, and falls back to a fresh login if a refresh is refused.
 *
 * A fixed `NSIA_ACCESS_TOKEN` still wins when set — useful for a token NSIA
 * issued out-of-band that doesn't expire.
 */
import { proxyFetch } from '@/lib/proxyFetch'
import { nsiaBaseUrl, nsiaLogin, nsiaStaticToken } from './config'

/** Renew this long before the stated expiry so a request never carries a dying token. */
const EXPIRY_MARGIN_MS = 5 * 60 * 1000
const AUTH_TIMEOUT_MS = 30_000

interface CachedToken {
  accessToken: string
  refreshToken: string | undefined
  expiresAt: number
}

let cached: CachedToken | undefined
/** Shared by concurrent callers so a burst of requests triggers one login, not many. */
let inFlight: Promise<CachedToken> | undefined

/** Both calls answer with the same fields, but login nests them under `token` and refresh does not. */
function parseTokenResponse(body: unknown): CachedToken {
  const record = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  const source = (record.token && typeof record.token === 'object' ? record.token : record) as Record<string, unknown>
  const accessToken = typeof source.accessToken === 'string' ? source.accessToken : undefined
  if (!accessToken) throw new Error('NSIA did not return an access token.')
  const expiresInSeconds = typeof source.expiresIn === 'number' ? source.expiresIn : 3600
  return {
    accessToken,
    refreshToken: typeof source.refreshToken === 'string' ? source.refreshToken : undefined,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  }
}

async function postJson(path: string, payload: unknown): Promise<unknown> {
  const res = await proxyFetch(`${nsiaBaseUrl()}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(AUTH_TIMEOUT_MS),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`NSIA ${path} answered HTTP ${res.status}`)
  return text ? JSON.parse(text) : null
}

async function renew(): Promise<CachedToken> {
  const login = nsiaLogin()
  if (!login) throw new Error('No NSIA login is configured.')

  // NSIA rotates the refresh token on every refresh, so the new one is kept.
  if (cached?.refreshToken) {
    try {
      const next = parseTokenResponse(await postJson('/Account/refresh-token', { refreshToken: cached.refreshToken }))
      return { ...next, refreshToken: next.refreshToken ?? cached.refreshToken }
    } catch {
      // Refresh refused or failed — fall through to a clean login.
    }
  }
  return parseTokenResponse(await postJson('/Account/login', { email: login.email, password: login.password }))
}

/**
 * The bearer token to send to NSIA, or undefined when none is configured.
 * Throws only when a login *is* configured but NSIA won't issue a token.
 */
export async function getNsiaToken(): Promise<string | undefined> {
  const fixed = nsiaStaticToken()
  if (fixed) return fixed
  if (!nsiaLogin()) return undefined

  if (cached && cached.expiresAt - Date.now() > EXPIRY_MARGIN_MS) return cached.accessToken

  inFlight ??= renew()
    .then((next) => {
      cached = next
      return next
    })
    .finally(() => {
      inFlight = undefined
    })
  return (await inFlight).accessToken
}

/** Forget the cached token — called when NSIA answers 401 so the next call signs in afresh. */
export function invalidateNsiaToken(): void {
  cached = undefined
}

/** True when tokens come from a login (and so can be renewed), rather than a fixed value. */
export function nsiaTokenIsRenewable(): boolean {
  return !nsiaStaticToken() && nsiaLogin() !== undefined
}
