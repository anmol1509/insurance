'use client'
import { useState, useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { motion } from 'framer-motion'
import { Star, Check, X, ChevronDown, ChevronUp } from 'lucide-react'
import { MOTOR_PLANS } from '@/lib/motorPlans'
import type { MotorPlan } from '@/lib/motorPlans'

function formatNGN(n: number) {
  return '₦' + n.toLocaleString('en-NG')
}

const COVER_LABELS: Record<string, string> = {
  comprehensive: 'Comprehensive',
  tpo: 'Third Party Only',
}

const FEATURE_OPTIONS = ['Roadside Assist', 'Towing', 'NIID Registered', 'Windscreen Cover']

// keyword each filter chip matches against (substring of feature strings)
const FEATURE_KEYWORDS: Record<string, string> = {
  'Roadside Assist': 'roadside',
  'Towing': 'towing',
  'NIID Registered': 'niid',
  'Windscreen Cover': 'windscreen',
}

type SortKey = 'popular' | 'price' | 'rating'

export default function MotorPlanSelect() {
  const { motorData, updateMotor, setCalculatedPremium, setStep } = useQuoteStore()
  const carValue = motorData.carValue ?? 0
  const coverType = motorData.coverType

  const [sortBy, setSortBy] = useState<SortKey>('popular')
  const [featureFilters, setFeatureFilters] = useState<string[]>([])
  const [fortisCatalogPrices, setFortisCatalogPrices] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/api/fortis/catalog')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.success) return
        const products: any[] = data.catalog?.data?.products ?? data.catalog?.products ?? data.catalog?.data ?? []
        const prices: Record<string, number> = {}
        products.forEach((p: any) => {
          const covers: any[] = p.covers ?? []
          const raw = covers[0]?.price ?? covers[0]?.premium ?? covers[0]?.amount
          const num = raw != null ? Number(raw) : NaN
          if (isNaN(num) || num <= 0) return
          if (/comprehensive/i.test(p.name ?? '')) prices['fortis-comp'] = num
          else if (/third.?party|tpo/i.test(p.name ?? '')) prices['fortis-tpo'] = num
        })
        setFortisCatalogPrices(prices)
      })
      .catch(() => {})
  }, [])

  function toggleFeature(f: string) {
    setFeatureFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const filtered = MOTOR_PLANS.filter((p) => p.coverType === coverType)
  const basePrice = coverType === 'comprehensive' && carValue > 0
    ? Math.round(carValue * 0.05)
    : 20000

  function getPrice(plan: MotorPlan): number {
    if (plan.fortisGlobal && fortisCatalogPrices[plan.id] != null) {
      return fortisCatalogPrices[plan.id]
    }
    const raw = Math.round(basePrice * plan.multiplier)
    return Math.max(raw, basePrice)
  }

  const displayPlans = filtered
    .filter(p => featureFilters.length === 0 || featureFilters.every(f => {
      const keyword = FEATURE_KEYWORDS[f] ?? f.toLowerCase()
      return p.features.some(pf => pf.toLowerCase().includes(keyword))
    }))
    .sort((a, b) => {
      if (sortBy === 'price') return getPrice(a) - getPrice(b)
      if (sortBy === 'rating') return b.rating - a.rating
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
    })

  function handleSelect(plan: MotorPlan) {
    updateMotor({ selectedUnderwriter: plan.id })
    setCalculatedPremium(getPrice(plan), {})
    setTimeout(() => {
      setStep('motor', 5)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 350)
  }

  if (!coverType) {
    return (
      <div className="text-center py-12">
        <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
          Please go back and select a cover type first.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Sort + feature filter bar */}
      <div
        className="rounded-2xl border px-4 py-3 mb-2 flex items-center gap-2 flex-wrap"
        style={{ backgroundColor: 'var(--motor-50)', borderColor: 'var(--motor-100)' }}
      >
        <span className="font-sans font-semibold text-[11px] uppercase tracking-wider shrink-0" style={{ color: 'var(--text-muted)' }}>Sort</span>
        {([['popular', 'Popular'], ['price', 'Lowest Price'], ['rating', 'Best Rating']] as [SortKey, string][]).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setSortBy(key)}
            className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border shrink-0"
            style={sortBy === key
              ? { backgroundColor: 'var(--motor-600)', borderColor: 'var(--motor-600)', color: 'white' }
              : { backgroundColor: 'transparent', borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
          >{label}</button>
        ))}
        <div className="h-5 w-px shrink-0" style={{ backgroundColor: 'var(--border-subtle)' }} />
        <span className="font-sans font-semibold text-[11px] uppercase tracking-wider shrink-0" style={{ color: 'var(--text-muted)' }}>Features</span>
        {FEATURE_OPTIONS.map(f => (
          <button key={f} type="button" onClick={() => toggleFeature(f)}
            className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border shrink-0"
            style={featureFilters.includes(f)
              ? { backgroundColor: 'var(--motor-600)', borderColor: 'var(--motor-600)', color: 'white' }
              : { backgroundColor: 'transparent', borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
          >{f}</button>
        ))}
        {featureFilters.length > 0 && (
          <button type="button" onClick={() => setFeatureFilters([])}
            className="ml-auto h-7 px-3 rounded-full font-sans text-[12px] font-medium border"
            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}
          >Clear</button>
        )}
      </div>

      <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
        {displayPlans.length} plan{displayPlans.length !== 1 ? 's' : ''} · {COVER_LABELS[coverType]}{carValue > 0 ? ` · ${formatNGN(carValue)} IDV` : ''}
      </p>

      {displayPlans.map((plan, i) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          price={getPrice(plan)}
          selected={motorData.selectedUnderwriter === plan.id}
          index={i}
          onSelect={() => handleSelect(plan)}
        />
      ))}
    </div>
  )
}

