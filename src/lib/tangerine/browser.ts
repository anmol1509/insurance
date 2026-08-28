/** Browser-side helpers for the Tangerine integration. All calls go through our own routes. */

export interface TangerineApiError {
  error: string
  fields?: Record<string, string>
}

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null)
  if (!response.ok || body?.success === false) {
    const error: TangerineApiError = { error: body?.error ?? `Request failed (${response.status})`, fields: body?.fields }
    throw Object.assign(new Error(error.error), error)
  }
  return body as T
}

export async function fetchTangerineDropdowns<T extends Record<string, unknown>>(
  line: 'comprehensive' | 'thirdparty',
  names: string[]
): Promise<T> {
  const response = await fetch(`/api/tangerine/dropdowns?line=${line}&name=${names.join(',')}`)
  const body = await readJson<{ data: T }>(response)
  return body.data
}

export interface TangerineSubmissionResult {
  policyNumber: string | null
  certificateUrl: string | null
  transactionReferenceNo: string | null
  premium: string | null
  sumAssured: string | null
  message: string
}

export async function submitTangerineApplication(input: {
  product: 'comprehensive' | 'thirdparty'
  customer: Record<string, unknown>
  motor: Record<string, unknown>
  files: Record<string, File | undefined>
}): Promise<TangerineSubmissionResult> {
  const form = new FormData()
  form.append('payload', JSON.stringify({ customer: input.customer, motor: input.motor }))
  for (const [slot, file] of Object.entries(input.files)) {
    if (file) form.append(slot, file, file.name)
  }

  const response = await fetch(`/api/tangerine/submit/${input.product}`, { method: 'POST', body: form })
  return readJson<TangerineSubmissionResult>(response)
}
