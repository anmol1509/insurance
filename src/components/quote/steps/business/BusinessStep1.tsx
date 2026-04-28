'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import { STATE_OPTIONS } from '@/data/nigerianStates'

const sizeOptions = [
  { id: 'small', label: 'Small', sub: '1–10 employees' },
  { id: 'medium', label: 'Medium', sub: '11–100 employees' },
  { id: 'large', label: 'Large', sub: '100+ employees' },
]

export default function BusinessStep1() {
  const { businessData, updateBusiness } = useQuoteStore()

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <Input label="Business Name" required value={businessData.businessName} onChange={(e) => updateBusiness({ businessName: e.target.value })} placeholder="e.g. Emeka Foods Ltd" />
        <Input label="Business Type" value={businessData.businessType} onChange={(e) => updateBusiness({ businessType: e.target.value })} placeholder="e.g. Retail, Restaurant, Office..." />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Input label="CAC Registration Number" value={businessData.cacNumber} onChange={(e) => updateBusiness({ cacNumber: e.target.value })} placeholder="Optional but recommended" hint="Optional but recommended for faster issuance" />
        <Input label="Annual Revenue" prefix="naira" type="number" value={businessData.annualRevenue ?? ''} onChange={(e) => updateBusiness({ annualRevenue: Number(e.target.value) })} placeholder="e.g. 5000000" />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <Input label="Number of Employees" type="number" value={businessData.numberOfEmployees ?? ''} onChange={(e) => updateBusiness({ numberOfEmployees: Number(e.target.value) })} placeholder="e.g. 12" />
        <Select label="State" required options={STATE_OPTIONS} value={businessData.state} onChange={(v) => updateBusiness({ state: v })} placeholder="Select state" />
      </div>
      <Input label="Business Address" required value={businessData.businessAddress} onChange={(e) => updateBusiness({ businessAddress: e.target.value })} placeholder="Full address of your business premises" />

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Business Size</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {sizeOptions.map((s) => (
            <RadioCard key={s.id} label={s.label} subLabel={s.sub} selected={businessData.businessSize === s.id} onClick={() => updateBusiness({ businessSize: s.id as typeof businessData.businessSize })} productColor="var(--business-600)" productColorBg="var(--business-50)" />
          ))}
        </div>
      </div>
    </div>
  )
}
