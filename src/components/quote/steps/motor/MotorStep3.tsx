'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import CheckboxCard from '@/components/ui/CheckboxCard'
import { formatNaira } from '@/lib/formatters'
import { calculateMotorPremium } from '@/lib/premiumCalculator'
import { motion } from 'framer-motion'

const addons = [
  { id: 'roadside', label: 'Roadside Assistance', sub: '24/7 towing, battery jump-start, flat tyre', price: 5000 },
  { id: 'excess_waiver', label: 'Excess Waiver', sub: 'No excess payment on your first claim', price: 8000 },
  { id: 'courtesy_car', label: 'Courtesy Car', sub: 'Loan car provided while yours is repaired', price: 6000 },
  { id: 'personal_accident', label: 'Personal Accident (driver)', sub: 'Death and disability benefit for the main driver', price: 4000 },
  { id: 'flood_extension', label: 'Flood Extension', sub: 'Enhanced flood cover for high-risk areas', price: 7500 },
]

export default function MotorStep3() {
  const { motorData, updateMotor, setCalculatedPremium } = useQuoteStore()

  useEffect(() => {
    const { total, breakdown } = calculateMotorPremium(motorData)
    setCalculatedPremium(total, breakdown)
  }, [motorData, setCalculatedPremium])

  const toggleAddon = (id: string) => {
    const current = motorData.addons
    updateMotor({
      addons: current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    })
  }

  const { total, breakdown } = calculateMotorPremium(motorData)

  return (
    <div className="space-y-6">
      <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
        Optional add-ons. Select all that apply.
      </p>

      <div className="flex flex-col gap-3">
        {addons.map((addon) => (
          <CheckboxCard
            key={addon.id}
            label={addon.label}
            subLabel={addon.sub}
            priceTag={`+${formatNaira(addon.price)}/yr`}
            checked={motorData.addons.includes(addon.id)}
            onChange={() => toggleAddon(addon.id)}
            productColor="var(--motor-600)"
            productColorBg="var(--motor-50)"
          />
        ))}
      </div>

      {/* Live premium card */}
      {motorData.vehicleValue && motorData.coverType && (
        <motion.div
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
          layout
        >
          <p className="font-sans font-medium text-[13px] mb-1" style={{ color: 'var(--text-muted)' }}>
            Estimated annual premium
          </p>
          <motion.p
            key={total}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            className="font-display font-bold text-[42px] leading-none"
            style={{ color: 'var(--motor-600)' }}
          >
            {formatNaira(total)}
          </motion.p>

          <div className="mt-4 pt-4 border-t border-[var(--motor-100)] flex flex-col gap-1.5">
            {Object.entries(breakdown).map(([key, val]) => (
              <div key={key} className="flex justify-between">
                <span className="font-sans text-[13px] capitalize" style={{ color: 'var(--text-muted)' }}>{key}</span>
                <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{formatNaira(val)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-[var(--motor-100)] mt-1">
              <span className="font-sans font-bold text-[13px]" style={{ color: 'var(--motor-600)' }}>Total</span>
              <span className="font-sans font-bold text-[13px]" style={{ color: 'var(--motor-600)' }}>{formatNaira(total)}</span>
            </div>
          </div>
          <p className="font-sans text-[11px] mt-3" style={{ color: 'var(--text-subtle)' }}>
            Final price confirmed at checkout
          </p>
        </motion.div>
      )}
    </div>
  )
}
