'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { calculateTravelPremium } from '@/lib/premiumCalculator'
import { motion } from 'framer-motion'

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
      <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="font-sans text-[13px] font-medium text-right max-w-[55%]" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  )
}

export default function TravelReview() {
  const { travelData, updateTravel, setCalculatedPremium } = useQuoteStore()
  const { total, breakdown } = calculateTravelPremium(travelData)

  useEffect(() => {
    setCalculatedPremium(total, breakdown)
  }, [total])

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--travel-50)', borderColor: 'var(--travel-100)' }}>
        <span className="text-lg">📋</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Please review your details carefully. After submitting, you'll see personalised travel plans from multiple insurers.
        </p>
      </div>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--travel-700)' }}>Traveller Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Full Name" value={travelData.fullName} />
          <Row label="Date of Birth" value={travelData.dateOfBirth} />
          <Row label="NIN" value={travelData.nin ? `****${travelData.nin.slice(-4)}` : undefined} />
          <Row label="Passport" value={travelData.passportNumber} />
          <Row label="Number of Travellers" value={travelData.numberOfTravellers} />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--travel-700)' }}>Trip Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Destination" value={travelData.destination} />
          <Row label="Trip Type" value={travelData.tripType?.replace('_', ' ')} />
          <Row label="Departure" value={travelData.departureDate} />
          <Row label="Return" value={travelData.returnDate} />
          <Row label="Currency" value={travelData.preferredCurrency} />
          <Row label="Add-ons" value={travelData.addons.join(', ') || 'None'} />
          <Row label="Medical Emergency Cover" value={travelData.medicalEmergencyCover ? 'Yes' : 'No'} />
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
