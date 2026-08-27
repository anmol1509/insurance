/**
 * Bridges our quote store onto the payload the NSIA submit route expects.
 * Client-safe: no credentials, no environment access.
 */
import { VEHICLE_MAKES } from '@/lib/constants'
import type { MotorData } from '@/store/quoteStore'

/** Our ID labels carry local wording; NSIA uses its own identification-type list. */
const ID_TYPE_TO_NSIA: Record<string, string> = {
  'National ID Card (NIN)': 'National ID',
  'International Passport': 'International Passport',
  "Driver's License": "Driver's License",
  "Voter's Card": "Voter's Card",
  'NIMC Card': 'National ID',
}

export function toNsiaIdType(idType: string): string {
  return ID_TYPE_TO_NSIA[idType] ?? 'National ID'
}

/**
 * Splits our single "make and model" field. Multi-word makes such as
 * "Land Rover" are matched against the known list first so the remainder is a
 * clean model name.
 */
export function splitMakeModel(value: string): { make: string; model: string } {
  const trimmed = value.trim()
  if (!trimmed) return { make: '', model: '' }

  const match = VEHICLE_MAKES
    .filter((make) => make !== 'Other')
    .filter((make) => trimmed.toLowerCase().startsWith(make.toLowerCase()))
    .sort((a, b) => b.length - a.length)[0]

  if (match) {
    return { make: match, model: trimmed.slice(match.length).trim() || match }
  }

  const parts = trimmed.split(/\s+/)
  return { make: parts[0], model: parts.slice(1).join(' ') || parts[0] }
}

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: '', lastName: '' }
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

export interface PolicyHolderInput {
  fullName: string
  email: string
  phone: string
}

/**
 * The customer block shared by every NSIA product. Checkout collects a name,
 * email and phone of its own, so those win over anything captured earlier.
 */
export function toNsiaCustomer(motorData: MotorData, policyHolder: PolicyHolderInput) {
  const { firstName, lastName } = splitFullName(policyHolder.fullName || motorData.fullName)

  return {
    firstName,
    lastName,
    email: policyHolder.email || motorData.email,
    phone: policyHolder.phone || motorData.phone,
    address: motorData.residentialAddress,
    state: motorData.residentialState || 'Lagos',
    country: 'Nigeria',
    gender: motorData.gender.toLowerCase(),
    dateOfBirth: motorData.dateOfBirth,
    occupation: motorData.occupation,
    nationalId: motorData.nin || motorData.idNumber,
    meansOfId: toNsiaIdType(motorData.idType),
    meansOfIdNumber: motorData.idNumber || motorData.nin,
    userType: motorData.isBusinessPolicy ? ('corporate' as const) : ('personal' as const),
    companyName: motorData.companyName,
    rcNumber: motorData.rcNumber,
  }
}

/** The motor block for `POST /api/nsia/submit/motor`. */
export function toNsiaMotorDetails(motorData: MotorData, premium: number) {
  const { make, model } = splitMakeModel(motorData.vehicleMakeModel)
  const isComprehensive = motorData.coverType === 'comprehensive'

  return {
    coverType: isComprehensive ? ('COMPREHENSIVE' as const) : ('THIRDPARTY' as const),
    // Third-party cover carries no agreed vehicle value, so NSIA receives 0.
    sumInsured: isComprehensive ? motorData.carValue ?? 0 : 0,
    premium,
    vehicleMake: make,
    vehicleModel: model,
    vehicleType: motorData.vehicleType,
    year: motorData.yearOfManufacture ?? new Date().getFullYear(),
    color: motorData.vehicleColour,
    chassisNo: motorData.chassisVIN,
    engineNo: motorData.engineCapacity,
    registrationNo: motorData.registrationNumber,
    natureOfUse: motorData.useType === 'commercial' ? 'Commercial' : 'Private',
    tracking: 0,
    nameOfAgent: '',
    inspectionVenue: motorData.residentialAddress,
    inspectorName: '',
    inspectorPhoneNumber: '',
  }
}
