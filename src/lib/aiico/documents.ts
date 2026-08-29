/** Document slots AIICO's PostMotorSchedule needs — sent as base64, not hosted URLs. */

export interface AiicoDocumentSlot {
  slot: string
  label: string
  hint?: string
  required: boolean
}

export const AIICO_DOCUMENT_SLOTS: AiicoDocumentSlot[] = [
  { slot: 'vehicle_license', label: 'Vehicle License (Registration Certificate)', required: true },
  { slot: 'identification', label: 'Valid Means of Identification', hint: 'National ID, international passport, or driver’s license', required: true },
  { slot: 'proof_of_ownership', label: 'Proof of Ownership (Vehicle Particulars)', required: true },
  { slot: 'utility_bill', label: 'Utility Bill', hint: 'Optional', required: false },
]
