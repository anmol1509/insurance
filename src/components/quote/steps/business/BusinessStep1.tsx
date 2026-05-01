'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import { NIGERIAN_STATES } from '@/lib/constants'

const stateOptions = NIGERIAN_STATES.map((s) => ({ value: s, label: s }))

const businessTypes = [
  'Retail / Trading', 'Manufacturing', 'Food & Hospitality', 'Professional Services',
  'Construction', 'Technology', 'Healthcare', 'Education', 'Logistics / Transport', 'Other',
]

const businessSizes = [
  { id: 'small' as const,  label: 'Small',  sub: '1–50 employees' },
  { id: 'medium' as const, label: 'Medium', sub: '51–250 employees' },
  { id: 'large' as const,  label: 'Large',  sub: '250+ employees' },
]

const revenueRanges = [
  { value: 'under_10m',   label: 'Under ₦10M/year' },
  { value: '10m_50m',     label: '₦10M – ₦50M/year' },
  { value: '50m_250m',    label: '₦50M – ₦250M/year' },
  { value: '250m_1b',     label: '₦250M – ₦1B/year' },
  { value: 'above_1b',    label: 'Above ₦1B/year' },
]

export default function BusinessStep1() {
  const { businessData, updateBusiness } = useQuoteStore()

  return (
    <div className="space-y-7">
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Business Name"
          required
          value={businessData.businessName}
          onChange={(e) => updateBusiness({ businessName: e.target.value })}
          placeholder="Registered business name"
          productColor="var(--business-600)"
        />
        <Input
          label="CAC / RC Number"
          required
          value={businessData.cacNumber}
          onChange={(e) => updateBusiness({ cacNumber: e.target.value })}
          placeholder="e.g. RC123456"
          productColor="var(--business-600)"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Select
          label="Business Type"
          required
          options={businessTypes.map((t) => ({ value: t, label: t }))}
          value={businessData.businessType}
          onChange={(v) => updateBusiness({ businessType: v })}
          placeholder="Select business type"
          productColor="var(--business-600)"
        />
        <Select
          label="Annual Revenue"
          required
          options={revenueRanges}
          value={businessData.annualRevenue}
          onChange={(v) => updateBusiness({ annualRevenue: v })}
          placeholder="Select revenue range"
          productColor="var(--business-600)"
        />
      </div>

      <Input
        label="Number of Employees"
        required
        type="number"
        value={businessData.numberOfEmployees ?? ''}
        onChange={(e) => updateBusiness({ numberOfEmployees: Number(e.target.value) })}
        placeholder="e.g. 25"
        productColor="var(--business-600)"
      />

      <Input
        label="Business Address"
        required
        value={businessData.businessAddress}
        onChange={(e) => updateBusiness({ businessAddress: e.target.value })}
        placeholder="Full business address"
        productColor="var(--business-600)"
      />

      <Select
        label="State"
        required
        options={stateOptions}
        value={businessData.state}
        onChange={(v) => updateBusiness({ state: v })}
        placeholder="Select state"
        productColor="var(--business-600)"
      />

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Business size <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {businessSizes.map((s) => (
            <RadioCard
              key={s.id}
              label={s.label}
              priceHint={s.sub}
              selected={businessData.businessSize === s.id}
              onClick={() => updateBusiness({ businessSize: s.id })}
              productColor="var(--business-600)"
              productColorBg="var(--business-50)"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
