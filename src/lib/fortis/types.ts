/** Request/response shapes for the Fortis Global External Motor API. */

export interface FortisLoginResponse {
  token?: string
  access_token?: string
  data?: { token?: string }
}

/** GET /external-api/me */
export interface FortisClientProfile {
  name?: string
  client_id?: string
  allowed_root_product_id?: number
  allowed_product_ids?: number[] | null
  allowed_cover_ids?: number[] | null
  is_active?: boolean
  last_used_at?: string | null
  [key: string]: unknown
}

/** A cover under a motor product, from GET /external-api/motor/catalog. */
export interface FortisCover {
  id: number
  name?: string
  price?: number | string
  premium?: number | string
  [key: string]: unknown
}

/**
 * A product node in the catalog. The docs describe "the motor root product,
 * child motor products, and their covers/prices" — this is deliberately
 * loose about how children are nested, since the exact shape hasn't been
 * observed against a live response. See `catalog.ts`.
 */
export interface FortisProduct {
  id: number
  name?: string
  covers?: FortisCover[]
  [key: string]: unknown
}

export interface FortisPolicyDetail {
  firstName: string
  lastName: string
  email: string
  phoneno: string
  address1: string
  city: string
  state: string
  country: string
  registrationNo: string
  model: string
  color: string
  year: string
  engineNumber: string
  chasisNumber: string
  policyVariant: string
  vehiclePrice: string
}

/** POST /external-api/motor/requests */
export interface FortisMotorRequestPayload {
  product_id: number
  cover_id: number
  policy_no: string
  customer_name: string
  email: string
  phone: string
  policy_details: FortisPolicyDetail[]
}

export interface FortisMotorRequestRecord {
  id: number
  external_reference: string
  status: string
  policy_no?: string
  product_id?: number
  cover_id?: number
  request_payload?: unknown
  response_payload?: unknown
  error_message?: string | null
  [key: string]: unknown
}

export interface FortisSubmitResponse {
  success: boolean
  message?: string
  data?: { request: FortisMotorRequestRecord }
}
