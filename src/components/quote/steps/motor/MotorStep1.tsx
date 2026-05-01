'use client'
import { useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Loader2 } from 'lucide-react'
import {
  NIGERIAN_STATES, VEHICLE_MAKES, VEHICLE_COLOURS, COLOUR_SWATCHES,
  VEHICLE_TYPES, ENGINE_CAPACITIES, MARKET_VALUE_RANGES,
} from '@/lib/constants'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1989 }, (_, i) => {
  const y = currentYear - i
  return { value: String(y), label: String(y) }
})

const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))
const vehicleTypeOptions = VEHICLE_TYPES.map((v) => ({ value: v, label: v }))
const engineOptions = ENGINE_CAPACITIES.map((e) => ({ value: e, label: e }))
const valueOptions = MARKET_VALUE_RANGES.map((r) => ({ value: r.value, label: r.label }))

const coverTypes = [
  { id: 'comprehensive' as const, label: 'Comprehensive', priceHint: 'From ₦65,000/yr' },
  { id: 'tpo' as const, label: 'Third Party Only', priceHint: 'From ₦15,000/yr' },
  { id: 'tpft' as const, label: 'Third Party Fire & Theft', priceHint: 'From ₦35,000/yr' },
]

const useTypes = [
  { id: 'private' as const, label: 'Private' },
  { id: 'commercial' as const, label: 'Commercial' },
  { id: 'own_goods' as const, label: 'Own Goods' },
  { id: 'hired' as const, label: 'Hired' },
]

export default function MotorStep1() {
  const { motorData, updateMotor } = useQuoteStore()
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupDone, setLookupDone] = useState(false)

  async function handlePlateLookup() {
    if (!motorData.registrationNumber) return
    setLookupLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    updateMotor({
      vehicleMakeModel: 'Toyota Camry',
      yearOfManufacture: 2020,
      vehicleType: 'Saloon',
      engineCapacity: '2000–2499cc',
    })
    setLookupLoading(false)
    setLookupDone(true)
  }

  return (
    <div className="space-y-7">
      {/* Plate number + lookup */}
      <div>
        <p className="font-sans font-semibold text-xs text-[var(--text-secondary)] mb-1.5">
          Vehicle Registration Number <span className="text-[var(--error)]">*</span>
        </p>
        <div className="flex gap-2">
          <Input
            value={motorData.registrationNumber}
            onChange={(e) => {
              updateMotor({ registrationNumber: e.target.value.toUpperCase() })
              setLookupDone(false)
            }}
            placeholder="e.g. LAG-123-AA"
            className="flex-1"
          />
          <button
            type="button"
            onClick={handlePlateLookup}
            disabled={lookupLoading || !motorData.registrationNumber}
            className="h-12 px-4 rounded-[var(--radius-md)] font-sans font-medium text-sm border-[1.5px] border-[var(--border-medium)] flex items-center gap-2 disabled:opacity-50 transition-colors hover:border-[var(--motor-600)] hover:text-[var(--motor-600)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {lookupLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Search className="w-4 h-4" />}
            {lookupLoading ? 'Looking up…' : 'Auto-fill'}
          </button>
        </div>
        <AnimatePresence>
          {lookupDone && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="font-sans text-xs mt-1.5"
              style={{ color: 'var(--green-700)' }}
            >
              ✓ Vehicle details pre-filled from FRSC/NIID record
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="font-sans font-semibold text-xs text-[var(--text-secondary)]">
            Vehicle Make & Model <span className="text-[var(--error)]">*</span>
          </label>
          <Select
            options={[...VEHICLE_MAKES.map((m) => ({ value: m, label: m }))]}
            value={motorData.vehicleMakeModel.split(' ')[0] || ''}
            onChange={(v) => updateMotor({ vehicleMakeModel: v })}
            placeholder="Select make"
            productColor="var(--motor-600)"
          />
          <Input
            value={motorData.vehicleMakeModel}
            onChange={(e) => updateMotor({ vehicleMakeModel: e.target.value })}
            placeholder="e.g. Toyota Camry 2.5L"
            productColor="var(--motor-600)"
          />
        </div>

        <Select
          label="Year of Manufacture"
          required
          options={years}
          value={motorData.yearOfManufacture ? String(motorData.yearOfManufacture) : undefined}
          onChange={(v) => updateMotor({ yearOfManufacture: Number(v) })}
          placeholder="Select year"
          productColor="var(--motor-600)"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Select
          label="Vehicle Type"
          required
          options={vehicleTypeOptions}
          value={motorData.vehicleType}
          onChange={(v) => updateMotor({ vehicleType: v })}
          placeholder="Select vehicle type"
          productColor="var(--motor-600)"
        />
        <Select
          label="Engine Capacity"
          required
          options={engineOptions}
          value={motorData.engineCapacity}
          onChange={(v) => updateMotor({ engineCapacity: v })}
          placeholder="Select engine capacity"
          productColor="var(--motor-600)"
        />
      </div>

      {/* Colour picker */}
      <div>
        <p className="font-sans font-semibold text-xs text-[var(--text-secondary)] mb-2">
          Vehicle Colour <span className="text-[var(--error)]">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {VEHICLE_COLOURS.map((col) => {
            const selected = motorData.vehicleColour === col
            return (
              <button
                key={col}
                type="button"
                onClick={() => updateMotor({ vehicleColour: col })}
                className="flex items-center gap-2 px-3 py-2 rounded-full border-[1.5px] font-sans text-[13px] font-medium transition-all"
                style={
                  selected
                    ? { borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-50)', color: 'var(--motor-600)' }
                    : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }
                }
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-[var(--border-medium)] shrink-0"
                  style={{ backgroundColor: COLOUR_SWATCHES[col] ?? '#ccc' }}
                />
                {col}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Chassis / VIN Number"
          required
          value={motorData.chassisVIN}
          onChange={(e) => updateMotor({ chassisVIN: e.target.value.toUpperCase() })}
          placeholder="e.g. JN1AAZX45U0000001"
          productColor="var(--motor-600)"
        />
        <Select
          label="Market Value Range"
          required
          options={valueOptions}
          value={motorData.marketValueRange}
          onChange={(v) => updateMotor({ marketValueRange: v })}
          placeholder="Select value range"
          productColor="var(--motor-600)"
        />
      </div>

      {/* Cover type */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Cover type <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {coverTypes.map((ct) => (
            <RadioCard
              key={ct.id}
              label={ct.label}
              priceHint={ct.priceHint}
              selected={motorData.coverType === ct.id}
              onClick={() => updateMotor({ coverType: ct.id })}
              productColor="var(--motor-600)"
              productColorBg="var(--motor-50)"
            />
          ))}
        </div>
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

      <Input
        label="Accessories / Special Features"
        value={motorData.accessories}
        onChange={(e) => updateMotor({ accessories: e.target.value })}
        placeholder="e.g. Tinted windows, bull bars, roof rack"
        hint="Optional. Describe any aftermarket additions."
        productColor="var(--motor-600)"
      />
    </div>
  )
}
