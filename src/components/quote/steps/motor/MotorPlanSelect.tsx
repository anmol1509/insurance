'use client'
import { useQuoteStore } from '@/store/quoteStore'
import { motion } from 'framer-motion'
import { Star, Check, ArrowLeft } from 'lucide-react'
import { MOTOR_PLANS } from '@/lib/motorPlans'

function formatNGN(n: number) {
  return '₦' + n.toLocaleString('en-NG')
}

export default function MotorPlanSelect() {
  const { motorData, updateMotor, setCalculatedPremium } = useQuoteStore()
  const carValue = motorData.carValue ?? 0
  const coverType = motorData.coverType

  const filtered = MOTOR_PLANS.filter((p) => p.coverType === coverType)
  const basePrice = coverType === 'comprehensive' && carValue > 0
    ? Math.round(carValue * 0.05)
    : 15000

  function handleSelect(planId: string, multiplier: number) {
    updateMotor({ selectedUnderwriter: planId })
    setCalculatedPremium(Math.round(basePrice * multiplier), {})
  }

  if (!coverType) {
    return (
      <div className="text-center py-12 space-y-3">
        <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
          Please go back and select a cover type first.
        </p>
      </div>
    )
  }

  const coverLabel = coverType === 'comprehensive' ? 'Comprehensive' : 'Third Party Only'

  return (
    <div className="space-y-4">
      {/* Context banner */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl border mb-2"
        style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--motor-600)' }}>
          <Check className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--motor-700)' }}>
            {coverLabel} · {carValue > 0 ? formatNGN(carValue) + ' IDV' : 'Third Party'}
          </p>
          <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} NAICOM-licensed plans available — pick one to continue
          </p>
        </div>
      </div>

      {/* Plan cards */}
      {filtered.map((plan, i) => {
        const price = Math.round(basePrice * plan.multiplier)
        const selected = motorData.selectedUnderwriter === plan.id

        return (
          <motion.button
            key={plan.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => handleSelect(plan.id, plan.multiplier)}
            className="w-full rounded-2xl border-2 p-5 text-left transition-all"
            style={selected
              ? { borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-50)' }
              : { borderColor: 'var(--border-default)', backgroundColor: 'white' }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                {plan.logo && (
                  <div className="w-11 h-11 rounded-xl overflow-hidden border bg-white p-1 shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={plan.logo} alt={plan.insurer} className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-display font-bold text-[15px] truncate" style={{ color: 'var(--text-primary)' }}>{plan.name}</p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{plan.insurer}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-sans text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{plan.rating}</span>
                    <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>({plan.reviews.toLocaleString()})</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-display font-extrabold text-[22px] leading-none" style={{ color: selected ? 'var(--motor-600)' : 'var(--text-primary)' }}>
                  {formatNGN(price)}
                </p>
                <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>/yr</p>
              </div>
            </div>

            {/* Badge */}
            {plan.badge && (
              <div className="mt-2.5">
                <span
                  className="font-sans font-semibold text-[10px] px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: selected ? 'var(--motor-600)' : 'var(--surface-raised)',
                    color: selected ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Features grid */}
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {plan.features.slice(0, 4).map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: selected ? 'var(--motor-600)' : 'var(--surface-raised)' }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4 L3 5.5 L6.5 2" stroke={selected ? 'white' : 'var(--text-muted)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Footer stats */}
            <div
              className="mt-3 pt-3 border-t flex items-center justify-between"
              style={{ borderColor: selected ? 'var(--motor-200)' : 'var(--border-subtle)' }}
            >
              <div className="flex items-center gap-5">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Claim settlement</p>
                  <p className="font-sans font-bold text-[13px]" style={{ color: selected ? 'var(--motor-700)' : 'var(--text-primary)' }}>{plan.claimSettlement}</p>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>Response time</p>
                  <p className="font-sans font-bold text-[13px]" style={{ color: selected ? 'var(--motor-700)' : 'var(--text-primary)' }}>{plan.responseTime}</p>
                </div>
              </div>

              <div
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
                style={selected
                  ? { backgroundColor: 'var(--motor-600)' }
                  : { border: '2px solid var(--border-medium)', backgroundColor: 'transparent' }}
              >
                {selected && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
