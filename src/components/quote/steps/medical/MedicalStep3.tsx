'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import RadioCard from '@/components/ui/RadioCard'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import Select from '@/components/ui/Select'
import { calculateMedicalPremium } from '@/lib/premiumCalculator'
import { formatNaira } from '@/lib/formatters'
import { NIGERIAN_STATES } from '@/lib/constants'
import { motion } from 'framer-motion'

const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))

const benefits = [
  { id: 'death',         label: 'Death Benefit',            sub: 'Lump-sum payment to beneficiaries' },
  { id: 'ttd',           label: 'Temporary Disability',     sub: 'Income replacement during recovery' },
  { id: 'ptd',           label: 'Permanent Disability',     sub: 'Full lump-sum on permanent disability' },
  { id: 'medical_costs', label: 'Medical Expenses',         sub: 'Hospital bills and treatment costs' },
]

const planTiers = [
  { id: 'basic' as const,    label: 'Basic',    priceHint: '₦45,000/yr · Essential cover' },
  { id: 'standard' as const, label: 'Standard', priceHint: '₦120,000/yr · Recommended' },
  { id: 'premium' as const,  label: 'Premium',  priceHint: '₦280,000/yr · Comprehensive' },
]

export default function MedicalStep3() {
  const { medicalData, updateMedical, setCalculatedPremium } = useQuoteStore()

  function toggleBenefit(id: string) {
    const curr = medicalData.benefits
    updateMedical({ benefits: curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id] })
  }

  useEffect(() => {
    const { total, breakdown } = calculateMedicalPremium(medicalData)
    setCalculatedPremium(total, breakdown)
  }, [medicalData, setCalculatedPremium])

  const { total } = calculateMedicalPremium(medicalData)

  return (
    <div className="space-y-7">
      {/* Benefits */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Select benefits required <span className="text-[var(--error)]">*</span>
        </p>
        <div className="flex flex-col gap-3">
          {benefits.map((b) => {
            const sel = medicalData.benefits.includes(b.id)
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => toggleBenefit(b.id)}
                className="flex items-center gap-4 p-4 rounded-2xl border-[1.5px] text-left transition-all"
                style={
                  sel
                    ? { borderColor: 'var(--medical-600)', backgroundColor: 'var(--medical-50)' }
                    : { borderColor: 'var(--border-default)', backgroundColor: 'white' }
                }
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0 border-[1.5px] transition-colors"
                  style={
                    sel
                      ? { borderColor: 'var(--medical-600)', backgroundColor: 'var(--medical-600)' }
                      : { borderColor: 'var(--border-medium)' }
                  }
                >
                  {sel && <span className="text-white text-[10px] font-bold">✓</span>}
                </div>
                <div>
                  <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{b.label}</p>
                  <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{b.sub}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Riders */}
      <div className="space-y-3">
        <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Optional riders
        </p>
        {[
          { key: 'criticalIllness', label: 'Critical Illness Rider', sub: '+₦30,000/yr', field: 'criticalIllness' as const },
          { key: 'dentalCover', label: 'Dental Cover', sub: '+₦8,000/yr', field: 'dentalCover' as const },
          { key: 'visionCover', label: 'Vision / Optical Cover', sub: '+₦6,000/yr', field: 'visionCover' as const },
          { key: 'personalAccidentRider', label: 'Personal Accident Rider', sub: '+₦15,000/yr', field: 'personalAccidentRider' as const },
        ].map(({ key, label, sub, field }) => (
          <div
            key={key}
            className="flex justify-between items-center px-5 py-4 rounded-2xl border"
            style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
          >
            <div>
              <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{label}</p>
              <p className="font-sans text-[13px]" style={{ color: 'var(--medical-600)' }}>{sub}</p>
            </div>
            <ToggleSwitch
              checked={medicalData[field]}
              onChange={(v) => updateMedical({ [field]: v })}
              productColor="var(--medical-600)"
            />
          </div>
        ))}
      </div>

      {/* Plan tier */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Plan tier <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {planTiers.map((t) => (
            <RadioCard
              key={t.id}
              label={t.label}
              priceHint={t.priceHint}
              selected={medicalData.planTier === t.id}
              onClick={() => updateMedical({ planTier: t.id })}
              productColor="var(--medical-600)"
              productColorBg="var(--medical-50)"
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Select
          label="Geographical Coverage"
          options={[
            { value: 'nigeria', label: 'Nigeria only' },
            { value: 'africa', label: 'Africa' },
            { value: 'worldwide', label: 'Worldwide' },
          ]}
          value={medicalData.geoCoverage}
          onChange={(v) => updateMedical({ geoCoverage: v })}
          productColor="var(--medical-600)"
        />
        <Select
          label="Preferred Hospital State"
          options={stateOptions}
          value={medicalData.preferredHospitalState}
          onChange={(v) => updateMedical({ preferredHospitalState: v })}
          placeholder="Any state"
          productColor="var(--medical-600)"
        />
      </div>

      {/* Live premium */}
      {medicalData.planTier && (
        <motion.div
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: 'var(--medical-50)', borderColor: 'var(--medical-100)' }}
          layout
        >
          <p className="font-sans font-medium text-[13px] mb-1" style={{ color: 'var(--text-muted)' }}>
            Estimated annual premium
          </p>
          <motion.p
            key={total}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            className="font-display font-extrabold text-[40px] leading-none"
            style={{ color: 'var(--medical-600)' }}
          >
            {formatNaira(total)}
          </motion.p>
          {medicalData.numberOfLives > 1 && (
            <p className="font-sans text-[13px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Across {medicalData.numberOfLives} lives
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}
