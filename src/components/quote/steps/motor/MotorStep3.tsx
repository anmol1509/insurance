'use client'
import { useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, Shield, AlertTriangle, Info } from 'lucide-react'

function formatNGN(n: number) {
  return '₦' + n.toLocaleString('en-NG')
}

const BASE_VALUES: Record<string, Record<number, number>> = {
  Toyota:        { 2024: 28000000, 2023: 25000000, 2022: 22000000, 2021: 19000000, 2020: 16500000, 2019: 14000000, 2018: 12000000, 2017: 10000000 },
  Honda:         { 2024: 24000000, 2023: 21000000, 2022: 18000000, 2021: 16000000, 2020: 14000000, 2019: 12000000, 2018: 10000000, 2017: 8500000 },
  'Mercedes-Benz': { 2024: 65000000, 2023: 58000000, 2022: 50000000, 2021: 43000000, 2020: 37000000, 2019: 32000000 },
  BMW:           { 2024: 60000000, 2023: 52000000, 2022: 45000000, 2021: 38000000, 2020: 33000000, 2019: 28000000 },
  Hyundai:       { 2024: 22000000, 2023: 19000000, 2022: 16500000, 2021: 14000000, 2020: 12000000, 2019: 10000000 },
  Lexus:         { 2024: 55000000, 2023: 48000000, 2022: 42000000, 2021: 36000000, 2020: 31000000, 2019: 26000000 },
}

function getAIEstimate(makeModel: string, year: number | null): number | null {
  if (!year) return null
  const make = makeModel.split(' ')[0]
  const makeData = BASE_VALUES[make]
  if (!makeData) {
    const fallback: Record<number, number> = { 2024: 18000000, 2023: 15000000, 2022: 13000000, 2021: 11000000, 2020: 9500000, 2019: 8000000, 2018: 7000000 }
    return fallback[year] ?? 6000000
  }
  return makeData[year] ?? Object.values(makeData).at(-1) ?? 6000000
}

