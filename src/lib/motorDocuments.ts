/**
 * Which documents the motor flow asks for. NSIA and Tangerine each name
 * their own slots and want different things depending on the plan the
 * customer picked.
 */
import { MOTOR_PLANS } from './motorPlans'
import { documentSlotsFor } from './nsia/documents'
import { TANGERINE_DOCUMENT_SLOTS } from './tangerine/documents'
import type { MotorData } from '@/store/quoteStore'

export interface MotorDocSlot {
  key: string
  label: string
  hint?: string
  required: boolean
}

/** Used when the chosen plan is not submitted through NSIA or Tangerine. */
export const GENERIC_MOTOR_DOC_SLOTS: MotorDocSlot[] = [
  { key: 'vehicle_license',    label: 'Vehicle License (Registration Certificate)', required: true },
  { key: 'proof_of_ownership', label: 'Proof of Ownership (Vehicle Particulars)',   required: true },
  { key: 'drivers_license',    label: "Driver's License Copy",                       required: true },
  { key: 'proof_of_address',   label: 'Proof of Address (Utility bill / bank statement)', required: false },
  { key: 'vehicle_photos',     label: 'Vehicle Photographs (front, rear, sides)',   required: false },
]

export function isNsiaMotorPlan(planId: string | null): boolean {
  return MOTOR_PLANS.find((plan) => plan.id === planId)?.nsia === true
}

export function tangerineLineFor(planId: string | null): 'comprehensive' | 'thirdparty' | null {
  return MOTOR_PLANS.find((plan) => plan.id === planId)?.tangerine ?? null
}

export function motorDocSlots(motorData: MotorData): MotorDocSlot[] {
  if (isNsiaMotorPlan(motorData.selectedUnderwriter)) {
    return documentSlotsFor('motor', {
      isCorporate: motorData.isBusinessPolicy,
      isComprehensive: motorData.coverType === 'comprehensive',
    }).map((entry) => ({
      key: entry.slot,
      label: entry.label,
      hint: entry.hint,
      required: entry.required,
    }))
  }

  if (tangerineLineFor(motorData.selectedUnderwriter)) {
    return TANGERINE_DOCUMENT_SLOTS.map((entry) => ({
      key: entry.slot,
      label: entry.label,
      required: entry.required,
    }))
  }

  return GENERIC_MOTOR_DOC_SLOTS
}

export function requiredMotorDocKeys(motorData: MotorData): string[] {
  return motorDocSlots(motorData)
    .filter((slot) => slot.required)
    .map((slot) => slot.key)
}
