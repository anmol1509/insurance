import { NextResponse } from 'next/server'
import { fortisConfigured } from '@/lib/fortis/config'
import { nsiaConfigured } from '@/lib/nsia/config'
import { tangerineConfigured } from '@/lib/tangerine/config'
import { isAiicoConfigured } from '@/lib/aiico/config'

/**
 * `GET /api/motor/insurer-status` — which Motor insurers actually have
 * working credentials in this environment. Purely an env-var presence
 * check (no network calls), so it's cheap enough to call on every visit to
 * the plan-select step.
 *
 * The Motor comparison must never let a customer select and pay for a plan
 * whose insurer can't actually submit/finalize the policy afterwards — an
 * insurer missing here should be hidden from the comparison, not just
 * shown with a price estimate.
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      fortis: fortisConfigured(),
      nsia: nsiaConfigured(),
      tangerine: tangerineConfigured(),
      aiico: isAiicoConfigured(),
    },
  })
}
