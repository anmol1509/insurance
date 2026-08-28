/**
 * Server-only: this module reads PAYLOFT_SECRET_KEY. Import it from route
 * handlers only, never from a client component.
 */
import { proxyFetch } from '@/lib/proxyFetch'
import { PAYLOFT_API_PREFIX, PAYLOFT_BASE_URL, PAYLOFT_TIMEOUT_MS, payloftConfigured, payloftSecretKey } from './config'

export class PayloftError extends Error {
  readonly status: number
  readonly detail: unknown

  constructor(message: string, status = 502, detail?: unknown) {
    super(message)
    this.name = 'PayloftError'
    this.status = status
    this.detail = detail
  }
}

interface PayloftRequestOptions {
  method?: 'GET' | 'POST'
  body?: Record<string, unknown>
  /** Injects `secretKey` into the body — only the initiate endpoint authenticates this way. */
  authenticate?: boolean
}

export async function payloftRequest<T>(path: string, options: PayloftRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, authenticate = false } = options

  if (authenticate && !payloftConfigured()) {
    throw new PayloftError(
      'Payloft integration is not configured. Set PAYLOFT_SECRET_KEY to a sk_test_ sandbox key.',
      503
    )
  }

  const payload = authenticate ? { ...body, secretKey: payloftSecretKey() } : body

  let res: Response
  try {
    res = await proxyFetch(`${PAYLOFT_BASE_URL}${PAYLOFT_API_PREFIX}${path}`, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
      signal: AbortSignal.timeout(PAYLOFT_TIMEOUT_MS),
    })
  } catch (error) {
    throw new PayloftError('Could not reach Payloft.', 502, error)
  }

  const json = await res.json().catch(() => null)

  if (!res.ok || json?.success === false) {
    throw new PayloftError(json?.message ?? `Payloft request failed (HTTP ${res.status})`, res.status, json)
  }

  return json as T
}
