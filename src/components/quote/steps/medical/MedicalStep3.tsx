'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import CheckboxCard from '@/components/ui/CheckboxCard'
import RadioCard from '@/components/ui/RadioCard'
import { AnimatePresence, motion } from 'framer-motion'
import { formatNaira } from '@/lib/formatters'
import { calculateMedicalPremium } from '@/lib/premiumCalculator'

const addons = [
  { id: 'personal_accident', label: 'Personal Accident Coverage', sub: 'Disability and accidental death', price: 15000 },
  { id: 'critical_illness', label: 'Critical Illness Coverage', sub: 'Cancer, stroke, heart attack', price: 30000 },
  { id: 'dental', label: 'Dental Coverage', sub: 'Check-ups, fillings, extractions', price: 8000 },
  { id: 'vision', label: 'Vision Coverage', sub: 'Eye tests, glasses, contact lenses', price: 6000 },
]

const planTiers = [
  { id: 'basic', label: 'Basic', priceHint: '₦45,000/yr' },
  { id: 'standard', label: 'Standard', priceHint: '₦120,000/yr' },
  { id: 'premium', label: 'Premium', priceHint: '₦280,000/yr' },
]

export default function MedicalStep3() {
  const { medicalData, updateMedical, setCalculatedPremium } = useQuoteStore()

  useEffect(() => {
    const { total, breakdown } = calculateMedicalPremium(medicalData)
    setCalculatedPremium(total, breakdown)
  }, [medicalData, setCalculatedPremium])

  const toggleAddon = (id: string) => {
    const current = medicalData.addons
    updateMedical({ addons: current.includes(id) ? current.filter((x) => x !== id) : [...current, id] })
  }

  const { total } = calculateMedicalPremium(medicalData)

  return (
    <div className="space-y-6">
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Plan Tier</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {planTiers.map((pt) => (
            <RadioCard key={pt.id} label={pt.label} priceHint={pt.priceHint} selected={medicalData.planTier === pt.id} onClick={() => updateMedical({ planTier: pt.id as typeof medicalData.planTier })} productColor="var(--medical-600)" productColorBg="var(--medical-50)" />
          ))}
        </div>
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Add-on Coverage</p>
        <div className="flex flex-col gap-3">
          {addons.map((addon) => (
            <div key={addon.id}>
              <CheckboxCard label={addon.label} subLabel={addon.sub} priceTag={`+${formatNaira(addon.price)}/yr`} checked={medicalData.addons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} productColor="var(--medical-600)" productColorBg="var(--medical-50)" />
              <AnimatePresence>
                {addon.id === 'critical_illness' && medicalData.addons.includes('critical_illness') && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden mt-2">
                    <div className="flex gap-3 p-4 rounded-r-xl" style={{ backgroundColor: '#FFFBEB', borderLeft: '4px solid var(--warning)' }}>
                      <span className="text-lg shrink-0">⚠️</span>
                      <div>
                        <p className="font-sans font-bold text-sm" style={{ color: '#92400E' }}>Manual underwriting required</p>
                        <p className="font-sans text-[13px] mt-1 leading-relaxed" style={{ color: '#92400E' }}>This triggers manual underwriting review. Our team will contact you within 1 business day.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {medicalData.planTier && (
        <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--medical-50)', borderColor: 'var(--medical-100)' }}>
          <p className="font-sans font-medium text-[13px] mb-1" style={{ color: 'var(--text-muted)' }}>Estimated annual premium</p>
          <p className="font-display font-bold text-[42px] leading-none" style={{ color: 'var(--medical-600)' }}>{formatNaira(total)}</p>
        </div>
      )}
    </div>
  )
}
