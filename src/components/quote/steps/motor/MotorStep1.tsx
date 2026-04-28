'use client'
import { useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import { STATE_OPTIONS } from '@/data/nigerianStates'
import { VEHICLE_SUGGESTIONS } from '@/data/vehicleMakes'
import { AnimatePresence, motion } from 'framer-motion'

const years = Array.from({ length: 25 }, (_, i) => {
  const y = 2024 - i
  return { value: String(y), label: String(y) }
})

const coverTypes = [
  { id: 'comprehensive', label: 'Comprehensive', priceHint: 'From ₦65,000/yr' },
  { id: 'tpo', label: 'Third Party Only', priceHint: 'From ₦15,000/yr' },
  { id: 'tpft', label: 'Third Party Fire & Theft', priceHint: 'From ₦35,000/yr' },
]

const useTypes = [
  { id: 'private', label: 'Private' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'own_goods', label: 'Own Goods' },
  { id: 'hired', label: 'Hired' },
]

export default function MotorStep1() {
  const { motorData, updateMotor } = useQuoteStore()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleModelInput = (val: string) => {
    updateMotor({ vehicleModel: val })
    if (val.length > 1) {
      const matches = VEHICLE_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 6)
      setSuggestions(matches)
      setShowSuggestions(matches.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Owner's Full Name"
          required
          value={motorData.ownerName}
          onChange={(e) => updateMotor({ ownerName: e.target.value })}
          placeholder="e.g. Emeka Okafor"
        />
        <Input
          label="Vehicle Registration Number"
          required
          value={motorData.regNumber}
          onChange={(e) => updateMotor({ regNumber: e.target.value.toUpperCase() })}
          placeholder="e.g. LAG-123-AA"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="relative">
          <Input
            label="Vehicle Make & Model"
            required
            value={motorData.vehicleModel}
            onChange={(e) => handleModelInput(e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="e.g. Toyota Camry"
          />
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute top-full left-0 right-0 z-50 bg-white rounded-xl shadow-lg border border-[var(--border-default)] mt-1 overflow-hidden"
              >
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      updateMotor({ vehicleModel: s })
                      setShowSuggestions(false)
                    }}
                    className="w-full px-4 py-2.5 text-left font-sans text-sm hover:bg-[var(--surface-raised)] transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Select
          label="Year of Manufacture"
          required
          options={years}
          value={motorData.year ? String(motorData.year) : undefined}
          onChange={(v) => updateMotor({ year: Number(v) })}
          placeholder="Select year"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Vehicle Value / Market Value"
          required
          prefix="naira"
          type="number"
          value={motorData.vehicleValue ?? ''}
          onChange={(e) => updateMotor({ vehicleValue: Number(e.target.value) })}
          placeholder="e.g. 5000000"
          hint="Enter the current market value in Naira"
        />
        <Input
          label="Engine Capacity"
          suffix="cc"
          type="number"
          value={motorData.engineCapacity ?? ''}
          onChange={(e) => updateMotor({ engineCapacity: Number(e.target.value) })}
          placeholder="e.g. 1800"
        />
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Select your cover type <span style={{ color: 'var(--error)' }}>*</span>
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {coverTypes.map((ct) => (
            <RadioCard
              key={ct.id}
              label={ct.label}
              priceHint={ct.priceHint}
              selected={motorData.coverType === ct.id}
              onClick={() => updateMotor({ coverType: ct.id as typeof motorData.coverType })}
              productColor="var(--motor-600)"
              productColorBg="var(--motor-50)"
            />
          ))}
        </div>
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          How will the vehicle be used?
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {useTypes.map((ut) => (
            <RadioCard
              key={ut.id}
              label={ut.label}
              selected={motorData.useType === ut.id}
              onClick={() => updateMotor({ useType: ut.id as typeof motorData.useType })}
              productColor="var(--motor-600)"
              productColorBg="var(--motor-50)"
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Select
          label="State of Registration"
          required
          options={STATE_OPTIONS}
          value={motorData.state}
          onChange={(v) => updateMotor({ state: v })}
          placeholder="Select state"
        />
        <Input
          label="Vehicle Colour"
          value={motorData.color}
          onChange={(e) => updateMotor({ color: e.target.value })}
          placeholder="e.g. Silver"
        />
      </div>
    </div>
  )
}
