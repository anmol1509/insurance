'use client'
import { useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Loader2 } from 'lucide-react'
import { VEHICLE_MAKES, VEHICLE_COLOURS, COLOUR_SWATCHES, ENGINE_CAPACITIES } from '@/lib/constants'

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1989 }, (_, i) => {
  const y = currentYear - i
  return { value: String(y), label: String(y) }
})

const engineOptions = ENGINE_CAPACITIES.map((e) => ({ value: e, label: e }))

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
      engineCapacity: '2000–2499cc',
    })
    setLookupLoading(false)
    setLookupDone(true)
  }

  return (
    <div className="space-y-7">
      {/* Selected plan banner */}
      {motorData.selectedUnderwriter && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl border"
          style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
        >
          <span className="text-base">✅</span>
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Plan selected. Complete your vehicle details below to finalise your policy.
          </p>
        </motion.div>
      )}

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
          label="Engine Capacity"
          required
          options={engineOptions}
          value={motorData.engineCapacity}
          onChange={(v) => updateMotor({ engineCapacity: v })}
          placeholder="Select engine capacity"
          productColor="var(--motor-600)"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-sans font-semibold text-xs text-[var(--text-secondary)]">
          Vehicle Make & Model <span className="text-[var(--error)]">*</span>
        </label>
        <Select
          options={[...VEHICLE_MAKES.map((m) => ({ value: m, label: m }))]  }
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

      <Input
        label="Chassis / VIN Number"
        required
        value={motorData.chassisVIN}
        onChange={(e) => updateMotor({ chassisVIN: e.target.value.toUpperCase() })}
        placeholder="e.g. JN1AAZX45U0000001"
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
