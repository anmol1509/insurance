'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RadioCard from '@/components/ui/RadioCard'
import { calculatePersonalAccidentPremium } from '@/lib/premiumCalculator'
import { formatNaira } from '@/lib/formatters'
import { GENDERS, OCCUPATIONS } from '@/lib/constants'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'
import { useEffect } from 'react'

const occupationOptions = OCCUPATIONS.map((o) => ({ value: o, label: o }))

const SUM_INSURED_TIERS = [
  { value: 1000000, label: '₦1,000,000' },
  { value: 2000000, label: '₦2,000,000' },
  { value: 5000000, label: '₦5,000,000' },
  { value: 10000000, label: '₦10,000,000' },
]

export default function PersonalAccidentStep1() {
  const { personalAccidentData, updatePersonalAccident, setCalculatedPremium } = useQuoteStore()

  const { total, breakdown } = calculatePersonalAccidentPremium(personalAccidentData)

  useEffect(() => {
    if (total > 0) setCalculatedPremium(total, breakdown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  return (
    <div className="space-y-7">
      <div
        className="flex items-start gap-3 px-4 py-3 rounded-2xl border"
        style={{ backgroundColor: 'var(--pa-50)', borderColor: 'var(--pa-100)' }}
      >
        <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--pa-600)' }} />
        <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
          Personal accident cover pays out for accidental death, disability, or injury — at work, at home, or anywhere in between.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Date of Birth"
          required
          type="date"
          value={personalAccidentData.dateOfBirth}
          onChange={(e) => updatePersonalAccident({ dateOfBirth: e.target.value })}
          hint="Must be 18 or older"
          productColor="var(--pa-600)"
        />
        <Select
          label="Occupation"
          required
          options={occupationOptions}
          value={personalAccidentData.occupation}
          onChange={(v) => updatePersonalAccident({ occupation: v })}
          placeholder="Select occupation"
          productColor="var(--pa-600)"
        />
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Gender <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid grid-cols-3 gap-3">
          {GENDERS.map((g) => (
            <RadioCard
              key={g}
              label={g}
              selected={personalAccidentData.gender === g}
              onClick={() => updatePersonalAccident({ gender: g })}
              productColor="var(--pa-600)"
              productColorBg="var(--pa-50)"
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Height (cm)"
          type="number"
          value={personalAccidentData.height ?? ''}
          onChange={(e) => updatePersonalAccident({ height: e.target.value ? Number(e.target.value) : null })}
          placeholder="e.g. 175"
          productColor="var(--pa-600)"
        />
        <Input
          label="Weight (kg)"
          type="number"
          value={personalAccidentData.weight ?? ''}
          onChange={(e) => updatePersonalAccident({ weight: e.target.value ? Number(e.target.value) : null })}
          placeholder="e.g. 75"
          productColor="var(--pa-600)"
        />
      </div>

      <div>
        <p className="font-sans font-semibold text-[14px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Coverage amount <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          {SUM_INSURED_TIERS.map((tier) => (
            <RadioCard
              key={tier.value}
              label={tier.label}
              selected={personalAccidentData.sumInsured === tier.value}
              onClick={() => updatePersonalAccident({ sumInsured: tier.value })}
              productColor="var(--pa-600)"
              productColorBg="var(--pa-50)"
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="rounded-2xl border p-4 flex items-center justify-between gap-4"
            style={{ backgroundColor: 'var(--pa-50)', borderColor: 'var(--pa-100)' }}
          >
            <div className="min-w-0">
              <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--pa-700)' }}>Estimated annual premium</p>
              <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>Based on your coverage amount and occupation</p>
            </div>
            <p className="font-display font-extrabold text-[22px] leading-none shrink-0" style={{ color: 'var(--pa-600)' }}>
              {formatNaira(total)}<span className="font-sans font-medium text-[12px]" style={{ color: 'var(--text-muted)' }}>/yr</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
