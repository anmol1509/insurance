'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { calculateMotorPremium } from '@/lib/premiumCalculator'
import { MARKET_VALUE_RANGES } from '@/lib/constants'
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

export default function MotorReview() {
  const { motorData, updateMotor, setCalculatedPremium } = useQuoteStore()
  const { total, breakdown } = calculateMotorPremium(motorData)

  useEffect(() => {
    setCalculatedPremium(total, breakdown)
  }, [total])

  const valueLabel = MARKET_VALUE_RANGES.find(r => r.value === motorData.marketValueRange)?.label ?? motorData.marketValueRange

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border" style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}>
        <span className="text-lg">📋</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Please review your details carefully. After submitting, you'll see personalised plans from multiple insurers.
        </p>
      </div>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--motor-700)' }}>Vehicle Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Registration No." value={motorData.registrationNumber} />
          <Row label="Make & Model" value={motorData.vehicleMakeModel} />
          <Row label="Year" value={motorData.yearOfManufacture} />
          <Row label="Type" value={motorData.vehicleType} />
          <Row label="Colour" value={motorData.vehicleColour} />
          <Row label="Engine Capacity" value={motorData.engineCapacity} />
          <Row label="Market Value" value={valueLabel} />
          <Row label="Cover Type" value={motorData.coverType?.replace('_', ' ').toUpperCase()} />
          <Row label="Use Type" value={motorData.useType?.replace('_', ' ')} />
          <Row label="State" value={motorData.geographicalState} />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--motor-700)' }}>Driver Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="License No." value={motorData.licenseNumber} />
          <Row label="Driver Age" value={motorData.driverAge ? `${motorData.driverAge} years` : null} />
          <Row label="Experience" value={motorData.drivingExperience} />
          <Row label="Claims History" value={motorData.claimsHistory ? 'Yes' : 'None in 3 years'} />
          <Row label="Security Features" value={motorData.securityFeatures.join(', ') || 'None declared'} />
        </div>
      </section>

      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--motor-700)' }}>Policyholder Details</h3>
        <div className="rounded-2xl border border-[var(--border-default)] px-4 py-1">
          <Row label="Full Name" value={motorData.fullName} />
          <Row label="Date of Birth" value={motorData.dateOfBirth} />
          <Row label="NIN" value={motorData.nin ? `****${motorData.nin.slice(-4)}` : undefined} />
          <Row label="Phone" value={motorData.phone} />
          <Row label="Email" value={motorData.email} />
          <Row label="Gender" value={motorData.gender} />
          <Row label="Marital Status" value={motorData.maritalStatus} />
          <Row label="Address" value={motorData.residentialAddress} />
          <Row label="State" value={motorData.residentialState} />
        </div>
      </section>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 rounded"
          checked={motorData.reviewConfirmed}
          onChange={(e) => updateMotor({ reviewConfirmed: e.target.checked })}
        />
        <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          I confirm that all details above are accurate and consent to NAICOM regulatory disclosures.
          I understand my quote will be compared across multiple licensed underwriters.
        </span>
      </label>
    </div>
  )
}
