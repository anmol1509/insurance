/** Bridges the quote store onto the plain-text payload the AIICO submit route expects. */
import type { MotorData } from '@/store/quoteStore'

export interface AiicoPolicyHolderInput {
  fullName: string
  email: string
  phone: string
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  return { firstName: parts[0] ?? fullName, lastName: parts.slice(1).join(' ') || parts[0] || fullName }
}

export function toAiicoCustomer(motorData: MotorData, policyHolder: AiicoPolicyHolderInput) {
  const { firstName, lastName } = splitName(policyHolder.fullName || motorData.fullName)
  return {
    title: motorData.title,
    gender: motorData.gender || undefined,
    firstName,
    lastName,
    dateOfBirth: motorData.dateOfBirth,
    email: policyHolder.email || motorData.email,
    phone: policyHolder.phone || motorData.phone,
    address: motorData.residentialAddress,
    nin: motorData.nin,
  }
}

export function toAiicoVehicle(motorData: MotorData) {
  return {
    vehicleType: motorData.vehicleType,
    regNo: motorData.registrationNumber,
    yearOfManufacture: String(motorData.yearOfManufacture ?? new Date().getFullYear()),
    vehicleMakeModel: motorData.vehicleMakeModel,
    chassisNo: motorData.chassisVIN,
    color: motorData.vehicleColour,
    // The quote flow doesn't collect a separate engine number — chassis/VIN
    // is the closest field we have. Revisit if AIICO rejects this.
    engineNo: motorData.chassisVIN,
    vehicleAmount: motorData.coverType === 'comprehensive' ? motorData.carValue ?? undefined : undefined,
  }
}
