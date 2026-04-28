'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import CheckboxCard from '@/components/ui/CheckboxCard'
import { formatNaira } from '@/lib/formatters'
import { calculateBusinessPremium } from '@/lib/premiumCalculator'

const coverageOptions = [
  { id: 'fire_perils', label: 'Fire & Special Perils', sub: 'Fire, lightning, explosion, allied perils', price: 50000 },
  { id: 'burglary', label: 'Burglary & Theft', sub: 'Forcible entry/exit, employee theft', price: 35000 },
  { id: 'liability', label: 'Third Party Liability', sub: 'Legal liability to third parties', price: 45000 },
  { id: 'gpa', label: 'Group Personal Accident', sub: 'Death and disability per employee', price: 8000 },
  { id: 'health', label: 'Employee Health Cover', sub: 'Basic HMO plan for your team', price: 12000 },
]

export default function BusinessStep2() {
  const { businessData, updateBusiness, setCalculatedPremium } = useQuoteStore()

  useEffect(() => {
    const { total, breakdown } = calculateBusinessPremium(businessData)
    setCalculatedPremium(total, breakdown)
  }, [businessData, setCalculatedPremium])

  const toggle = (id: string) => {
    const current = businessData.coverageItems
    updateBusiness({ coverageItems: current.includes(id) ? current.filter((x) => x !== id) : [...current, id] })
  }

  const { total } = calculateBusinessPremium(businessData)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        {coverageOptions.map((opt) => (
          <CheckboxCard key={opt.id} label={opt.label} subLabel={opt.sub} priceTag={`+${formatNaira(opt.price)}/yr`} checked={businessData.coverageItems.includes(opt.id)} onChange={() => toggle(opt.id)} productColor="var(--business-600)" productColorBg="var(--business-50)" />
        ))}
      </div>

      {businessData.coverageItems.length > 0 && (
        <div className="rounded-2xl px-6 py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ backgroundColor: 'var(--business-600)' }}>
          <div>
            <p className="font-sans font-medium text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Estimated annual premium:</p>
            <p className="font-display font-bold text-[28px] text-white">{formatNaira(total)}</p>
          </div>
          <span className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Select cover to proceed →</span>
        </div>
      )}
    </div>
  )
}
