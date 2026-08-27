import { NextResponse, type NextRequest } from 'next/server'
import { ensureInsuredClient, submitProduct } from '@/lib/nsia/api'
import { documentSlotsFor, knownSlotsFor, requiredSlotsFor } from '@/lib/nsia/documents'
import { validateFileBasics } from '@/lib/nsia/files'
import { nsiaErrorResponse, validationResponse } from '@/lib/nsia/http'
import {
  toMarineFields,
  toMotorFields,
  toPersonalAccidentFields,
  toProfessionalIndemnityFields,
  toProfilePayload,
  toPublicLiabilityFields,
} from '@/lib/nsia/mappers'
import {
  customerSchema,
  fieldErrors,
  productParamSchema,
  productSchemas,
  type CustomerInput,
} from '@/lib/nsia/schemas'
import type { NsiaFieldMap, NsiaProduct, NsiaUpload } from '@/lib/nsia/types'

/**
 * Guide sections 7.2, 8.3, 9.2, 10.2 and 11.2 — submit an application.
 *
 * Accepts `multipart/form-data` with:
 *   - `payload`  a JSON string of `{ customer, details }`
 *   - one file per NSIA document slot, e.g. `MeansOfIdentification`
 *
 * The route resolves the customer's `insuredId` (creating the profile when
 * NSIA has never seen them), maps our fields onto NSIA's, and forwards the
 * whole thing as one multipart request.
 */

type FieldBuilder = (
  customer: CustomerInput,
  details: never,
  insuredClientId: number
) => NsiaFieldMap

const FIELD_BUILDERS: Record<NsiaProduct, FieldBuilder> = {
  motor: toMotorFields as FieldBuilder,
  marine: toMarineFields as FieldBuilder,
  'personal-accident': toPersonalAccidentFields as FieldBuilder,
  'public-liability': toPublicLiabilityFields as FieldBuilder,
  'professional-indemnity': toProfessionalIndemnityFields as FieldBuilder,
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ product: string }> }
) {
  const { product: productParam } = await context.params

  const productParsed = productParamSchema.safeParse(productParam)
  if (!productParsed.success) {
    return NextResponse.json(
      { success: false, error: `Unknown NSIA product "${productParam}".` },
      { status: 404 }
    )
  }
  const product = productParsed.data as NsiaProduct

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Expected a multipart/form-data body.' },
      { status: 400 }
    )
  }

  const rawPayload = form.get('payload')
  if (typeof rawPayload !== 'string') {
    return validationResponse({ payload: 'A JSON "payload" field is required.' })
  }

  let payload: { customer?: unknown; details?: unknown }
  try {
    payload = JSON.parse(rawPayload)
  } catch {
    return validationResponse({ payload: 'The "payload" field is not valid JSON.' })
  }

  const customerParsed = customerSchema.safeParse(payload.customer)
  if (!customerParsed.success) {
    return validationResponse(prefixed('customer', fieldErrors(customerParsed.error)))
  }
  const customer = customerParsed.data

  const detailsParsed = productSchemas[product].safeParse(payload.details)
  if (!detailsParsed.success) {
    return validationResponse(prefixed('details', fieldErrors(detailsParsed.error)))
  }

  const isCorporate = customer.userType === 'corporate'
  const isComprehensive =
    product !== 'motor' ||
    (detailsParsed.data as { coverType?: string }).coverType === 'COMPREHENSIVE'

  const { uploads, errors: uploadErrors } = collectUploads(form, product)
  if (Object.keys(uploadErrors).length > 0) return validationResponse(uploadErrors)

  const provided = new Set(uploads.map((upload) => upload.slot))
  const missing = requiredSlotsFor(product, { isCorporate, isComprehensive }).filter(
    (slot) => !provided.has(slot)
  )
  if (missing.length > 0) {
    const labels = documentSlotsFor(product, { isCorporate, isComprehensive })
    return validationResponse(
      Object.fromEntries(
        missing.map((slot) => [
          slot,
          `${labels.find((entry) => entry.slot === slot)?.label ?? slot} is required.`,
        ])
      )
    )
  }

  try {
    const { client, created } = await ensureInsuredClient(
      customer.email,
      toProfilePayload(customer)
    )

    const fields = FIELD_BUILDERS[product](
      customer,
      detailsParsed.data as never,
      client.insuredId
    )

    const result = await submitProduct(product, fields, uploads)
    const policyNumber = result.policyNumber ?? result.certOrDocNo ?? null

    return NextResponse.json({
      success: true,
      product,
      insuredId: client.insuredId,
      profileCreated: created,
      policyNumber,
      certOrDocNo: result.certOrDocNo ?? policyNumber,
      message: result.message ?? 'Policy created successfully',
    })
  } catch (error) {
    return nsiaErrorResponse(error)
  }
}

/**
 * Pulls the document files out of the form, ignoring any slot NSIA does not
 * recognise for this product and rejecting files that break the size or format
 * rules in guide section 15.
 */
function collectUploads(
  form: FormData,
  product: NsiaProduct
): { uploads: NsiaUpload[]; errors: Record<string, string> } {
  const known = knownSlotsFor(product)
  const uploads: NsiaUpload[] = []
  const errors: Record<string, string> = {}

  for (const [key, value] of form.entries()) {
    if (key === 'payload' || !known.has(key)) continue
    if (typeof value === 'string') continue

    const file = value as File
    const problem = validateFileBasics({ name: file.name, size: file.size, type: file.type })
    if (problem) {
      errors[key] = problem
      continue
    }
    uploads.push({ slot: key, file })
  }

  return { uploads, errors }
}

function prefixed(prefix: string, errors: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(errors).map(([field, message]) => [`${prefix}.${field}`, message])
  )
}
