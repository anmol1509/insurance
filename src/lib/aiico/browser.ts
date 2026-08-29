/** Browser-side helpers for the AIICO integration. All calls go through our own routes. */

export interface AiicoApiError {
  error: string
  fields?: Record<string, string>
}

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null)
  if (!response.ok || body?.success === false) {
    const error: AiicoApiError = { error: body?.error ?? `Request failed (${response.status})`, fields: body?.fields }
    throw Object.assign(new Error(error.error), error)
  }
  return body as T
}

export async function fetchAiicoDropdowns<T extends Record<string, unknown>>(names: string[], params?: Record<string, string>): Promise<T> {
  const query = new URLSearchParams({ name: names.join(','), ...params })
  const response = await fetch(`/api/aiico/dropdowns?${query.toString()}`)
  const body = await readJson<{ data: T }>(response)
  return body.data
}

export async function lookupAiicoVehicle(numberPlate: string) {
  const response = await fetch(`/api/aiico/vehicle-lookup?plate=${encodeURIComponent(numberPlate)}`)
  const body = await readJson<{ data: unknown }>(response)
  return body.data
}

export async function computeAiicoThirdPartyPremium(bodyType: string): Promise<number> {
  const response = await fetch(`/api/aiico/premium?bodyType=${encodeURIComponent(bodyType)}`)
  const body = await readJson<{ premium: number }>(response)
  return body.premium
}

export interface AiicoMotorSubmissionResult {
  policyNumber: string | null
  certificateUrl: string | null
  transactionRef: string
}

export async function submitAiicoMotorApplication(input: {
  line: 'third-party' | 'comprehensive'
  wefDt: string
  wetDt: string
  customer: Record<string, unknown>
  vehicle: Record<string, unknown>
  images: Record<string, unknown>
  payment: { accountNumber: string; amountPaid: number; paymentRef: string; partnerReference: string }
}): Promise<AiicoMotorSubmissionResult> {
  const response = await fetch('/api/aiico/submit/motor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return readJson<AiicoMotorSubmissionResult>(response)
}

export async function getAiicoRenewalDetails(policyNo: string) {
  const response = await fetch(`/api/aiico/renewal?policyNo=${encodeURIComponent(policyNo)}`)
  const body = await readJson<{ data: unknown }>(response)
  return body.data
}

export async function submitAiicoMotorRenewal(input: {
  oldPolicyNumber: string
  regNo: string
  make: string
  model: string
  bodyType: string
  premiumAmount: number
  firstName: string
  lastName: string
  pryEmail: string
  smsTel: string
  wefDt: string
  wetDt: string
  payment: { accountNumber: string; amountPaid: number; paymentRef: string; partnerReference: string }
}): Promise<AiicoMotorSubmissionResult> {
  const response = await fetch('/api/aiico/submit/motor-renewal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return readJson<AiicoMotorSubmissionResult>(response)
}
