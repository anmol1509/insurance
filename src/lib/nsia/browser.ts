/**
 * Browser-side helpers for the NSIA integration. Everything goes through our
 * own /api/nsia/* routes — the partner access token never leaves the server.
 */
import type {
  NsiaDropdown,
  NsiaInsuredClient,
  NsiaMarinePricingResponse,
  NsiaProduct,
} from './types'

export interface NsiaApiError {
  error: string
  fields?: Record<string, string>
}

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null)
  if (!response.ok || body?.success === false) {
    const error: NsiaApiError = {
      error: body?.error ?? `Request failed (${response.status})`,
      fields: body?.fields,
    }
    throw Object.assign(new Error(error.error), error)
  }
  return body as T
}

/** Section 5.1 — does NSIA already hold a profile for this email? */
export async function checkNsiaUser(email: string): Promise<NsiaInsuredClient | null> {
  const response = await fetch(`/api/nsia/check-user?email=${encodeURIComponent(email)}`)
  const body = await readJson<{ exists: boolean; client: NsiaInsuredClient | null }>(response)
  return body.exists ? body.client : null
}

/** Fetches one or more master-data lists in a single request. */
export async function fetchNsiaDropdowns<T extends Record<string, unknown>>(
  names: NsiaDropdown[]
): Promise<T> {
  const response = await fetch(`/api/nsia/dropdowns?name=${names.join(',')}`)
  const body = await readJson<{ data: T }>(response)
  return body.data
}

/** Section 8.2 — marine premium calculator. */
export async function calculateNsiaMarinePremium(request: {
  category: string
  sumInsured: number
  coverType: string
  currency?: string
}): Promise<NsiaMarinePricingResponse> {
  const response = await fetch('/api/nsia/marine-pricing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  const body = await readJson<{ pricing: NsiaMarinePricingResponse }>(response)
  return body.pricing
}

export interface NsiaSubmissionResult {
  product: NsiaProduct
  insuredId: number
  profileCreated: boolean
  policyNumber: string | null
  certOrDocNo: string | null
  message: string
}

/**
 * Submits an application with its documents. `files` is keyed by NSIA document
 * slot (`MeansOfIdentification`, `VehicleFrontDocument`, …).
 */
export async function submitNsiaApplication(input: {
  product: NsiaProduct
  customer: Record<string, unknown>
  details: Record<string, unknown>
  files: Record<string, File | undefined>
}): Promise<NsiaSubmissionResult> {
  const form = new FormData()
  form.append(
    'payload',
    JSON.stringify({ customer: input.customer, details: input.details })
  )

  for (const [slot, file] of Object.entries(input.files)) {
    if (file) form.append(slot, file, file.name)
  }

  const response = await fetch(`/api/nsia/submit/${input.product}`, {
    method: 'POST',
    body: form,
  })
  return readJson<NsiaSubmissionResult>(response)
}
