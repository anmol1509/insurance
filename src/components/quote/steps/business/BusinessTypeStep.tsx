'use client'
import { useQuoteStore } from '@/store/quoteStore'
import RadioCard from '@/components/ui/RadioCard'
import { BUSINESS_TYPES } from '@/lib/constants'

/**
 * Step 1 — the same question the homepage quick-quote widget asks, so an
 * answer given there carries straight into the flow and is not repeated.
 */
export default function BusinessTypeStep() {
  const { businessData, updateBusiness } = useQuoteStore()

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        {BUSINESS_TYPES.map((t) => (
          <RadioCard
            key={t}
            label={t}
            selected={businessData.businessType === t}
            onClick={() => updateBusiness({ businessType: t })}
            productColor="var(--business-600)"
            productColorBg="var(--business-50)"
          />
        ))}
      </div>
      <p className="font-sans text-[12px] pt-1 text-center" style={{ color: 'var(--text-muted)' }}>
        Covers premises &amp; staff · tax deductible under CITA
      </p>
    </div>
  )
}
