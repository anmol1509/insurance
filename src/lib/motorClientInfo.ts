/**
 * Which "Your details" (Step 6) fields actually matter for the insurer the
 * customer picked. Built directly from what each insurer's own submit
 * mapper reads — not every insurer wants the same KYC fields, and asking
 * for ones a given insurer never uses is exactly the kind of overreach this
 * platform has been trimming insurer-by-insurer.
 */
import { MOTOR_PLANS } from './motorPlans'

export interface MotorClientInfoConfig {
  dateOfBirth: boolean
  nin: boolean
  bvn: boolean
  gender: boolean
  occupation: boolean
  residentialState: boolean
  /** The Individual/Corporate radio itself. */
  corporateToggle: boolean
  /** Company Name + RC Number, shown only when corporateToggle is also on. */
  corporateDetails: boolean
}

/** Used for the handful of catalog-only plans with no live insurer backend — show everything, since we don't know what a hypothetical insurer would need. */
const DEFAULT_CONFIG: MotorClientInfoConfig = {
  dateOfBirth: true, nin: true, bvn: true, gender: true, occupation: true,
  residentialState: true, corporateToggle: true, corporateDetails: true,
}

/** toNsiaCustomer + toNsiaMotorDetails read: gender, dateOfBirth, occupation, nin, address, state, isBusinessPolicy, companyName, rcNumber. No bvn. */
const NSIA_CONFIG: MotorClientInfoConfig = {
  dateOfBirth: true, nin: true, bvn: false, gender: true, occupation: true,
  residentialState: true, corporateToggle: true, corporateDetails: true,
}

/** toTangerineCustomer reads: address, userType, nin, bvn. No dateOfBirth, gender, or occupation. Corporate only needs the TIN already collected in TangerineMotorDetails (Step 5) — not a company name/RC number. */
const TANGERINE_CONFIG: MotorClientInfoConfig = {
  dateOfBirth: false, nin: true, bvn: true, gender: false, occupation: false,
  residentialState: true, corporateToggle: true, corporateDetails: false,
}

/** toFortisRequestPayload reads: name, email, phone, address, city/state. No nin, dateOfBirth, gender, occupation, or corporate concept at all. */
const FORTIS_CONFIG: MotorClientInfoConfig = {
  dateOfBirth: false, nin: false, bvn: false, gender: false, occupation: false,
  residentialState: true, corporateToggle: false, corporateDetails: false,
}

/** toAiicoCustomer reads: title (Step 5), gender (optional), dateOfBirth, nin (required), address. No bvn, occupation, residentialState, or corporate concept. */
const AIICO_CONFIG: MotorClientInfoConfig = {
  dateOfBirth: true, nin: true, bvn: false, gender: true, occupation: false,
  residentialState: false, corporateToggle: false, corporateDetails: false,
}

export function motorClientInfoConfig(planId: string | null): MotorClientInfoConfig {
  const plan = MOTOR_PLANS.find((p) => p.id === planId)
  if (!plan) return DEFAULT_CONFIG
  if (plan.nsia) return NSIA_CONFIG
  if (plan.tangerine != null) return TANGERINE_CONFIG
  if (plan.fortisGlobal) return FORTIS_CONFIG
  if (plan.aiico != null) return AIICO_CONFIG
  return DEFAULT_CONFIG
}
