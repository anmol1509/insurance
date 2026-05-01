'use client'
import { useEffect, useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { calculateTravelPremium } from '@/lib/premiumCalculator'
import { formatNaira } from '@/lib/formatters'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const UNDERWRITERS = [
  { id: 'axa',      name: 'AXA Mansard Travel', rating: '4.8', badge: 'Most popular' },
  { id: 'leadway',  name: 'Leadway Assurance',  rating: '4.7', badge: '' },
  { id: 'allianz',  name: 'Allianz Nigeria',    rating: '4.6', badge: 'Best price' },
  { id: 'aiico',    name: 'AIICO Insurance',    rating: '4.5', badge: '' },
]

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
      <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  )
}

export default function TravelReview() {
  const { travelData, updateTravel, setCalculatedPremium } = useQuoteStore()
  const [selectedUnderwriter, setSelectedUnderwriter] = useState(travelData.selectedUnderwriter ?? 'axa')

  const { total, breakdown } = calculateTravelPremium(travelData)

  useEffect(() => {
    setCalculatedPremium(total, breakdown)
    updateTravel({ selectedUnderwriter })
  }, [total, selectedUnderwriter])

  return (
    <div className="space-y-8">
      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--travel-700)' }}>Traveller Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden px-4 py-1">
          <Row label="Full Name" value={travelData.fullName} />
          <Row label="Date of Birth" value={travelData.dateOfBirth} />
          <Row label="NIN" value={travelData.nin ? `****${travelData.nin.slice(-4)}` : undefined} />
          <Row label="Passport" value={travelData.passportNumber} />
          <Row label="Number of Travellers" value={travelData.numberOfTravellers} />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--travel-700)' }}>Trip Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden px-4 py-1">
          <Row label="Destination" value={travelData.destination} />
          <Row label="Trip Type" value={travelData.tripType?.replace('_', ' ')} />
          <Row label="Departure" value={travelData.departureDate} />
          <Row label="Return" value={travelData.returnDate} />
          <Row label="Currency" value={travelData.preferredCurrency} />
          <Row label="Add-ons" value={travelData.addons.join(', ') || 'None'} />
          <Row label="Medical Emergency Cover" value={travelData.medicalEmergencyCover ? 'Yes' : 'No'} />
        </div>
      </section>

      <motion.div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: 'var(--travel-50)', borderColor: 'var(--travel-100)' }}
      >
        <p className="font-sans font-medium text-[13px] mb-1" style={{ color: 'var(--text-muted)' }}>Estimated premium</p>
        <p className="font-display font-extrabold text-[42px] leading-none" style={{ color: 'var(--travel-600)' }}>
          {formatNaira(total)}
        </p>
        <div className="mt-4 pt-4 border-t border-[var(--travel-100)] flex flex-col gap-1.5">
          {Object.entries(breakdown).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{formatNaira(v)}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--text-primary)' }}>Select Underwriter</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {UNDERWRITERS.map((uw) => {
            const selected = selectedUnderwriter === uw.id
            return (
              <button
                key={uw.id}
                type="button"
                onClick={() => setSelectedUnderwriter(uw.id)}
                className="relative border-[1.5px] rounded-2xl p-4 text-left transition-all"
                style={selected ? { borderColor: 'var(--travel-600)', backgroundColor: 'var(--travel-50)' } : { borderColor: 'var(--border-default)', backgroundColor: 'white' }}
              >
                {uw.badge && (
                  <span className="absolute top-3 right-3 font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--green-100)', color: 'var(--green-700)' }}>
                    {uw.badge}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  {selected && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--travel-600)' }} />}
                  <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{uw.name}</p>
                </div>
                <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>★ {uw.rating} · NAICOM Licensed</p>
                <p className="font-display font-bold text-base mt-2" style={{ color: selected ? 'var(--travel-600)' : 'var(--text-primary)' }}>{formatNaira(total)}</p>
              </button>
            )
          })}
        </div>
      </section>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 rounded"
          checked={travelData.reviewConfirmed}
          onChange={(e) => updateTravel({ reviewConfirmed: e.target.checked })}
        />
        <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          I confirm that all details are correct and I have read and accepted the policy terms and conditions.
        </span>
      </label>
    </div>
  )
}
