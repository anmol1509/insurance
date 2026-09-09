'use client'
import { useQuoteStore } from '@/store/quoteStore'
import RadioCard from '@/components/ui/RadioCard'
import { MEDICAL_COVER_OPTIONS } from '@/lib/constants'

/**
 * Step 1 — the same question the homepage quick-quote widget asks, so an
 * answer given there carries straight into the flow and is not repeated.
 */
export default function MedicalCoverFor() {
  const { medicalData, updateMedical } = useQuoteStore()

  return (
    <div className="max-w-lg mx-auto space-y-3">
      {MEDICAL_COVER_OPTIONS.map((o) => (
        <RadioCard
          key={o.value}
          label={o.label}
          priceHint={o.sub}
          selected={medicalData.coverFor === o.value}
          onClick={() => updateMedical({ coverFor: o.value, planType: o.planType, numberOfLives: o.lives })}
          productColor="var(--medical-600)"
          productColorBg="var(--medical-50)"
        />
      ))}
      <p className="font-sans text-[12px] pt-1 text-center" style={{ color: 'var(--text-muted)' }}>
        700+ accredited hospitals · personalised health plans
      </p>
    </div>
  )
}