export default function MotorStep3() {
  const { motorData, updateMotor, setCalculatedPremium } = useQuoteStore()
  const [aiLoading, setAiLoading] = useState(false)
  const [aiDone, setAiDone] = useState(false)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  const carValue = motorData.carValue ?? 0
  const compPremium = carValue > 0 ? Math.round(carValue * 0.05) : null
  const tpoBase = 75000

  async function handleAIEstimate() {
    setAiLoading(true)
    setAiDone(false)
    await new Promise((r) => setTimeout(r, 2000))
    const est = getAIEstimate(motorData.vehicleMakeModel, motorData.yearOfManufacture)
    if (est) {
      updateMotor({ carValue: est })
      if (motorData.coverType === 'comprehensive') {
        setCalculatedPremium(Math.round(est * 0.05), {})
      }
    }
    setAiLoading(false)
    setAiDone(true)
  }

  function handleValueChange(raw: string) {
    const num = parseInt(raw.replace(/,/g, '').replace(/\D/g, ''), 10)
    const val = isNaN(num) ? null : num
    updateMotor({ carValue: val })
    if (motorData.coverType === 'comprehensive' && val) {
      setCalculatedPremium(Math.round(val * 0.05), {})
    } else if (motorData.coverType === 'tpo') {
      setCalculatedPremium(tpoBase, {})
    }
    setAiDone(false)
  }

  function handlePlanSelect(type: 'comprehensive' | 'tpo') {
    updateMotor({ coverType: type })
    if (type === 'comprehensive' && carValue > 0) {
      setCalculatedPremium(Math.round(carValue * 0.05), {})
    } else if (type === 'tpo') {
      setCalculatedPremium(tpoBase, {})
    }
  }

  const plans = [
    {
      id: 'comprehensive' as const,
      label: 'Comprehensive',
      icon: Shield,
      color: 'var(--motor-600)',
      bg: 'var(--motor-50)',
      border: 'var(--motor-300)',
      recommended: true,
      pricePreview: compPremium ? `${formatNGN(compPremium)}/yr` : '5% of car value',
      priceNote: compPremium ? `(5% × ${formatNGN(carValue)})` : 'Enter car value to see price',
      desc: 'Covers damage to your own vehicle AND third-party liability. Full protection.',
      features: ['Own vehicle damage', 'Theft & fire', 'Flood cover', 'Third-party liability', 'Roadside assist'],
    },
    {
      id: 'tpo' as const,
      label: 'Third Party Only',
      icon: AlertTriangle,
      color: 'var(--text-secondary)',
      bg: 'var(--surface-raised)',
      border: 'var(--border-medium)',
      recommended: false,
      pricePreview: 'From ₦15,000/yr',
      priceNote: 'Legal minimum in Nigeria',
      desc: 'Covers injury or damage you cause to others only. Does NOT cover your own vehicle.',
      features: ['Third-party bodily injury', 'Third-party property damage', 'NIID registered', 'NAICOM compliant'],
    },
  ]

  return (
    <div className="space-y-7">
      {/* Car value input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Current Market Value (IDV) <span className="text-[var(--error)]">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowTooltip(showTooltip === 'idv' ? null : 'idv')}
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ color: 'var(--text-muted)' }}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {showTooltip === 'idv' && (
            <motion.div
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="mb-3 p-3 rounded-xl border font-sans text-[12px] leading-relaxed"
              style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)', color: 'var(--motor-700)' }}
            >
              The IDV (Insured Declared Value) is the maximum your insurer will pay if your car is stolen or totalled.
              It should be the current resale value — not the original purchase price.
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans font-bold text-[16px]" style={{ color: 'var(--text-muted)' }}>₦</span>
            <input
              type="text"
              inputMode="numeric"
              value={carValue > 0 ? carValue.toLocaleString('en-NG') : ''}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="e.g. 8,500,000"
              className="w-full h-14 pl-9 pr-4 rounded-2xl border-[1.5px] font-sans font-semibold text-[16px] outline-none transition-all"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--motor-600)'; e.currentTarget.style.boxShadow = '0 0 0 4px color-mix(in srgb, var(--motor-600) 12%, transparent)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
          <button
            type="button"
            onClick={handleAIEstimate}
            disabled={aiLoading}
            className="h-14 px-4 rounded-2xl border-[1.5px] font-sans font-semibold text-[13px] flex items-center gap-2 transition-all disabled:opacity-50 hover:border-[var(--motor-600)] hover:bg-[var(--motor-50)] shrink-0"
            style={{ borderColor: 'var(--border-medium)', color: aiLoading ? 'var(--text-muted)' : 'var(--motor-700)' }}
          >
            {aiLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Sparkles className="w-4 h-4" style={{ color: 'var(--motor-600)' }} />}
            {aiLoading ? 'Estimating…' : 'AI Estimate'}
          </button>
        </div>

        <AnimatePresence>
          {aiDone && carValue > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-2 px-3 py-2 rounded-xl font-sans text-[12px] flex items-center gap-2"
              style={{ backgroundColor: 'var(--motor-50)', color: 'var(--motor-700)' }}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              AI estimate based on {motorData.vehicleMakeModel} {motorData.yearOfManufacture}: <strong>{formatNGN(carValue)}</strong> — adjust if needed.
            </motion.div>
          )}
        </AnimatePresence>

        {!aiDone && (
          <p className="font-sans text-[12px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
            Not sure? Click <strong>AI Estimate</strong> and we&apos;ll calculate based on your car&apos;s make and year.
          </p>
        )}
      </div>

      {/* Plan type cards */}
      <div>
        <p className="font-sans font-semibold text-[14px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Choose your cover type <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const active = motorData.coverType === plan.id
            const Icon = plan.icon
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => handlePlanSelect(plan.id)}
                className="p-5 rounded-2xl border-2 text-left transition-all relative"
                style={active
                  ? { borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-50)' }
                  : { borderColor: 'var(--border-default)', backgroundColor: 'white' }}
              >
                {plan.recommended && (
                  <span
                    className="absolute top-3 right-3 font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--motor-600)', color: 'white' }}
                  >
                    Recommended
                  </span>
                )}

                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: active ? 'var(--motor-600)' : 'var(--surface-raised)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: active ? 'white' : 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <p className="font-display font-bold text-[16px]" style={{ color: active ? 'var(--motor-700)' : 'var(--text-primary)' }}>
                      {plan.label}
                    </p>
                  </div>
                </div>

                <div className="mb-3 pb-3 border-b" style={{ borderColor: active ? 'var(--motor-200)' : 'var(--border-subtle)' }}>
                  <p className="font-display font-extrabold text-[22px] leading-none" style={{ color: active ? 'var(--motor-600)' : 'var(--text-primary)' }}>
                    {plan.pricePreview}
                  </p>
                  <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {plan.priceNote}
                  </p>
                </div>

                <p className="font-sans text-[12px] mb-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {plan.desc}
                </p>

                <div className="space-y-1.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: active ? 'var(--motor-600)' : 'var(--surface-raised)' }}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4 L3 5.5 L6.5 2" stroke={active ? 'white' : 'var(--text-muted)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
