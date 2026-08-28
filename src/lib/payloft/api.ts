/** Typed wrappers for the Payloft Sandbox checkout endpoints. */
import { payloftRequest } from './client'
import type {
  PayloftCheckoutDetails,
  PayloftInitiateRequest,
  PayloftInitiateResponse,
  PayloftPayRequest,
  PayloftResult,
  PayloftTransferInitiated,
} from './types'

/** Step 1 — creates a sandbox order. Authenticates via secretKey in the body. */
export async function initiateOrder(request: PayloftInitiateRequest): Promise<PayloftInitiateResponse['data']> {
  const res = await payloftRequest<PayloftInitiateResponse>('/initiate', {
    method: 'POST',
    body: { ...request },
    authenticate: true,
  })
  return res.data
}

/** Step 2 — checkout page data (not used by our own custom checkout UI, but exposed for completeness). */
export async function getCheckoutDetails(orderId: number): Promise<PayloftCheckoutDetails['data']> {
  const res = await payloftRequest<PayloftCheckoutDetails>(`/${orderId}`)
  return res.data
}

/** Step 3 — submit payment. Card, PayAttitude, or the first half of a bank transfer. */
export async function submitPayment(
  orderId: number,
  request: PayloftPayRequest
): Promise<PayloftTransferInitiated | Record<string, unknown>> {
  return payloftRequest(`/${orderId}/pay`, { method: 'POST', body: { ...request } })
}

/** Step 3b — confirms a pending transfer (simulates the bank crediting the virtual account). */
export async function confirmTransfer(orderId: number): Promise<Record<string, unknown>> {
  return payloftRequest(`/${orderId}/transfer/confirm`, { method: 'POST', body: {} })
}

/** Step 4 — the correct endpoint to poll for the final transaction status. */
export async function getResult(orderId: number): Promise<PayloftResult['data']> {
  const res = await payloftRequest<PayloftResult>(`/${orderId}/result`)
  return res.data
}
