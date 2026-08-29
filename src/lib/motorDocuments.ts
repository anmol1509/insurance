/**
 * Which documents the motor flow asks for. Every insurer this platform
 * actually integrates with (NSIA, Tangerine, AIICO) names its own slots
 * from its own documented API; Fortis's documented payload has no
 * document/image fields at all, so it asks for none. The generic fallback
 * below only ever applies to the handful of catalog-only plans that have
 * no live backend, since there is no fifth insurer to guess requirements
 * for.
 */
import { MOTOR_PLANS } from './motorPlans'
import { documentSlotsFor } from './nsia/documents'
import { TANGERINE_DOCUMENT_SLOTS } from './tangerine/documents'
import { aiicoDocumentSlots } from './aiico/documents'
import type { MotorData } from '@/store/quoteStore'

export interface MotorDocSlot {
  key: string
  label: string
  hint?: string
  required: boolean
}

/** Used only for catalog-only plans with no live insurer backend (e.g. FGI, SUNU, Leadway). */
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

export function isFortisMotorPlan(planId: string | null): boolean {
  return MOTOR_PLANS.find((plan) => plan.id === planId)?.fortisGlobal === true
}

export function tangerineLineFor(planId: string | null): 'comprehensive' | 'thirdparty' | null {
  return MOTOR_PLANS.find((plan) => plan.id === planId)?.tangerine ?? null
}

export function aiicoLineFor(planId: string | null): 'comprehensive' | 'third-party' | null {
  return MOTOR_PLANS.find((plan) => plan.id === planId)?.aiico ?? null
}

export function motorDocSlots(motorData: MotorData): MotorDocSlot[] {
  if (isFortisMotorPlan(motorData.selectedUnderwriter)) {
    return []
  }

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

  const aiicoLine = aiicoLineFor(motorData.selectedUnderwriter)
  if (aiicoLine) {
    return aiicoDocumentSlots(aiicoLine).map((entry) => ({
      key: entry.slot,
      label: entry.label,
      hint: entry.hint,
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

/** Slot keys that are a photo ID (or similar identity document), across every insurer's own naming. */
const IDENTITY_DOC_KEYS = new Set(['MeansOfIdentification', 'identification', 'drivers_license'])

export function isIdentityDocKey(key: string): boolean {
  return IDENTITY_DOC_KEYS.has(key)
}
