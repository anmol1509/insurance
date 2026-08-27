/**
 * Typed wrappers for every endpoint in the NSIA External Integration Guide.
 * Server-only — see `client.ts`.
 */
import { NsiaError, nsiaRequest } from './client'
import { NSIA_TIMEOUTS } from './config'
import type {
  NsiaDropdown,
  NsiaFieldMap,
  NsiaInsuredClient,
  NsiaMarinePricingRequest,
  NsiaMarinePricingResponse,
  NsiaProduct,
  NsiaProfilePayload,
  NsiaSubmissionResponse,
  NsiaUpload,
} from './types'

/* ------------------------------------------------------------------ */
/* Section 5 — customer identity                                       */
/* ------------------------------------------------------------------ */

/**
 * Section 5.1. Resolves to the existing client, or `null` when NSIA has no
 * profile for the email (the API answers 404 with the bare string
 * `"User not Found"`).
 */
export async function checkUser(email: string): Promise<NsiaInsuredClient | null> {
  try {
    const { data } = await nsiaRequest<NsiaInsuredClient | string>(
      '/insured-client/check-userdetails',
      { query: { Email: email }, anonymous: true }
    )
    if (!data || typeof data === 'string') return null
    return data.insuredId ? data : null
  } catch (error) {
    if (error instanceof NsiaError && error.status === 404) return null
    throw error
  }
}

/** Section 5.2 — creates the insured client and returns the new profile. */
export async function createProfile(payload: NsiaProfilePayload): Promise<NsiaInsuredClient> {
  const { data } = await nsiaRequest<NsiaInsuredClient>(
    '/account/profiling-insured-client',
    { method: 'POST', json: payload, anonymous: true }
  )
  if (!data?.insuredId) {
    throw new NsiaError('NSIA did not return an insuredId for the new profile.', 502, data)
  }
  return data
}

/**
 * Look up the customer by email and create the profile only if NSIA has never
 * seen them. Every product submission needs the resulting `insuredId`.
 */
export async function ensureInsuredClient(
  email: string,
  profile: NsiaProfilePayload
): Promise<{ client: NsiaInsuredClient; created: boolean }> {
  const existing = await checkUser(email)
  if (existing) return { client: existing, created: false }
  return { client: await createProfile(profile), created: true }
}

/* ------------------------------------------------------------------ */
/* Sections 6, 7.1, 8.1, 10.1 — master data                            */
/* ------------------------------------------------------------------ */

/** Cargo ratings sit under /mobile; every other dropdown under /DropDown. */
const DROPDOWN_PATHS: Record<NsiaDropdown, string> = {
  'user-type': '/DropDown/user-type',
  'identification-type': '/DropDown/identification-type',
  occupation: '/DropDown/occupation',
  'exchange-rate': '/DropDown/exchange-rate',
  'third-party-type': '/DropDown/third-party-type',
  'vehicle-color': '/DropDown/vehicle-color',
  'vehicle-brand': '/DropDown/vehicle-brand',
  'marine-cover-type': '/DropDown/marine-cover-type',
  'marine-cargo-rating': '/mobile/marine-cargo-rating',
  'public-liability-use': '/DropDown/public-liability-use',
}

export async function getDropdown<T = unknown>(name: NsiaDropdown): Promise<T> {
  const { data } = await nsiaRequest<T>(DROPDOWN_PATHS[name])
  return data
}

/* ------------------------------------------------------------------ */
/* Section 8.2 — marine premium calculator                             */
/* ------------------------------------------------------------------ */

export async function calculateMarinePremium(
  request: NsiaMarinePricingRequest
): Promise<NsiaMarinePricingResponse> {
  const { data } = await nsiaRequest<NsiaMarinePricingResponse>(
    '/mobile/marine-pricing-implementation',
    { method: 'POST', json: request }
  )
  return data
}

/* ------------------------------------------------------------------ */
/* Sections 7.2, 8.3, 9.2, 10.2, 11.2 — product submissions            */
/* ------------------------------------------------------------------ */

const SUBMISSION_PATHS: Record<NsiaProduct, string> = {
  motor: '/mobile/non-life-motor',
  marine: '/mobile/non-life-marine',
  'personal-accident': '/mobile/non-life-personal-accident',
  'public-liability': '/mobile/non-life-public-liability',
  'professional-indemnity': '/mobile/non-life-professional-indemnity',
}

/**
 * Builds the multipart body NSIA expects: scalar fields verbatim, and each
 * document as a `<Slot>.FileName` + `<Slot>.BinaryData` pair.
 */
export function buildSubmissionForm(fields: NsiaFieldMap, uploads: NsiaUpload[]): FormData {
  const form = new FormData()

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null) continue
    form.append(key, typeof value === 'boolean' ? String(value) : String(value))
  }

  for (const { slot, file } of uploads) {
    form.append(`${slot}.FileName`, file.name)
    form.append(`${slot}.BinaryData`, file, file.name)
  }

  return form
}

export async function submitProduct(
  product: NsiaProduct,
  fields: NsiaFieldMap,
  uploads: NsiaUpload[]
): Promise<NsiaSubmissionResponse> {
  const { data } = await nsiaRequest<NsiaSubmissionResponse>(SUBMISSION_PATHS[product], {
    method: 'POST',
    form: buildSubmissionForm(fields, uploads),
    timeoutMs: NSIA_TIMEOUTS.upload,
    // A part-uploaded multipart submission could create a duplicate policy on
    // retry, so these go out exactly once.
    retries: 0,
  })
  return data
}
