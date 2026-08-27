/** Request and response shapes for the NSIA Insurance external API. */

export type NsiaProduct =
  | 'motor'
  | 'marine'
  | 'personal-accident'
  | 'public-liability'
  | 'professional-indemnity'

export const NSIA_PRODUCTS: NsiaProduct[] = [
  'motor',
  'marine',
  'personal-accident',
  'public-liability',
  'professional-indemnity',
]

/** Section 5.1 — GET /insured-client/check-userdetails */
export interface NsiaInsuredClient {
  insuredId: number
  firstName?: string
  surname?: string
  /** NSIA returns both spellings; prefer `surname` and fall back to this. */
  surName?: string
  email?: string
  mobilePhone?: string
  address?: string
}

/** Section 5.2 — POST /account/profiling-insured-client */
export interface NsiaProfilePayload {
  surname: string
  firstname: string
  address: string
  fullName: string
  state: string
  landphone: string
  mobilePhone: string
  email: string
  nationalId: string
  occupation: string
  sex: string
  country: string
  /** ISO 8601, e.g. 1990-01-15T00:00:00.000Z */
  dateofBirth: string
  meansOfId: string
  meansOfIdNumber: string
}

/** Section 6 & product-specific dropdowns. */
export type NsiaDropdown =
  | 'user-type'
  | 'identification-type'
  | 'occupation'
  | 'exchange-rate'
  | 'third-party-type'
  | 'vehicle-color'
  | 'vehicle-brand'
  | 'marine-cover-type'
  | 'marine-cargo-rating'
  | 'public-liability-use'

export const NSIA_DROPDOWNS: NsiaDropdown[] = [
  'user-type',
  'identification-type',
  'occupation',
  'exchange-rate',
  'third-party-type',
  'vehicle-color',
  'vehicle-brand',
  'marine-cover-type',
  'marine-cargo-rating',
  'public-liability-use',
]

export interface NsiaExchangeRate {
  currency: string
  rate: number
}

export interface NsiaThirdPartyType {
  id: number
  name: string
  description?: string
}

export interface NsiaMarineCargoRating {
  id: number
  name: string
  description?: string
}

/** Section 8.2 — POST /mobile/marine-pricing-implementation */
export interface NsiaMarinePricingRequest {
  category: string
  sumInsured: number
  coverType: string
  currency: string
}

export interface NsiaMarinePricingResponse {
  premium: number
  rate: number
  sumInsured: number
  coverType: string
}

/** Shared submission response across all five products. */
export interface NsiaSubmissionResponse {
  certOrDocNo?: string
  policyNumber?: string
  message?: string
}

/** 0 = Personal, 1 = Corporate. */
export const NSIA_USER_TYPE = { personal: 0, corporate: 1 } as const

/**
 * A file destined for a multipart submission. NSIA expects each document as a
 * `<Slot>.FileName` / `<Slot>.BinaryData` field pair.
 */
export interface NsiaUpload {
  /** NSIA document slot, e.g. `MeansOfIdentification`. */
  slot: string
  file: File
}

/** Flat field maps sent as multipart form data, one per product. */
export type NsiaFieldMap = Record<string, string | number | boolean | null | undefined>
