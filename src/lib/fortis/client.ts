/**
 * Server-only: this module reads FORTIS_CLIENT_ID / FORTIS_CLIENT_SECRET.
 * Import it from route handlers only, never from a client component.
 */
import { proxyFetch } from '@/lib/proxyFetch'
import { FORTIS_BASE_URL, FORTIS_TIMEOUT_MS, fortisClientId, fortisClientSecret, fortisConfigured } from './config'
import type { FortisLoginResponse } from './types'

export class FortisError extends Error {
  readonly status: number
  readonly detail: unknown

  constructor(message: string, status = 502, detail?: unknown) {
    super(message)
    this.name = 'FortisError'
    this.status = status
    this.detail = detail
  }
}

/** Section 2 — exchange the client ID/secret for a Sanctum bearer token. */
export async function fortisLogin(): Promise<string> {
  if (!fortisConfigured()) {
    throw new FortisError('Fortis integration is not configured. Set FORTIS_CLIENT_ID and FORTIS_CLIENT_SECRET.', 503)
  }

  let res: Response
  try {
    res = await proxyFetch(`${FORTIS_BASE_URL}/external-api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: fortisClientId(), client_secret: fortisClientSecret() }),
      signal: AbortSignal.timeout(FORTIS_TIMEOUT_MS.auth),
    })
  } catch (error) {
    throw new FortisError('Could not reach Fortis.', 502, error)
  }

  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new FortisError(body?.message ?? `Fortis login failed (HTTP ${res.status})`, res.status, body)
  }

  const data = body as FortisLoginResponse
  const token = data.token ?? data.access_token ?? data.data?.token
  if (!token) throw new FortisError('Fortis did not return a bearer token.', 502, body)
  return token
}

/** Authenticated GET/POST against the Fortis external API, with the bearer token attached. */
export async function fortisRequest<T>(
  path: string,
  token: string,
  options: { method?: 'GET' | 'POST'; body?: unknown; timeoutMs?: number } = {}
): Promise<T> {
  const { method = 'GET', body, timeoutMs = FORTIS_TIMEOUT_MS.read } = options

  let res: Response
  try {
    res = await proxyFetch(`${FORTIS_BASE_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeoutMs),
    })
  } catch (error) {
    throw new FortisError('Could not reach Fortis.', 502, error)
  }

  const responseBody = await res.json().catch(() => null)
  if (!res.ok) {
    throw new FortisError(responseBody?.message ?? `Fortis request failed (HTTP ${res.status})`, res.status, responseBody)
  }

  return responseBody as T
}
