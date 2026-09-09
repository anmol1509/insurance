'use client'
import { useQuoteStore } from '@/store/quoteStore'
import RadioCard from '@/components/ui/RadioCard'
import { TRAVEL_DESTINATIONS } from '@/lib/constants'

/**
 * Step 1 — the same question the homepage quick-quote widget asks, so an
 * answer given there carries straight into the flow and is not repeated.
 */
export default function TravelDestination() {
  const { travelData, updateTravel } = useQuoteStore()

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        {TRAVEL_DESTINATIONS.map((d) => (
          <RadioCard
            key={d.value}
            label={d.label}
            priceHint={d.sub}
            selected={travelData.destination === d.value}
            onClick={() => updateTravel({ destination: d.value })}
            productColor="var(--travel-600)"
            productColorBg="var(--travel-50)"
          />
        ))}
      </div>
      <p className="font-sans text-[12px] pt-1 text-center" style={{ color: 'var(--text-muted)' }}>
        Schengen certificate in 60 seconds · worldwide coverage
      </p>
    </div>
  )
}
