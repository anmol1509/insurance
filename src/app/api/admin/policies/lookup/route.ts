import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { confirmPolicyNumber, confirmRegistrationNumber } from '@/lib/tangerine/api'
import { tangerineErrorResponse } from '@/lib/tangerine/http'

/**
 * Live insurer lookup — queries the insurer's own system directly, no
 * database involved. Only Tangerine (both product lines) documents a
 * query-by-policy/registration-number endpoint; NSIA and Fortis do not
 * expose one in the manuals this integration was built from, so those
 * insurers aren't offered here.
 */
const lookupSchema = z.object({
  line: z.enum(['comprehensive', 'thirdparty']),
  identifierType: z.enum(['policyNumber', 'registrationNumber']),
  value: z.string().min(1, 'Enter a policy or registration number'),
})

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Expected a JSON body.' }, { status: 400 })
  }

  const parsed = lookupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Enter an insurer, identifier type, and value.' }, { status: 400 })
  }
  const { line, identifierType, value } = parsed.data

  try {
    const result = identifierType === 'policyNumber'
      ? await confirmPolicyNumber(line, value)
      : await confirmRegistrationNumber(line, value)

    return NextResponse.json({
      success: true,
      result: {
        insurer: 'Tangerine Insurance',
        line,
        policyNumber: result.PolicyNo ?? null,
        insuredName: result.InsuredName ?? null,
        registrationNo: result.RegistrationNo ?? null,
        coverDate: result.CoverDate ?? null,
        expirationDate: result.ExpirationDate ?? null,
        premium: result.Premium ?? null,
        sumAssured: result.SumAssured ?? null,
        transactionStatus: result.TransactionStatus ?? null,
        transactionReferenceNo: result.TransactionReferenceNo ?? null,
        certificateUrl: result.CertificateURL ?? result.CertificateURLTemp ?? null,
      },
    })
  } catch (error) {
    return tangerineErrorResponse(error)
  }
}
