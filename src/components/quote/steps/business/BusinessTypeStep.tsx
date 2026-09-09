'use client'
import { useQuoteStore } from '@/store/quoteStore'
import ChoiceCard from '@/components/ui/ChoiceCard'
import { BUSINESS_TYPES } from '@/lib/constants'
import {
  Store, Factory, UtensilsCrossed, Briefcase, HardHat,
  Laptop, Stethoscope, GraduationCap, Truck, Building2, ShieldCheck,
} from 'lucide-react'

const ICONS: Record<string, React.ElementType> = {
  'Retail / Trading': Store,
  'Manufacturing': Factory,
  'Food & Hospitality': UtensilsCrossed,
  'Professional Services': Briefcase,
  'Construction': HardHat,
  'Technology': Laptop,
  'Healthcare': Stethoscope,
  'Education': GraduationCap,
  'Logistics / Transport': Truck,
  'Other': Building2,
}

/**
 * Step 1 — the same question the homepage quick-quote widget asks, so an
 * answer given there carries straight into the flow and is not repeated.
 */
export default function BusinessTypeStep() {
  const { businessData, updateBusiness } = useQuoteStore()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-3">
        {BUSINESS_TYPES.map((t) => (
          <ChoiceCard
            key={t}
            icon={ICONS[t] ?? Building2}
            label={t}
            selected={businessData.businessType === t}
            onClick={() => updateBusiness({ businessType: t })}
            productColor="var(--business-600)"
            productColorBg="var(--business-50)"
          />
        ))}
      </div>

      <div
        className="mt-5 rounded-2xl border px-4 py-3.5 flex items-center gap-3"
        style={{ backgroundColor: 'var(--business-50)', borderColor: 'var(--business-100)' }}
      >
        <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: 'var(--business-600)' }} />
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Covers premises, stock &amp; staff · premiums tax deductible under CITA
        </p>
      </div>
    </div>
  )
}
