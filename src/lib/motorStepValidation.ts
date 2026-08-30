/**
 * Single source of truth for what's actually required to proceed past
 * Motor's Documents (step 5) and Your details (step 6) steps.
 *
 * Both functions are driven by the same per-insurer configs that decide
 * which fields the UI shows and marks with a required asterisk
 * (`motorClientInfoConfig`, `motorDocSlots`, the Tangerine/AIICO extra-field
 * components) — so a field can never be required in the UI without also
 * being enforced here, and vice versa. Two fields already slipped through
 * that gap before this existed (Marital Status, AIICO's Title): a customer
 * could leave them blank, click through to checkout, pay, and only then
 * have the actual submission fail. Add a new insurer field's requiredness
 * to the relevant config and it is automatically enforced here too — never
 * duplicate the check by hand in `nextDisabled`.
 */
import type { MotorData } from '@/store/quoteStore'
import { motorClientInfoConfig } from './motorClientInfo'
import { aiicoLineFor, requiredMotorDocKeys, tangerineLineFor } from './motorDocuments'

export function motorStep5Missing(motorData: MotorData): string[] {
  const missing: string[] = []

  if (requiredMotorDocKeys(motorData).some((k) => !motorData.uploadedDocs[k])) {
    missing.push('Required documents')
  }

  if (tangerineLineFor(motorData.selectedUnderwriter) !== null) {
    if (!motorData.lgaOfResidence.trim()) missing.push('Local Government Area (LGA)')
    if (!motorData.vehicleRegistrationDate) missing.push('Vehicle registration date')
    if (motorData.coverType === 'comprehensive' && !(motorData.mileageKm != null && motorData.mileageKm >= 0)) {
      missing.push('Current vehicle mileage')
    }
    if (motorData.isBusinessPolicy && !motorData.tin.trim()) missing.push('Tax Identification Number (TIN)')
  }

  if (aiicoLineFor(motorData.selectedUnderwriter) !== null && !motorData.title.trim()) {
    missing.push('Title')
  }

  return missing
}

export function motorStep6Missing(motorData: MotorData): string[] {
  const config = motorClientInfoConfig(motorData.selectedUnderwriter)
  const missing: string[] = []

  if (!motorData.fullName.trim()) missing.push('Full Name')
  if (!motorData.email.includes('@')) missing.push('Email Address')
  if (motorData.phone.replace(/\D/g, '').length < 11) missing.push('Phone Number')
  if (!motorData.residentialAddress.trim()) missing.push('Residential Address')

  if (config.dateOfBirth && !motorData.dateOfBirth) missing.push('Date of Birth')
  if (config.nin && !motorData.nin.trim()) missing.push('National Identification Number (NIN)')
  if (config.gender && !motorData.gender) missing.push('Gender')
  if (config.occupation && !motorData.occupation) missing.push('Occupation')
  if (config.residentialState && !motorData.residentialState) missing.push('State of Residence')

  if (config.corporateToggle && config.corporateDetails && motorData.isBusinessPolicy) {
    if (!motorData.companyName.trim()) missing.push('Company Name')
    if (!motorData.rcNumber.trim()) missing.push('RC Number')
  }

  return missing
}
