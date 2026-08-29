/**
 * Server-only: this module reads AIICO_BASE_URL / AIICO_BEARER_TOKEN.
 * Import it from route handlers only, never from a client component.
 */
import { proxyFetch } from '@/lib/proxyFetch'
import { AIICO_TIMEOUT_MS, aiicoBaseUrl, aiicoBearerToken } from './config'
import type { AiicoEnvelope } from './types'

export class AiicoError extends Error {
  readonly status: number
  readonly detail: unknown

  constructor(message: string, status = 502, detail?: unknown) {
    super(message)
    this.name = 'AiicoError'
    this.status = status
    this.detail = detail
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST'
  query?: Record<string, string | number | undefined>
  body?: Record<string, unknown>
}

function buildUrl(baseUrl: string, path: string, query?: RequestOptions['query']): string {
  const url = new URL(`${baseUrl}${path}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url.toString()
}

/** Every AIICO endpoint returns the same ABP-framework `{ result, success, error }` envelope. */
export async function aiicoRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const baseUrl = aiicoBaseUrl()
  const token = aiicoBearerToken()
  if (!baseUrl || !token) {
    throw new AiicoError('AIICO integration is not configured. Set AIICO_BASE_URL and AIICO_BEARER_TOKEN.', 503)
  }

  const url = buildUrl(baseUrl, path, options.query)

  let res: Response
  try {
    res = await proxyFetch(url, {
      method: options.method ?? 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(AIICO_TIMEOUT_MS),
    })
  } catch (error) {
    throw new AiicoError('Could not reach the AIICO API.', 502, error)
  }

  if (res.status === 403) {
    throw new AiicoError('AIICO rejected the request as unauthenticated.', 403)
  }

  let envelope: AiicoEnvelope<T>
  try {
    envelope = (await res.json()) as AiicoEnvelope<T>
  } catch {
    throw new AiicoError('AIICO returned an unexpected response.', 502)
  }

  if (!res.ok || !envelope.success) {
    const message = envelope.error?.message ?? `AIICO request failed (HTTP ${res.status})`
    const status = res.status >= 400 && res.status <= 599 ? res.status : 502
    throw new AiicoError(message, status, envelope.error)
  }

  return envelope.result as T
}
