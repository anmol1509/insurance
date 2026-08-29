/**
 * Which Motor insurers actually have working credentials in this
 * environment, and whether a given plan can be sold as a result.
 *
 * A plan with no insurer flag (`fortisGlobal`/`nsia`/`tangerine`/`aiico`)
 * isn't backed by a live partner API at all — those are always available,
 * since selecting one never calls a real insurer and can't fail after
 * payment. A plan that IS insurer-backed must only be offered when that
 * insurer's credentials are actually configured, so a customer can never
 * pay for a policy the platform can't then submit.
 */
import type { MotorPlan } from './motorPlans'

export interface MotorInsurerStatus {
  fortis: boolean
  nsia: boolean
  tangerine: boolean
  aiico: boolean
}

export function motorInsurerKeyFor(plan: MotorPlan): keyof MotorInsurerStatus | null {
  if (plan.fortisGlobal) return 'fortis'
  if (plan.nsia) return 'nsia'
  if (plan.tangerine != null) return 'tangerine'
  if (plan.aiico != null) return 'aiico'
  return null
}

/** `status` of `null` means "not loaded yet" — treated as available so plans don't flicker/hide while the check is in flight. */
export function isMotorPlanAvailable(plan: MotorPlan, status: MotorInsurerStatus | null): boolean {
  const key = motorInsurerKeyFor(plan)
  if (!key) return true
  if (!status) return true
  return status[key]
}

export async function fetchMotorInsurerStatus(): Promise<MotorInsurerStatus> {
  const response = await fetch('/api/motor/insurer-status')
  const body = await response.json().catch(() => null)
  if (!response.ok || !body?.success) {
    throw new Error(body?.error ?? `Request failed (${response.status})`)
  }
  return body.data as MotorInsurerStatus
}
