/**
 * Document slots AIICO's PostMotorSchedule needs — sent as base64, not
 * hosted URLs. Third Party's own field table and sample payload never
 * mention `proofOfOwnershipUrl` at all (only Comprehensive's do), so it's
 * only asked for on a Comprehensive policy.
 */

export interface AiicoDocumentSlot {
  slot: string
  label: string
  hint?: string
  required: boolean
}

const BASE_SLOTS: AiicoDocumentSlot[] = [
  { slot: 'vehicle_license', label: 'Vehicle License (Registration Certificate)', required: true },
  { slot: 'identification', label: 'Valid Means of Identification', hint: 'National ID, international passport, or driver’s license', required: true },
]

const PROOF_OF_OWNERSHIP_SLOT: AiicoDocumentSlot = { slot: 'proof_of_ownership', label: 'Proof of Ownership (Vehicle Particulars)', required: true }
const UTILITY_BILL_SLOT: AiicoDocumentSlot = { slot: 'utility_bill', label: 'Utility Bill', hint: 'Optional', required: false }

export function aiicoDocumentSlots(line: 'comprehensive' | 'third-party'): AiicoDocumentSlot[] {
  return line === 'comprehensive'
    ? [...BASE_SLOTS, PROOF_OF_OWNERSHIP_SLOT, UTILITY_BILL_SLOT]
    : [...BASE_SLOTS, UTILITY_BILL_SLOT]
}
