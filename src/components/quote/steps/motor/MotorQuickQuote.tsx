'use client'
import { useEffect, useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import { AnimatePresence, motion } from 'framer-motion'
import { Info, X } from 'lucide-react'
import { calculateMotorPremium } from '@/lib/premiumCalculator'
import { NIGERIAN_STATES, VEHICLE_TYPES } from '@/lib/constants'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1989 }, (_, i) => {
  const y = currentYear - i
  return { value: String(y), label: String(y) }
})

const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
const vehicleTypeOptions = VEHICLE_TYPES.map((v) => ({ value: v, label: v }))

const coverTypes = [
  {
    id: 'comprehensive' as const,
    label: 'Comprehensive',
    priceHint: 'From ₦65,000/yr',
    tooltip: 'Covers damage to your own vehicle (accident, fire, theft, flood) AND third-party liability. Best protection — recommended for vehicles under 10 years old.',
  },
  {
    id: 'tpo' as const,
    label: 'Third Party Only',
    priceHint: 'From ₦15,000/yr',
    tooltip: 'The legal minimum in Nigeria. Covers injury or damage you cause to others — does NOT cover any damage to your own vehicle. Mandatory under Nigerian law.',
  },
  {
    id: 'tpft' as const,
    label: 'Third Party Fire & Theft',
    priceHint: 'From ₦35,000/yr',
    tooltip: 'Third party cover PLUS protection if your own vehicle is stolen or damaged by fire. A middle-ground option for older vehicles.',
  },
]

const useTypes = [
  { id: 'private' as const, label: 'Private' },
  { id: 'commercial' as const, label: 'Commercial' },
  { id: 'own_goods' as const, label: 'Own Goods' },
  { id: 'hired' as const, label: 'Hired' },
]

export default function MotorQuickQuote() {
  const { motorData, updateMotor, setCalculatedPremium } = useQuoteStore()
  const [coverTooltip, setCoverTooltip] = useState<string | null>(null)

  useEffect(() => {
    const { total, breakdown } = calculateMotorPremium(motorData)
    setCalculatedPremium(total, breakdown)
  }, [motorData.coverType, motorData.marketValueRange, motorData.useType])

  return (
    <div className="space-y-7">
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border"
        style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
      >
        <span className="text-lg">⚡</span>
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Answer 6 quick questions and we'll show you personalised quotes from multiple NAICOM-licensed insurers in seconds.
        </p>
      </div>

      {/* Cover type */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          What type of cover do you need? <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {coverTypes.map((ct) => (
            <div key={ct.id} className="relative">
              <RadioCard
                label={ct.label}
                priceHint={ct.priceHint}
                selected={motorData.coverType === ct.id}
                onClick={() => updateMotor({ coverType: ct.id })}
                productColor="var(--motor-600)"
                productColorBg="var(--motor-50)"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCoverTooltip(coverTooltip === ct.id ? null : ct.id) }}
                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--motor-50)]"
                style={{ color: 'var(--text-muted)' }}
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {coverTooltip === ct.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full left-0 right-0 mt-2 z-20 bg-white rounded-xl border shadow-lg p-3"
                    style={{ borderColor: 'var(--motor-600)' }}
                  >
                    <button type="button" onClick={() => setCoverTooltip(null)} className="float-right ml-1 text-[var(--text-muted)]">
                      <X className="w-3 h-3" />
                    </button>
                    <p className="font-sans text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {ct.tooltip}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Market value */}
      <div>
        <label className="font-sans font-semibold text-xs text-[var(--text-secondary)] block mb-1.5">
          Current Market Value of Vehicle (₦) <span className="text-[var(--error)]">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans font-semibold text-[14px]" style={{ color: 'var(--text-muted)' }}>₦</span>
          <input
            type="text"
            inputMode="numeric"
            value={motorData.marketValueRange ? Number(motorData.marketValueRange.replace(/,/g, '')).toLocaleString('en-NG') : ''}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, '').replace(/\D/g, '')
              updateMotor({ marketValueRange: raw })
            }}
            placeholder="e.g. 4,500,000"
            className="w-full h-12 pl-8 pr-4 rounded-[var(--radius-md)] border-[1.5px] font-sans text-[14px] outline-none transition-all"
            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--motor-600)'; e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--motor-600) 12%, transparent)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>
        <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
          This is your vehicle's current resale value — it determines your Insured Declared Value (IDV).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Select
          label="Year of Manufacture"
          required
          options={years}
          value={motorData.yearOfManufacture ? String(motorData.yearOfManufacture) : undefined}
          onChange={(v) => updateMotor({ yearOfManufacture: Number(v) })}
          placeholder="Select year"
          productColor="var(--motor-600)"
        />
        <Select
          label="Vehicle Type"
          required
          options={vehicleTypeOptions}
          value={motorData.vehicleType}
          onChange={(v) => updateMotor({ vehicleType: v })}
          placeholder="Select vehicle type"
          productColor="var(--motor-600)"
        />
      </div>

      {/* Use type */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          How will the vehicle be used? <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {useTypes.map((ut) => (
            <RadioCard
              key={ut.id}
              label={ut.label}
              selected={motorData.useType === ut.id}
              onClick={() => updateMotor({ useType: ut.id })}
              productColor="var(--motor-600)"
              productColorBg="var(--motor-50)"
            />
          ))}
        </div>
      </div>

      <Select
        label="State of Registration / Use"
        required
        options={stateOptions}
        value={motorData.geographicalState}
        onChange={(v) => updateMotor({ geographicalState: v })}
        placeholder="Select state"
        productColor="var(--motor-600)"
      />
    </div>
  )
}
