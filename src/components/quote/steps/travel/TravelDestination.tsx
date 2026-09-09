'use client'
import { useQuoteStore } from '@/store/quoteStore'
import ChoiceCard from '@/components/ui/ChoiceCard'
import { TRAVEL_DESTINATIONS } from '@/lib/constants'
import { Landmark, Crown, Building2, Sun, Sunrise, Globe2, Plane } from 'lucide-react'

const ICONS = {
  schengen: Landmark, uk: Crown, usa_canada: Building2,
  africa: Sun, asia: Sunrise, worldwide: Globe2,
} as const

/**
 * Step 1 — the same question the homepage quick-quote widget asks, so an
 * answer given there carries straight into the flow and is not repeated.
 */
export default function TravelDestination() {
  const { travelData, updateTravel } = useQuoteStore()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="grid sm:grid-cols-2 gap-3">
        {TRAVEL_DESTINATIONS.map((d) => (
          <ChoiceCard
            key={d.value}
            icon={ICONS[d.value as keyof typeof ICONS]}
            label={d.label}
            sub={d.sub}
            selected={travelData.destination === d.value}
            onClick={() => updateTravel({ destination: d.value })}
            productColor="var(--travel-600)"
            productColorBg="var(--travel-50)"
          />
        ))}
      </div>

      <div
        className="mt-5 rounded-2xl border px-4 py-3.5 flex items-center gap-3"
        style={{ backgroundColor: 'var(--travel-50)', borderColor: 'var(--travel-100)' }}
      >
        <Plane className="w-5 h-5 shrink-0" style={{ color: 'var(--travel-600)' }} />
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Schengen-compliant certificate in 60 seconds · accepted by embassies
        </p>
      </div>
    </div>
  )
}
