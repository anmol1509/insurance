/**
 * Server-only: this module reads VERIFYDATA_SECRET_KEY. Import it from route
 * handlers only, never from a client component.
 */
import { proxyFetch } from '@/lib/proxyFetch'
import { VERIFYDATA_BASE_URL, VERIFYDATA_TIMEOUT_MS, verifyDataConfigured, verifyDataSecretKey } from './config'
import { VERIFYDATA_ERROR_MESSAGES, type VerifyVehicleResponse } from './types'

export class VerifyDataError extends Error {
  readonly status: number
  readonly detail: unknown

  constructor(message: string, status = 502, detail?: unknown) {
    super(message)
    this.name = 'VerifyDataError'
    this.status = status
    this.detail = detail
  }
}

/** Guide section "VERIFY VEHICLE" — the only documented endpoint. */
export async function validateVehicle(regNumber: string): Promise<VerifyVehicleResponse> {
  if (!verifyDataConfigured()) {
    throw new VerifyDataError('VerifyData integration is not configured. Set VERIFYDATA_SECRET_KEY.', 503)
  }

  let res: Response
  try {
    res = await proxyFetch(`${VERIFYDATA_BASE_URL}/api/ValidateVehicle/Initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regNumber, secretKey: verifyDataSecretKey() }),
      signal: AbortSignal.timeout(VERIFYDATA_TIMEOUT_MS),
    })
  } catch (error) {
    throw new VerifyDataError('Could not reach VerifyData.', 502, error)
  }

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    // The guide keys its four documented errors by a "Code" column separate
    // from the HTTP status; fall back to the HTTP status if that's absent.
    const code = body?.code ?? body?.Code
    const message = VERIFYDATA_ERROR_MESSAGES[code] ?? body?.message ?? `VerifyData request failed (HTTP ${res.status})`
    throw new VerifyDataError(message, res.status, body)
  }

  return body as VerifyVehicleResponse
}
