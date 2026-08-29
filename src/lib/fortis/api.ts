/** Typed wrappers for every endpoint in the Fortis External Motor API documentation. */
import { fortisLogin, fortisRequest } from './client'
import type {
  FortisClientProfile,
  FortisMotorRequestPayload,
  FortisMotorRequestRecord,
  FortisSubmitResponse,
} from './types'

/** Section 2 — GET /external-api/me. Confirms the token and returns the client's catalog scope. */
export async function getClientProfile(token: string): Promise<FortisClientProfile> {
  return fortisRequest<FortisClientProfile>('/external-api/me', token)
}

/** Section 3 — GET /external-api/motor/catalog. Returns the raw response; flatten with `catalog.ts`. */
export async function getMotorCatalog(token: string): Promise<unknown> {
  return fortisRequest<unknown>('/external-api/motor/catalog', token)
}

/** Section 4 — POST /external-api/motor/requests. Writes to Fortis's temporary review table. */
export async function submitMotorRequest(
  token: string,
  payload: FortisMotorRequestPayload
): Promise<FortisSubmitResponse> {
  return fortisRequest<FortisSubmitResponse>('/external-api/motor/requests', token, {
    method: 'POST',
    body: payload,
    timeoutMs: 10_000,
  })
}

/** Section 4 — GET /external-api/motor/requests. Lists this client's own submitted requests. */
export async function listMotorRequests(token: string): Promise<FortisMotorRequestRecord[]> {
  const body = await fortisRequest<{ data?: FortisMotorRequestRecord[] } | FortisMotorRequestRecord[]>(
    '/external-api/motor/requests',
    token
  )
  return Array.isArray(body) ? body : body.data ?? []
}

/** Section 4 — GET /external-api/motor/requests/{requestRecord}. */
export async function getMotorRequest(token: string, requestRecord: string): Promise<FortisMotorRequestRecord> {
  const body = await fortisRequest<Record<string, unknown>>(
    `/external-api/motor/requests/${encodeURIComponent(requestRecord)}`,
    token
  )
  const nested = body.data as FortisMotorRequestRecord | undefined
  return nested ?? (body as unknown as FortisMotorRequestRecord)
}

/** Fetches a bearer token and the raw motor catalog in one call — the common case. */
export async function loginAndGetCatalog(): Promise<{ token: string; catalog: unknown }> {
  const token = await fortisLogin()
  const catalog = await getMotorCatalog(token)
  return { token, catalog }
}
