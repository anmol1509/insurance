import { NextRequest, NextResponse } from 'next/server'
import { loginAndGetCatalog, submitMotorRequest } from '@/lib/fortis/api'
import { cheapestCoverPrice, extractMotorProducts, findMotorProduct } from '@/lib/fortis/catalog'
import { fortisErrorResponse } from '@/lib/fortis/http'
import { toFortisRequestPayload } from '@/lib/fortis/mappers'
import { fortisSubmitSchema } from '@/lib/fortis/schemas'

/**
 * Guide section 4 — POST /external-api/motor/requests.
 *
 * Per the docs, this writes to a temporary review table, not the live
 * policy workflow — Fortis's internal team processes it manually from
 * there. The reference this returns confirms receipt, not an issued policy.
 */
export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = fortisSubmitSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Some details are missing or invalid.' }, { status: 400 })
  }
  const { motorData, policyHolder } = parsed.data

  try {
    const { token, catalog } = await loginAndGetCatalog()
    const products = extractMotorProducts(catalog)

    const isComprehensive = motorData.coverType === 'comprehensive'
    const targetProduct = findMotorProduct(products, isComprehensive)
    const productId = targetProduct?.id
    const coverId = targetProduct?.covers?.[0]?.id

    if (!productId || !coverId) {
      return NextResponse.json(
        { success: false, error: 'No matching motor product/cover found in the Fortis catalog.' },
        { status: 422 }
      )
    }

    const payload = toFortisRequestPayload(motorData, policyHolder, productId, coverId)
    const result = await submitMotorRequest(token, payload)

    return NextResponse.json({
      success: true,
      reference: result.data?.request.external_reference ?? payload.policy_no,
      status: result.data?.request.status ?? 'received',
      product_id: productId,
      cover_id: coverId,
      // A cheapest-cover estimate for the chosen product, for callers that
      // want a price without a second catalog round trip.
      estimated_price: cheapestCoverPrice(targetProduct),
    })
  } catch (error) {
    return fortisErrorResponse(error)
  }
}
