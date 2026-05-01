'use client'
import { useEffect, useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { calculateMotorPremium } from '@/lib/premiumCalculator'
import { formatNaira } from '@/lib/formatters'
import { MARKET_VALUE_RANGES } from '@/lib/constants'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const UNDERWRITERS = [
  { id: 'leadway',    name: 'Leadway Assurance',    rating: '4.8', badge: 'Most popular' },
  { id: 'aiico',     name: 'AIICO Insurance',       rating: '4.7', badge: 'Best price' },
  { id: 'axa',       name: 'AXA Mansard Insurance', rating: '4.6', badge: '' },
  { id: 'nsia',      name: 'NSIA Insurance',        rating: '4.5', badge: '' },
]

function Row({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null
  return (
    <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
      <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="font-sans text-[13px] font-medium text-right max-w-[55%]" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  )
}

export default function MotorReview() {
  const { motorData, updateMotor, setCalculatedPremium } = useQuoteStore()
  const [selectedUnderwriter, setSelectedUnderwriter] = useState(motorData.selectedUnderwriter ?? 'leadway')

  const { total, breakdown } = calculateMotorPremium(motorData)

  useEffect(() => {
    setCalculatedPremium(total, breakdown)
    updateMotor({ selectedUnderwriter })
  }, [total, selectedUnderwriter])

  const valueLabel = MARKET_VALUE_RANGES.find((r) => r.value === motorData.marketValueRange)?.label ?? motorData.marketValueRange

  return (
    <div className="space-y-8">
      {/* Vehicle summary */}
      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--motor-700)' }}>
          Vehicle Details
        </h3>
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden px-4 py-1">
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

      {/* Driver summary */}
      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--motor-700)' }}>
          Driver Details
        </h3>
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden px-4 py-1">
          <Row label="License No." value={motorData.licenseNumber} />
          <Row label="Driver Age" value={motorData.driverAge ? `${motorData.driverAge} years` : null} />
          <Row label="Experience" value={motorData.drivingExperience} />
          <Row label="Claims History" value={motorData.claimsHistory ? 'Yes' : 'None in 3 years'} />
          <Row label="Security Features" value={motorData.securityFeatures.join(', ') || 'None declared'} />
        </div>
      </section>

      {/* Client summary */}
      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--motor-700)' }}>
          Policyholder Details
        </h3>
        <div className="rounded-2xl border border-[var(--border-default)] overflow-hidden px-4 py-1">
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

      {/* Premium card */}
      <motion.div
        className="rounded-2xl p-6 border"
        style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
        layout
      >
        <p className="font-sans font-medium text-[13px] mb-1" style={{ color: 'var(--text-muted)' }}>
          Estimated annual premium
        </p>
        <p className="font-display font-extrabold text-[42px] leading-none" style={{ color: 'var(--motor-600)' }}>
          {formatNaira(total)}
        </p>
        <div className="mt-4 pt-4 border-t border-[var(--motor-100)] flex flex-col gap-1.5">
          {Object.entries(breakdown).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{k}</span>
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{formatNaira(v)}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Underwriter selection */}
      <section>
        <h3 className="font-display font-bold text-base mb-3" style={{ color: 'var(--text-primary)' }}>
          Select Underwriter
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {UNDERWRITERS.map((uw) => {
            const selected = selectedUnderwriter === uw.id
            return (
              <button
                key={uw.id}
                type="button"
                onClick={() => setSelectedUnderwriter(uw.id)}
                className="relative border-[1.5px] rounded-2xl p-4 text-left transition-all"
                style={
                  selected
                    ? { borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-50)' }
                    : { borderColor: 'var(--border-default)', backgroundColor: 'white' }
                }
              >
                {uw.badge && (
                  <span
                    className="absolute top-3 right-3 font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--green-100)', color: 'var(--green-700)' }}
                  >
                    {uw.badge}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  {selected && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--motor-600)' }} />}
                  <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {uw.name}
                  </p>
                </div>
                <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
                  ★ {uw.rating} · NAICOM Licensed
                </p>
                <p className="font-display font-bold text-base mt-2" style={{ color: selected ? 'var(--motor-600)' : 'var(--text-primary)' }}>
                  {formatNaira(total)}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* Confirm */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 rounded"
          checked={motorData.reviewConfirmed}
          onChange={(e) => updateMotor({ reviewConfirmed: e.target.checked })}
        />
        <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          I confirm that all details above are accurate and I consent to NAICOM regulatory disclosures.
          I understand the selected premium is an estimate subject to final underwriter acceptance.
        </span>
      </label>
    </div>
  )
}