function PlanCard({
  plan, price, selected, index, onSelect,
}: {
  plan: typeof MOTOR_PLANS[number]
  price: number
  selected: boolean
  index: number
  onSelect: () => void
}) {
  const [activeTab, setActiveTab] = useState<'highlights' | 'exclusions'>('highlights')
  const [showAll, setShowAll] = useState(false)
  const displayFeatures = showAll ? plan.features : plan.features.slice(0, 6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: selected ? 'var(--motor-600)' : plan.popular ? 'var(--motor-300)' : 'var(--border-default)',
        borderWidth: selected || plan.popular ? '1.5px' : '1px',
        backgroundColor: selected ? 'var(--motor-50)' : 'white',
      }}
    >
      {(selected || plan.popular) && (
        <div className="h-1 w-full" style={{ backgroundColor: 'var(--motor-600)' }} />
      )}

      <div className="p-5">
        {/* Top row: badges + price */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full border"
              style={{ color: 'var(--motor-600)', borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-50)' }}
            >
              {COVER_LABELS[plan.coverType]}
            </span>
            {plan.badge && (
              <span className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full bg-[var(--green-50)] text-[var(--green-700)] border border-[var(--green-100)]">
                {plan.badge}
              </span>
            )}
            {selected && (
              <span className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: 'var(--motor-600)' }}>
                Selected
              </span>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-display font-extrabold text-[22px] leading-none" style={{ color: 'var(--motor-600)' }}>
              {formatNGN(price)}
            </p>
            <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>/yr · excl. taxes</p>
          </div>
        </div>

        {/* Insurer row */}
        <div className="mb-4 flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden bg-white p-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
            {plan.logo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={plan.logo} alt={plan.insurer} className="w-full h-full object-contain" />
              : <span className="font-display font-bold text-[13px]" style={{ color: 'var(--motor-600)' }}>{plan.insurer.slice(0, 2).toUpperCase()}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-[17px] leading-tight" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{plan.insurer}</span>
              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--border-medium)' }} />
              <Star className="w-3 h-3 fill-current" style={{ color: '#F59E0B' }} />
              <span className="font-sans text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{plan.rating}</span>
              <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>({plan.reviews.toLocaleString()})</span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-2 py-3 border-y border-[var(--border-subtle)] mb-4">
          {[
            { label: 'CLAIM SETTLEMENT', value: plan.claimSettlement },
            { label: 'RESPONSE TIME',    value: plan.responseTime },
            { label: 'EXCESS',           value: plan.excess },
            { label: 'REPAIR NETWORK',   value: plan.repairNetwork },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-sans font-bold text-[9px] uppercase tracking-[0.06em] mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
              <p className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-primary)' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Highlights / Exclusions tabs */}
        <div className="flex gap-5 border-b border-[var(--border-subtle)] mb-3">
          {(['highlights', 'exclusions'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="pb-2 font-sans font-medium text-[13px] capitalize transition-colors border-b-2 -mb-px"
              style={{
                color: activeTab === tab ? 'var(--motor-600)' : 'var(--text-muted)',
                borderBottomColor: activeTab === tab ? 'var(--motor-600)' : 'transparent',
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3">
          {(activeTab === 'highlights' ? displayFeatures : plan.exclusions).map((item) => (
            <div key={item} className="flex items-start gap-2">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: activeTab === 'highlights' ? 'var(--motor-50)' : '#fef2f2' }}
              >
                {activeTab === 'highlights'
                  ? <Check className="w-2.5 h-2.5" style={{ color: 'var(--motor-600)' }} strokeWidth={3} />
                  : <X className="w-2.5 h-2.5 text-red-400" strokeWidth={3} />}
              </div>
              <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{item}</span>
            </div>
          ))}
        </div>

        {activeTab === 'highlights' && plan.features.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1 font-sans text-[12px] font-medium mb-3"
            style={{ color: 'var(--motor-600)' }}
          >
            {showAll
              ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
              : <><ChevronDown className="w-3.5 h-3.5" /> Show all {plan.features.length} features</>}
          </button>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onSelect}
            className="flex items-center gap-1.5 h-9 px-5 rounded-lg font-sans font-semibold text-[13px] text-white transition-all hover:-translate-y-px hover:shadow-md"
            style={{ backgroundColor: selected ? 'var(--motor-700)' : 'var(--motor-600)' }}
          >
            {selected ? <><Check className="w-3.5 h-3.5" /> Selected</> : 'Select Plan →'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
