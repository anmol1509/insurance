'use client'
import { useQuoteStore } from '@/store/quoteStore'
import ChoiceCard from '@/components/ui/ChoiceCard'
import { MEDICAL_COVER_OPTIONS } from '@/lib/constants'
import { User, Heart, Users, Building2, Hospital } from 'lucide-react'

const ICONS = { individual: User, couple: Heart, family: Users, group: Building2 } as const

/**
 * Step 1 — the same question the homepage quick-quote widget asks, so an
 * answer given there carries straight into the flow and is not repeated.
 */
export default function MedicalCoverFor() {
  const { medicalData, updateMedical } = useQuoteStore()

  return (
    <div className="max-w-xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-3">
        {MEDICAL_COVER_OPTIONS.map((o) => (
          <ChoiceCard
            key={o.value}
            icon={ICONS[o.value as keyof typeof ICONS]}
            label={o.label}
            sub={o.sub}
            selected={medicalData.coverFor === o.value}
            onClick={() => updateMedical({ coverFor: o.value, planType: o.planType, numberOfLives: o.lives })}
            productColor="var(--medical-600)"
            productColorBg="var(--medical-50)"
          />
        ))}
      </div>

      <div
        className="mt-5 rounded-2xl border px-4 py-3.5 flex items-center gap-3"
        style={{ backgroundColor: 'var(--medical-50)', borderColor: 'var(--medical-100)' }}
      >
        <Hospital className="w-5 h-5 shrink-0" style={{ color: 'var(--medical-600)' }} />
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          700+ accredited hospitals nationwide · plans priced per life covered
        </p>
      </div>
    </div>
  )
}
