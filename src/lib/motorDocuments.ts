/**
 * Which documents the motor flow asks for. NSIA names its own slots and wants
 * more of them on comprehensive or corporate policies, so the list depends on
 * the plan the customer picked.
 */
import { MOTOR_PLANS } from './motorPlans'
import { documentSlotsFor } from './nsia/documents'
import type { MotorData } from '@/store/quoteStore'

export interface MotorDocSlot {
  key: string
  label: string
  hint?: string
  required: boolean
}

/** Used when the chosen plan is not submitted through NSIA. */
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

export function motorDocSlots(motorData: MotorData): MotorDocSlot[] {
  if (!isNsiaMotorPlan(motorData.selectedUnderwriter)) return GENERIC_MOTOR_DOC_SLOTS

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

export function requiredMotorDocKeys(motorData: MotorData): string[] {
  return motorDocSlots(motorData)
    .filter((slot) => slot.required)
    .map((slot) => slot.key)
}
