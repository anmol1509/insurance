/** Browser-side helper for the VerifyData vehicle lookup. Calls our own route only. */
import type { VerifiedVehicleFields } from './mappers'
import type { VerifyVehicleResponse } from './types'

export interface VerifyDataLookupError {
  error: string
}

export async function lookupVehicleByPlate(
  regNumber: string
): Promise<{ vehicle: VerifyVehicleResponse; fields: VerifiedVehicleFields }> {
  const response = await fetch('/api/verifydata/lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ regNumber }),
  })
  const body = await response.json().catch(() => null)
  if (!response.ok || body?.success === false) {
    const error: VerifyDataLookupError = { error: body?.error ?? `Request failed (${response.status})` }
    throw Object.assign(new Error(error.error), error)
  }
  return { vehicle: body.vehicle, fields: body.fields }
}
