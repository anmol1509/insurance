/** Bridges the quote store onto the payload the Tangerine submit route expects. */
import type { MotorData } from '@/store/quoteStore'

export interface TangerinePolicyHolderInput {
  fullName: string
  email: string
  phone: string
}

export function toTangerineCustomer(motorData: MotorData, policyHolder: TangerinePolicyHolderInput) {
  return {
    fullName: policyHolder.fullName || motorData.fullName,
    phone: policyHolder.phone || motorData.phone,
    email: policyHolder.email || motorData.email,
    address: motorData.residentialAddress,
    userType: motorData.isBusinessPolicy ? ('corporate' as const) : ('personal' as const),
    tin: motorData.tin,
    nin: motorData.nin,
    bvn: motorData.bvn,
  }
}

export function toTangerineMotor(motorData: MotorData) {
  return {
    vehicleMakeModel: motorData.vehicleMakeModel,
    colour: motorData.vehicleColour,
    state: motorData.residentialState,
    lga: motorData.lgaOfResidence,
    chassisNumber: motorData.chassisVIN,
    registrationNumber: motorData.registrationNumber,
    yearOfMake: motorData.yearOfManufacture ?? new Date().getFullYear(),
    engineCapacity: motorData.engineCapacity,
    valuation: motorData.coverType === 'comprehensive' ? motorData.carValue ?? undefined : undefined,
    mileageKm: motorData.mileageKm ?? undefined,
    vehicleRegistrationDate: motorData.vehicleRegistrationDate,
    usageType: motorData.useType === 'commercial' ? ('commercial' as const) : ('private' as const),
  }
}
