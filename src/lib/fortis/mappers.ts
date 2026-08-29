/**
 * Builds the exact request body Fortis's `/external-api/motor/requests`
 * expects (guide section 4) from our own quote-store shape.
 */
import type { FortisMotorRequestPayload } from './types'

export interface FortisMotorInput {
  coverType?: 'comprehensive' | 'tpo' | null
  residentialAddress?: string
  residentialState?: string
  registrationNumber?: string
  vehicleMakeModel?: string
  vehicleColour?: string
  yearOfManufacture?: number | null
  engineCapacity?: string
  chassisVIN?: string
  carValue?: number | null
}

export interface FortisPolicyHolderInput {
  fullName: string
  email: string
  phone: string
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: 'Customer', lastName: 'Customer' }
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

export function toFortisRequestPayload(
  motorData: FortisMotorInput,
  policyHolder: FortisPolicyHolderInput,
  productId: number,
  coverId: number
): FortisMotorRequestPayload {
  const isComprehensive = motorData.coverType === 'comprehensive'
  const { firstName, lastName } = splitName(policyHolder.fullName)
  const policyNo = `EXT-${Date.now().toString(36).toUpperCase()}`

  return {
    product_id: productId,
    cover_id: coverId,
    policy_no: policyNo,
    customer_name: policyHolder.fullName,
    email: policyHolder.email,
    phone: policyHolder.phone,
    policy_details: [
      {
        firstName,
        lastName,
        email: policyHolder.email,
        phoneno: policyHolder.phone,
        address1: motorData.residentialAddress || 'Nigeria',
        city: motorData.residentialState || 'Lagos',
        state: motorData.residentialState || 'Lagos',
        country: 'Nigeria',
        registrationNo: motorData.registrationNumber ?? '',
        model: motorData.vehicleMakeModel ?? '',
        color: motorData.vehicleColour ?? '',
        year: String(motorData.yearOfManufacture ?? new Date().getFullYear()),
        engineNumber: motorData.engineCapacity ?? '',
        chasisNumber: motorData.chassisVIN ?? '',
        policyVariant: isComprehensive ? 'Comprehensive' : 'Third Party',
        vehiclePrice: String(motorData.carValue ?? 0),
      },
    ],
  }
}
