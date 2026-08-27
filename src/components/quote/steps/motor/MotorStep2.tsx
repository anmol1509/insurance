'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import { VEHICLE_MAKES, VEHICLE_TYPES } from '@/lib/constants'
import { mergeOptions, useNsiaDropdowns } from '@/lib/nsia/useNsiaDropdowns'
import { Fuel, Car, Calendar, Briefcase } from 'lucide-react'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: currentYear - 1989 }, (_, i) => {
  const y = currentYear - i
  return { value: String(y), label: String(y) }
})

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG / LPG']
const typeOptions = VEHICLE_TYPES.map((v) => ({ value: v, label: v }))

function ChipGroup({
  label, options, selected, onSelect, icon: Icon,
}: {
  label: string; options: string[]; selected: string; onSelect: (v: string) => void; icon?: React.ElementType
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon className="w-4 h-4" style={{ color: 'var(--motor-600)' }} />}
        <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>{label}</p>
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

  // Prefer the brand names NSIA recognises so a submission is not rejected
  // over spelling; falls back to our own list when the API is unavailable.
  const { data: dropdowns } = useNsiaDropdowns<{ 'vehicle-brand': string[] }>(['vehicle-brand'])
  const makeOptions = mergeOptions(VEHICLE_MAKES, dropdowns['vehicle-brand'])
    .map((m) => ({ value: m, label: m }))

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
      </div>

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
