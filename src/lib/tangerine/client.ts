/**
 * Server-only: this module reads TANGERINE_USER_ID / TANGERINE_API_KEY.
 * Import it from route handlers only, never from a client component.
 */
import { proxyFetch } from '@/lib/proxyFetch'
import { TANGERINE_TIMEOUT_MS, tangerineAuthHeader, tangerineBaseUrl, tangerineUserId, type TangerineLine } from './config'
import type { TangerineEnvelope } from './types'

export class TangerineError extends Error {
  readonly status: number
  readonly detail: unknown

  constructor(message: string, status = 502, detail?: unknown) {
    super(message)
    this.name = 'TangerineError'
    this.status = status
    this.detail = detail
  }
}

/**
 * Every Tangerine endpoint is a POST to a fixed `.aspx` path with a JSON body
 * and a base64 `userid:APIKEY` Authorization header (no "Bearer" prefix — the
 * manual is explicit that the header value is the raw base64 string).
 */
export async function tangerineRequest<T extends TangerineEnvelope>(
  line: TangerineLine,
  path: string,
  body: Record<string, unknown>
): Promise<T> {
  const auth = tangerineAuthHeader()
  if (!auth) {
    throw new TangerineError(
      'Tangerine integration is not configured. Set TANGERINE_USER_ID and TANGERINE_API_KEY.',
      503
    )
  }

  const url = `${tangerineBaseUrl(line)}/${path}`

  let res: Response
  try {
    res = await proxyFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify({ UserID: tangerineUserId(), ...body }),
      signal: AbortSignal.timeout(TANGERINE_TIMEOUT_MS),
    })
  } catch (error) {
    throw new TangerineError('Could not reach the Tangerine API.', 502, error)
  }

  const text = await res.text()
  let data: T
  try {
    let parsed: unknown = JSON.parse(text)
    // The manual's own examples are inconsistent about this: several
    // endpoints show the JSON object wrapped in an extra pair of quotes
    // (double-encoded). Unwrap once more if that's what came back.
    if (typeof parsed === 'string') parsed = JSON.parse(parsed)
    data = parsed as T
  } catch {
    throw new TangerineError('Tangerine returned an unexpected response.', 502, text)
  }

  if (!res.ok) {
    throw new TangerineError(data.Message ?? `Tangerine request failed (HTTP ${res.status})`, res.status, data)
  }
  if (data.Status !== 'Successful') {
    throw new TangerineError(data.Message ?? 'Tangerine declined the request.', 400, data)
  }

  return data
}
