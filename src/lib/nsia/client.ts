/**
 * Server-only: this module reads NSIA_ACCESS_TOKEN. Import it from route
 * handlers only, never from a client component.
 */
import { proxyFetch } from '@/lib/proxyFetch'
import { NSIA_TIMEOUTS, nsiaBaseUrl, nsiaToken } from './config'

/** Normalised failure from any NSIA call, safe to map onto an HTTP response. */
export class NsiaError extends Error {
  readonly status: number
  readonly detail: unknown

  constructor(message: string, status = 502, detail?: unknown) {
    super(message)
    this.name = 'NsiaError'
    this.status = status
    this.detail = detail
  }
}

interface NsiaRequestOptions {
  method?: 'GET' | 'POST'
  /** JSON body. Mutually exclusive with `form`. */
  json?: unknown
  /** Multipart body. Mutually exclusive with `json`. */
  form?: FormData
  query?: Record<string, string | number | undefined>
  /** Defaults to the guide's recommendation for the operation type. */
  timeoutMs?: number
  /** Endpoints reachable without a partner token (user check, profiling). */
  anonymous?: boolean
  /** Network-failure retries. The guide recommends a maximum of 3. */
  retries?: number
}

function buildUrl(path: string, query?: NsiaRequestOptions['query']): string {
  const url = new URL(`${nsiaBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`)
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }
  return url.toString()
}

function defaultTimeout(options: NsiaRequestOptions): number {
  if (options.form) return NSIA_TIMEOUTS.upload
  if (options.method === 'POST') return NSIA_TIMEOUTS.post
  return NSIA_TIMEOUTS.get
}

function isRetryable(error: unknown): boolean {
  if (error instanceof NsiaError) return false
  const name = (error as { name?: string } | null)?.name
  // AbortError covers our own timeout; the rest are undici/node socket failures.
  return name === 'AbortError' || name === 'TypeError' || name === 'FetchError'
}

/**
 * Parses a response body without assuming JSON — NSIA returns bare strings for
 * some errors (e.g. `"User not Found"` on the email lookup).
 */
async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function messageFrom(body: unknown, fallback: string): string {
  if (typeof body === 'string' && body.trim()) return body.trim()
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>
    for (const key of ['message', 'error', 'title', 'detail']) {
      const value = record[key]
      if (typeof value === 'string' && value.trim()) return value.trim()
    }
  }
  return fallback
}

/**
 * Performs one NSIA call, retrying only on network/timeout failures. HTTP error
 * statuses are surfaced immediately as an `NsiaError` — retrying a 400 or 401
 * would just burn the user's time.
 */
export async function nsiaRequest<T>(
  path: string,
  options: NsiaRequestOptions = {}
): Promise<{ data: T; status: number }> {
  const { method = 'GET', json, form, anonymous = false, retries = 3 } = options

  if (json !== undefined && form) {
    throw new NsiaError('Cannot send a JSON body and a multipart body together', 500)
  }

  const token = nsiaToken()
  if (!anonymous && !token) {
    throw new NsiaError(
      'NSIA integration is not configured. Set NSIA_ACCESS_TOKEN.',
      503
    )
  }

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  // Content-Type is intentionally omitted for multipart so fetch can append the
  // boundary itself.
  if (json !== undefined) headers['Content-Type'] = 'application/json'

  const url = buildUrl(path, options.query)
  const timeoutMs = options.timeoutMs ?? defaultTimeout(options)

  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await proxyFetch(url, {
        method,
        headers,
        body: form ?? (json !== undefined ? JSON.stringify(json) : undefined),
        signal: AbortSignal.timeout(timeoutMs),
      })

      const body = await parseBody(res)

      if (!res.ok) {
        throw new NsiaError(
          messageFrom(body, `NSIA request failed (HTTP ${res.status})`),
          res.status,
          body
        )
      }

      return { data: body as T, status: res.status }
    } catch (error) {
      lastError = error
      if (!isRetryable(error) || attempt === retries) break
      // 500ms, 1s, 2s — enough to ride out a blip without stalling the user.
      await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt))
    }
  }

  if (lastError instanceof NsiaError) throw lastError
  const name = (lastError as { name?: string } | null)?.name
  if (name === 'AbortError' || name === 'TimeoutError') {
    throw new NsiaError('The request to NSIA timed out. Please try again.', 504, lastError)
  }
  throw new NsiaError('Could not reach the NSIA Insurance API.', 502, lastError)
}
