/** Browser-side helpers for the admin policies dashboard. */
import type { PolicyInput, PolicyRecord } from './policies'
import type { AgentInput, AgentRecord } from './agents'

export interface AdminApiError {
  error: string
  fields?: Record<string, string>
}

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null)
  if (!response.ok || body?.success === false) {
    const error: AdminApiError = { error: body?.error ?? `Request failed (${response.status})`, fields: body?.fields }
    throw Object.assign(new Error(error.error), error)
  }
  return body as T
}

export async function fetchPolicies(filters: { productType?: string; status?: string; search?: string } = {}): Promise<PolicyRecord[]> {
  const params = new URLSearchParams()
  if (filters.productType && filters.productType !== 'all') params.set('productType', filters.productType)
  if (filters.status) params.set('status', filters.status)
  if (filters.search) params.set('search', filters.search)

  const response = await fetch(`/api/admin/policies?${params.toString()}`)
  const body = await readJson<{ policies: PolicyRecord[] }>(response)
  return body.policies
}

export async function createPolicyRecord(input: PolicyInput): Promise<PolicyRecord> {
  const response = await fetch('/api/admin/policies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const body = await readJson<{ policy: PolicyRecord }>(response)
  return body.policy
}

export async function updatePolicyRecord(id: string, input: Partial<PolicyInput>): Promise<PolicyRecord> {
  const response = await fetch(`/api/admin/policies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const body = await readJson<{ policy: PolicyRecord }>(response)
  return body.policy
}

export async function deletePolicyRecord(id: string): Promise<void> {
  const response = await fetch(`/api/admin/policies/${id}`, { method: 'DELETE' })
  await readJson<{ success: true }>(response)
}

export interface TangerineLookupResult {
  insurer: string
  line: 'comprehensive' | 'thirdparty'
  policyNumber: string | null
  insuredName: string | null
  registrationNo: string | null
  coverDate: string | null
  expirationDate: string | null
  premium: string | null
  sumAssured: string | null
  transactionStatus: string | null
  transactionReferenceNo: string | null
  certificateUrl: string | null
}

export async function lookupTangerinePolicy(input: {
  line: 'comprehensive' | 'thirdparty'
  identifierType: 'policyNumber' | 'registrationNumber'
  value: string
}): Promise<TangerineLookupResult> {
  const response = await fetch('/api/admin/policies/lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const body = await readJson<{ result: TangerineLookupResult }>(response)
  return body.result
}

export async function fetchAgents(filters: { active?: boolean; search?: string } = {}): Promise<AgentRecord[]> {
  const params = new URLSearchParams()
  if (filters.active !== undefined) params.set('active', String(filters.active))
  if (filters.search) params.set('search', filters.search)

  const response = await fetch(`/api/admin/agents?${params.toString()}`)
  const body = await readJson<{ agents: AgentRecord[] }>(response)
  return body.agents
}

export async function createAgentRecord(input: AgentInput): Promise<AgentRecord> {
  const response = await fetch('/api/admin/agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const body = await readJson<{ agent: AgentRecord }>(response)
  return body.agent
}

export async function updateAgentRecord(id: string, input: Partial<AgentInput>): Promise<AgentRecord> {
  const response = await fetch(`/api/admin/agents/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const body = await readJson<{ agent: AgentRecord }>(response)
  return body.agent
}

export async function deleteAgentRecord(id: string): Promise<void> {
  const response = await fetch(`/api/admin/agents/${id}`, { method: 'DELETE' })
  await readJson<{ success: true }>(response)
}
