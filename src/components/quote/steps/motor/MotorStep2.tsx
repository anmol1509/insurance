'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { VEHICLE_MAKES, VEHICLE_TYPES, ENGINE_CAPACITIES, VEHICLE_COLOURS, COLOUR_SWATCHES } from '@/lib/constants'
import { Fuel, Car, Calendar, Briefcase, Gauge, Palette, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: currentYear - 1989 }, (_, i) => {
  const y = currentYear - i
  return { value: String(y), label: String(y) }
})

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG / LPG']
const makeOptions = VEHICLE_MAKES.map((m) => ({ value: m, label: m }))
const typeOptions = VEHICLE_TYPES.map((v) => ({ value: v, label: v }))

function ChipGroup({
  label, options, selected, onSelect, icon: Icon, required,
}: {
  label: string; options: string[]; selected: string; onSelect: (v: string) => void; icon?: React.ElementType; required?: boolean
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4" style={{ color: 'var(--motor-600)' }} />}
        <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          {label}{required && <span className="text-[var(--error)] ml-0.5">*</span>}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onSelect(opt)}
              className="px-4 py-2 rounded-full border-[1.5px] font-sans font-medium text-[13px] transition-all"
              style={active
                ? { backgroundColor: 'var(--motor-600)', borderColor: 'var(--motor-600)', color: 'white' }
                : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function MotorStep2() {
  const { motorData, updateMotor } = useQuoteStore()
  const isOldVehicle = motorData.yearOfManufacture && motorData.yearOfManufacture < 2000

  return (
    <div className="space-y-6">
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-2xl border"
        style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
      >
        <Car className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--motor-600)' }} />
        <p className="font-sans text-[13px]" style={{ color: 'var(--motor-700)' }}>
          Details were pre-filled from your registration. Check and edit anything that&apos;s incorrect before continuing.
        </p>
      </div>

      {/* Make + Model */}
      <div className="grid md:grid-cols-2 gap-5">
        <Select
          label="Car Brand (Make)"
          required
          options={makeOptions}
          value={motorData.vehicleMakeModel.split(' ')[0] || ''}
          onChange={(v) => {
            const rest = motorData.vehicleMakeModel.split(' ').slice(1).join(' ')
            updateMotor({ vehicleMakeModel: rest ? `${v} ${rest}` : v })
          }}
          placeholder="Select brand"
          productColor="var(--motor-600)"
        />
        <Input
          label="Model"
          required
          value={motorData.vehicleMakeModel.split(' ').slice(1).join(' ')}
          onChange={(e) => {
            const make = motorData.vehicleMakeModel.split(' ')[0] || ''
            updateMotor({ vehicleMakeModel: `${make} ${e.target.value}`.trim() })
          }}
          placeholder="e.g. Camry, CR-V, C300"
          productColor="var(--motor-600)"
        />
      </div>

      {/* Variant + Vehicle Type */}
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Variant / Trim"
          value={motorData.vehicleVariant}
          onChange={(e) => updateMotor({ vehicleVariant: e.target.value })}
          placeholder="e.g. XLE, Sport, AMG Line"
          hint="Optional trim or spec level"
          productColor="var(--motor-600)"
        />
        <Select
          label="Vehicle Type"
          required
          options={typeOptions}
          value={motorData.vehicleType}
          onChange={(v) => updateMotor({ vehicleType: v })}
          placeholder="Select type"
          productColor="var(--motor-600)"
        />
      </div>

      {/* Fuel type chips */}
      <ChipGroup
        label="Fuel Type"
        options={FUEL_TYPES}
        selected={motorData.fuelType}
        onSelect={(v) => updateMotor({ fuelType: v })}
        icon={Fuel}
      />

      {/* Engine Capacity */}
      <ChipGroup
        label="Engine Capacity"
        options={ENGINE_CAPACITIES}
        selected={motorData.engineCapacity}
        onSelect={(v) => updateMotor({ engineCapacity: v })}
        icon={Gauge}
      />

      {/* Vehicle Colour */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4" style={{ color: 'var(--motor-600)' }} />
          <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>Vehicle Colour</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {VEHICLE_COLOURS.map((colour) => {
            const active = motorData.vehicleColour === colour
            const hex = COLOUR_SWATCHES[colour]
            return (
              <button
                key={colour}
                type="button"
                onClick={() => updateMotor({ vehicleColour: colour })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] font-sans font-medium text-[12px] transition-all"
                style={active
                  ? { borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-50)', color: 'var(--motor-700)' }
                  : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border shrink-0"
                  style={{
                    backgroundColor: hex,
                    borderColor: colour === 'White' ? 'var(--border-medium)' : 'transparent',
                  }}
                />
                {colour}
              </button>
            )
          })}
        </div>
      </div>

      {/* Registration Year */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4" style={{ color: 'var(--motor-600)' }} />
          <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Year of Registration <span className="text-[var(--error)]">*</span>
          </p>
        </div>
        <Select
          options={yearOptions}
          value={motorData.yearOfManufacture ? String(motorData.yearOfManufacture) : undefined}
          onChange={(v) => updateMotor({ yearOfManufacture: Number(v) })}
          placeholder="Select year"
          productColor="var(--motor-600)"
        />
        <AnimatePresence>
          {isOldVehicle && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="flex items-start gap-2.5 mt-2.5 px-3 py-2.5 rounded-xl border"
              style={{ backgroundColor: '#FFF7ED', borderColor: '#FDBA74' }}
            >
              <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <p className="font-sans text-[12px] text-orange-700">
                Vehicles registered before 2000 may have limited plan options. Comprehensive cover is typically available for vehicles under 20 years old.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chassis / VIN */}
      <Input
        label="Chassis / VIN Number"
        value={motorData.chassisVIN}
        onChange={(e) => updateMotor({ chassisVIN: e.target.value.toUpperCase() })}
        placeholder="17-character VIN (optional)"
        hint="Optional — helps verify vehicle identity"
        productColor="var(--motor-600)"
      />

      {/* Commercial use */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Briefcase className="w-4 h-4" style={{ color: 'var(--motor-600)' }} />
          <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Is this vehicle used for commercial purposes? <span className="text-[var(--error)]">*</span>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'private', label: 'No — Personal use', sub: 'Family / commuting' },
            { value: 'commercial', label: 'Yes — Commercial use', sub: 'Hire, deliveries, business' },
          ].map(({ value, label, sub }) => {
            const active = motorData.useType === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => updateMotor({ useType: value as 'private' | 'commercial' })}
                className="p-4 rounded-2xl border-2 text-left transition-all"
                style={active
                  ? { borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-50)' }
                  : { borderColor: 'var(--border-default)', backgroundColor: 'white' }}
              >
                <p className="font-sans font-semibold text-[13px] mb-0.5" style={{ color: active ? 'var(--motor-700)' : 'var(--text-primary)' }}>{label}</p>
                <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{sub}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Previous policy expiry */}
      <Input
        label="Previous Policy Expiry Date"
        type="date"
        value={motorData.previousPolicyExpiry}
        onChange={(e) => updateMotor({ previousPolicyExpiry: e.target.value })}
        hint="Optional — helps us find better renewal rates"
        productColor="var(--motor-600)"
      />
    </div>
  )
}
