/**
 * Browser-side orchestration for the Payloft sandbox flow. All calls go
 * through our own /api/payloft/* routes — the secret key never reaches here.
 */

export interface PayloftApiError {
  error: string
  fields?: Record<string, string>
}

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null)
  if (!response.ok || body?.success === false) {
    const error: PayloftApiError = { error: body?.error ?? `Request failed (${response.status})`, fields: body?.fields }
    throw Object.assign(new Error(error.error), error)
  }
  return body as T
}

export interface PayloftOrder {
  orderId: number
  checkoutUrl: string
  referenceId: string
  isSandbox: boolean
}

export async function initiatePayloftOrder(input: {
  amount: number
  description?: string
  returnUrl: string
  customerName?: string
  email?: string
}): Promise<PayloftOrder> {
  const response = await fetch('/api/payloft/initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const body = await readJson<{ order: PayloftOrder }>(response)
  return body.order
}

export type PayloftCardInput = { method: 'card'; cardNumber: string; scheme: string; expiry: string; cvv: string }
export type PayloftPayAttitudeInput = { method: 'payattitude'; mobile: string }
export type PayloftTransferInput = { method: 'transfer' }

export async function submitPayloftPayment(
  orderId: number,
  payment: PayloftCardInput | PayloftPayAttitudeInput | PayloftTransferInput
): Promise<Record<string, unknown>> {
  const response = await fetch(`/api/payloft/${orderId}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment),
  })
  const body = await readJson<{ result: Record<string, unknown> }>(response)
  return body.result
}

export async function confirmPayloftTransfer(orderId: number): Promise<Record<string, unknown>> {
  const response = await fetch(`/api/payloft/${orderId}/transfer/confirm`, { method: 'POST' })
  const body = await readJson<{ result: Record<string, unknown> }>(response)
  return body.result
}

export interface PayloftTransactionResult {
  transactionId: number
  status: string
  approvalCode?: string
  referenceId?: string
  amount: number
}

export async function getPayloftResult(orderId: number): Promise<PayloftTransactionResult> {
  const response = await fetch(`/api/payloft/${orderId}/result`)
  const body = await readJson<{ result: PayloftTransactionResult }>(response)
  return body.result
}

/**
 * Polls the result endpoint until it leaves the pending state. The sandbox
 * generally resolves synchronously, so this mostly just confirms that once —
 * but a couple of retries absorb the timeout-simulation test case (guide
 * §"Transfer Test Scenarios") without the caller having to think about it.
 */
export async function pollPayloftResult(orderId: number, attempts = 4, delayMs = 800): Promise<PayloftTransactionResult> {
  let last: PayloftTransactionResult | null = null
  for (let i = 0; i < attempts; i++) {
    last = await getPayloftResult(orderId)
    if (last.status !== 'PENDING') return last
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  return last!
}
