/**
 * Document slots each NSIA product expects (guide sections 7.2, 8.3, 9.2,
 * 10.2, 11.2). Shared by the upload UI and by server-side validation so the
 * two can never drift apart.
 */
import type { NsiaProduct } from './types'

export interface NsiaDocumentSlot {
  /** NSIA multipart slot name, e.g. `VehicleFrontDocument`. */
  slot: string
  label: string
  hint?: string
  required: boolean
  /** Only required when the applicant is a company. */
  corporateOnly?: boolean
  /** Only required for comprehensive motor cover. */
  comprehensiveOnly?: boolean
}

const MOTOR_DOCUMENTS: NsiaDocumentSlot[] = [
  { slot: 'MeansOfIdentification', label: 'Means of identification', hint: 'ID card or international passport', required: true },
  { slot: 'UtilityBill', label: 'Utility bill', hint: 'Issued within the last 3 months', required: true },
  { slot: 'CustomPaperOrPurchaseReceiptDocument', label: 'Custom paper or purchase receipt', required: true, comprehensiveOnly: true },
  { slot: 'VehicleFrontDocument', label: 'Vehicle photo — front', required: true, comprehensiveOnly: true },
  { slot: 'VehicleRearDocument', label: 'Vehicle photo — rear', required: true, comprehensiveOnly: true },
  { slot: 'VehicleLeftSideDocument', label: 'Vehicle photo — left side', required: true, comprehensiveOnly: true },
  { slot: 'VehicleRightSideDocument', label: 'Vehicle photo — right side', required: true, comprehensiveOnly: true },
  { slot: 'CertificateOfIncorporation', label: 'Certificate of incorporation (CAC)', required: true, corporateOnly: true },
  { slot: 'ProofOfOwnershipDocument', label: 'Proof of ownership', required: false },
  { slot: 'VehicleChasisNumberDocument', label: 'Chassis number photo', required: false },
  { slot: 'VehiclePlateNumberDocument', label: 'Plate number photo', required: false },
]

const MARINE_DOCUMENTS: NsiaDocumentSlot[] = [
  { slot: 'MeansOfIdentification', label: 'Means of identification', required: true },
  { slot: 'UtilityBill', label: 'Utility bill', required: true },
  { slot: 'CommercialInvoice', label: 'Commercial invoice', required: true },
  { slot: 'BillOfLading', label: 'Bill of lading', required: false },
  { slot: 'PackingList', label: 'Packing list', required: false },
]

const PERSONAL_ACCIDENT_DOCUMENTS: NsiaDocumentSlot[] = [
  { slot: 'MeansOfIdentification', label: 'Means of identification', required: true },
  { slot: 'UtilityBill', label: 'Utility bill', required: true },
  { slot: 'PassportPhotograph', label: 'Passport photograph', required: true },
  { slot: 'MedicalReport', label: 'Medical report', hint: 'Required for a high sum insured', required: false },
]

const PUBLIC_LIABILITY_DOCUMENTS: NsiaDocumentSlot[] = [
  { slot: 'CertificateOfIncorporation', label: 'Certificate of incorporation (CAC)', required: true },
  { slot: 'MeansOfIdentification', label: "Director's means of identification", required: true },
  { slot: 'UtilityBill', label: 'Business utility bill', required: true },
  { slot: 'BusinessLicense', label: 'Business licence or permit', required: true },
]

const PROFESSIONAL_INDEMNITY_DOCUMENTS: NsiaDocumentSlot[] = [
  { slot: 'ProfessionalLicense', label: 'Professional licence or certificate', required: true },
  { slot: 'MeansOfIdentification', label: 'Means of identification', required: true },
  { slot: 'UtilityBill', label: 'Utility bill', required: true },
  { slot: 'PracticeCertificate', label: 'Current practising certificate', required: true },
  { slot: 'BusinessRegistration', label: 'Business registration', required: false },
]

export const NSIA_DOCUMENT_SLOTS: Record<NsiaProduct, NsiaDocumentSlot[]> = {
  motor: MOTOR_DOCUMENTS,
  marine: MARINE_DOCUMENTS,
  'personal-accident': PERSONAL_ACCIDENT_DOCUMENTS,
  'public-liability': PUBLIC_LIABILITY_DOCUMENTS,
  'professional-indemnity': PROFESSIONAL_INDEMNITY_DOCUMENTS,
}

export interface SlotContext {
  isCorporate?: boolean
  isComprehensive?: boolean
}

/** The slots that apply to one application, given who is applying. */
export function documentSlotsFor(
  product: NsiaProduct,
  { isCorporate = false, isComprehensive = true }: SlotContext = {}
): NsiaDocumentSlot[] {
  return NSIA_DOCUMENT_SLOTS[product].filter((slot) => {
    if (slot.corporateOnly && !isCorporate) return false
    if (slot.comprehensiveOnly && !isComprehensive) return false
    return true
  })
}

export function requiredSlotsFor(product: NsiaProduct, context: SlotContext = {}): string[] {
  return documentSlotsFor(product, context)
    .filter((slot) => slot.required)
    .map((slot) => slot.slot)
}

/** Slot names NSIA will accept for a product, required and optional alike. */
export function knownSlotsFor(product: NsiaProduct): Set<string> {
  return new Set(NSIA_DOCUMENT_SLOTS[product].map((slot) => slot.slot))
}
