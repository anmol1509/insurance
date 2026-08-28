'use client'
import { useEffect, useRef, useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import RadioCard from '@/components/ui/RadioCard'
import { mergeOptions, useNsiaDropdowns } from '@/lib/nsia/useNsiaDropdowns'
import { calculateNsiaMarinePremium } from '@/lib/nsia/browser'
import { calculateMarineFallbackPremium } from '@/lib/premiumCalculator'
import { MARINE_COVER_TYPES } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { Anchor, Loader2 } from 'lucide-react'

function formatNGN(n: number) {
  return '₦' + n.toLocaleString('en-NG')
}

interface PricingResult {
  key: string
  premium: number | null
  isLiveRate: boolean
}

export default function MarineStep2() {
  const { marineData, updateMarine, setCalculatedPremium } = useQuoteStore()
  // Keyed by the inputs it was computed from, so a stale response never
  // overwrites the state for a newer selection, and "loading" can be derived
  // as "valid inputs with no matching result yet" instead of tracked
  // separately (which would mean setting state synchronously in the effect).
  const [result, setResult] = useState<PricingResult | null>(null)
  const requestId = useRef(0)

  const { data: dropdowns } = useNsiaDropdowns<{ 'marine-cover-type': string[] }>(['marine-cover-type'])
  const coverTypes = mergeOptions(MARINE_COVER_TYPES, dropdowns['marine-cover-type'])

  const { coverType, sumInsured, cargoCategory, currency } = marineData
  const inputsKey = `${coverType}|${sumInsured}|${cargoCategory}|${currency}`
  const hasInputs = Boolean(coverType && sumInsured && cargoCategory)

  // NSIA's own calculator (guide §8.2) is the source of truth; only fall back
  // to a local estimate when it is unavailable, so the flow never stalls.
  useEffect(() => {
    if (!hasInputs) return

    const thisRequest = ++requestId.current

    const timer = setTimeout(() => {
      calculateNsiaMarinePremium({ category: cargoCategory, sumInsured: sumInsured!, coverType, currency })
        .then((pricing) => {
          if (requestId.current !== thisRequest) return
          setResult({ key: inputsKey, premium: pricing.premium, isLiveRate: true })
          setCalculatedPremium(pricing.premium, { 'NSIA marine premium': pricing.premium })
        })
        .catch(() => {
          if (requestId.current !== thisRequest) return
          const { total, breakdown } = calculateMarineFallbackPremium(marineData)
          setResult({ key: inputsKey, premium: total || null, isLiveRate: false })
          if (total) setCalculatedPremium(total, breakdown)
        })
    }, 400)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputsKey, hasInputs])

  const loading = hasInputs && result?.key !== inputsKey
  const premium = result?.key === inputsKey ? result.premium : null
  const isLiveRate = result?.key === inputsKey && result.isLiveRate

  return (
    <div className="space-y-7">
      <div>
        <p className="font-sans font-semibold text-[14px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Choose your cover type <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {coverTypes.map((type) => (
            <RadioCard
              key={type}
              label={type}
              selected={coverType === type}
              onClick={() => updateMarine({ coverType: type })}
              productColor="var(--marine-600)"
              productColorBg="var(--marine-50)"
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {(loading || premium != null) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-2xl border p-4 flex items-center justify-between gap-4"
            style={{ backgroundColor: 'var(--marine-50)', borderColor: 'var(--marine-100)' }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--marine-600)' }}>
                <Anchor className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--marine-700)' }}>
                  {loading ? 'Calculating your premium…' : isLiveRate ? 'Live premium from NSIA Insurance' : 'Estimated premium'}
                </p>
                <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  {isLiveRate ? 'Calculated by NSIA for this shipment' : 'NSIA rate unavailable — showing an estimate'}
                </p>
              </div>
            </div>
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin shrink-0" style={{ color: 'var(--marine-600)' }} />
            ) : premium != null && (
              <p className="font-display font-extrabold text-[22px] leading-none shrink-0" style={{ color: 'var(--marine-600)' }}>
                {formatNGN(premium)}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!coverType && (
        <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
          Select a cover type to see your premium.
        </p>
      )}
    </div>
  )
}
