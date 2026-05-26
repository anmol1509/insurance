import { NextRequest, NextResponse } from 'next/server'

const FORTIS_BASE = 'https://jjmgloballtd.com/coreinsurance/api'
const CLIENT_ID = 'FGI-MOTOR-CLIENT'
const CLIENT_SECRET = 'FGI-MOTOR-2026!'

async function getToken(): Promise<string> {
  const res = await fetch(`${FORTIS_BASE}/external-api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Auth failed (${res.status}): ${text.slice(0, 100)}`)
  }
  const data = await res.json()
  // Handle common token response shapes
  return data.token ?? data.access_token ?? data.data?.token
}

async function getCatalog(token: string) {
  const res = await fetch(`${FORTIS_BASE}/external-api/motor/catalog`, {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`Catalog failed (${res.status})`)
  return res.json()
}

export async function POST(req: NextRequest) {
  try {
    const { motorData, policyHolder } = await req.json()

    const token = await getToken()

    const catalog = await getCatalog(token)

    // Flatten products from various response shapes
    const products: any[] =
      catalog.data?.products ?? catalog.products ?? catalog.data ?? []

    const coverType: string = motorData?.coverType ?? 'tpo'
    const isComprehensive = coverType === 'comprehensive'

    // Pick product matching cover type; fall back to first available
    const targetProduct =
      products.find((p: any) =>
        isComprehensive
          ? /comprehensive/i.test(p.name ?? '')
          : /third.?party|tpo/i.test(p.name ?? '')
      ) ?? products[0]

    const product_id: number = targetProduct?.id
    const covers: any[] = targetProduct?.covers ?? []
    const cover_id: number = covers[0]?.id

    if (!product_id || !cover_id) {
      return NextResponse.json(
        { error: 'No matching product/cover found in catalog', catalog },
        { status: 422 }
      )
    }

    const nameParts = (policyHolder?.fullName ?? 'Customer').trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || firstName
    const policyNo = `EXT-${Date.now().toString(36).toUpperCase()}`

    const payload = {
      product_id,
      cover_id,
      policy_no: policyNo,
      customer_name: policyHolder?.fullName ?? 'Customer',
      email: policyHolder?.email ?? '',
      phone: policyHolder?.phone ?? '',
      policy_details: [
        {
          firstName,
          lastName,
          email: policyHolder?.email ?? '',
          phoneno: policyHolder?.phone ?? '',
          address1: motorData?.residentialAddress || 'Nigeria',
          city: motorData?.residentialState || 'Lagos',
          state: motorData?.residentialState || 'Lagos',
          country: 'Nigeria',
          registrationNo: motorData?.registrationNumber ?? '',
          model: motorData?.vehicleMakeModel ?? '',
          color: motorData?.vehicleColour ?? '',
          year: String(motorData?.yearOfManufacture ?? new Date().getFullYear()),
          engineNumber: motorData?.engineCapacity ?? '',
          chasisNumber: motorData?.chassisVIN ?? '',
          policyVariant: isComprehensive ? 'Comprehensive' : 'Third Party',
          vehiclePrice: String(motorData?.carValue ?? 0),
        },
      ],
    }

    const submitRes = await fetch(`${FORTIS_BASE}/external-api/motor/requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    })

    const result = await submitRes.json()

    if (!submitRes.ok) {
      return NextResponse.json(
        { error: result.message ?? 'Submission failed', detail: result },
        { status: submitRes.status }
      )
    }

    return NextResponse.json({
      success: true,
      reference: result.data?.request?.external_reference ?? policyNo,
      status: result.data?.request?.status ?? 'received',
      product_id,
      cover_id,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
