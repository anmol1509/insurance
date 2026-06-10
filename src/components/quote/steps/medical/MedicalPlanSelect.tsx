'use client'
import { useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Check, X, ChevronDown, ChevronUp, Plus, ArrowLeftRight } from 'lucide-react'
import { MEDICAL_PLANS } from '@/lib/medicalPlans'
import type { MedicalPlan } from '@/lib/medicalPlans'

function formatNGN(n: number) {
  return '₦' + n.toLocaleString('en-NG')
}

const NETWORK_LABELS: Record<string, string> = {
  standard: 'Standard Network',
  wide: 'Wide Network',
  premium: 'Premium Worldwide',
}

const FEATURE_OPTIONS = ['Dental Included', 'Maternity Cover', 'Worldwide Emergency', 'Mental Health']

const FEATURE_KEYWORDS: Record<string, string> = {
  'Dental Included': 'dental',
  'Maternity Cover': 'matern',
  'Worldwide Emergency': 'worldwide',
  'Mental Health': 'mental',
}

type SortKey = 'popular' | 'price' | 'coverage' | 'rating'

function parseLimitValue(s: string): number {
  const m = s.match(/[\d,]+/)
  return m ? parseInt(m[0].replace(/,/g, '')) : 0
}

export default function MedicalPlanSelect() {
  const { medicalData, updateMedical, setCalculatedPremium, setStep } = useQuoteStore()
  const lives = medicalData.numberOfLives || 1

  const [sortBy, setSortBy] = useState<SortKey>('popular')
  const [featureFilters, setFeatureFilters] = useState<string[]>([])
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  function toggleFeature(f: string) {
    setFeatureFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  function toggleCompare(id: string) {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  function getPrice(plan: MedicalPlan): number {
    return plan.pricePerPerson * lives
  }

  const displayPlans = MEDICAL_PLANS
    .filter(p => featureFilters.length === 0 || featureFilters.every(f => {
      const keyword = FEATURE_KEYWORDS[f] ?? f.toLowerCase()
      return p.features.some(pf => pf.toLowerCase().includes(keyword))
    }))
    .sort((a, b) => {
      if (sortBy === 'price') return getPrice(a) - getPrice(b)
      if (sortBy === 'coverage') return parseLimitValue(b.annualLimit) - parseLimitValue(a.annualLimit)
      if (sortBy === 'rating') return b.rating - a.rating
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
    })

  const comparePlansData = MEDICAL_PLANS.filter(p => compareIds.includes(p.id))

  function handleSelect(plan: MedicalPlan) {
    updateMedical({ selectedUnderwriter: plan.id })
    setCalculatedPremium(getPrice(plan), {})
    setTimeout(() => {
      setStep('medical', 4)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 350)
  }

  return (
    <div className="space-y-4">
      {/* Sort + filter bar */}
      <div
        className="rounded-2xl border px-4 py-3 flex items-center gap-2 flex-wrap"
        style={{ backgroundColor: 'var(--medical-50)', borderColor: 'var(--medical-100)' }}
      >
        <span className="font-sans font-semibold text-[11px] uppercase tracking-wider shrink-0" style={{ color: 'var(--text-muted)' }}>Sort</span>
        {([['popular', 'Popular'], ['price', 'Lowest Price'], ['coverage', 'Best Coverage'], ['rating', 'Best Rated']] as [SortKey, string][]).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setSortBy(key)}
            className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border shrink-0"
            style={sortBy === key
              ? { backgroundColor: 'var(--medical-600)', borderColor: 'var(--medical-600)', color: 'white' }
              : { backgroundColor: 'transparent', borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
          >{label}</button>
        ))}
        <div className="h-5 w-px shrink-0" style={{ backgroundColor: 'var(--border-subtle)' }} />
        <span className="font-sans font-semibold text-[11px] uppercase tracking-wider shrink-0" style={{ color: 'var(--text-muted)' }}>Includes</span>
        {FEATURE_OPTIONS.map(f => (
          <button key={f} type="button" onClick={() => toggleFeature(f)}
            className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border shrink-0"
            style={featureFilters.includes(f)
              ? { backgroundColor: 'var(--medical-600)', borderColor: 'var(--medical-600)', color: 'white' }
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
        {displayPlans.length} plan{displayPlans.length !== 1 ? 's' : ''}{lives > 1 ? ` · ${lives} lives` : ''}
      </p>

      {displayPlans.map((plan, i) => (
        <MedicalPlanCard
          key={plan.id}
          plan={plan}
          price={getPrice(plan)}
          lives={lives}
          selected={medicalData.selectedUnderwriter === plan.id}
          inCompare={compareIds.includes(plan.id)}
          compareDisabled={compareIds.length >= 3 && !compareIds.includes(plan.id)}
          index={i}
          onSelect={() => handleSelect(plan)}
          onToggleCompare={() => toggleCompare(plan.id)}
        />
      ))}

      {compareIds.length >= 2 && <div className="h-16" />}

      {/* Sticky compare bar */}
      <AnimatePresence>
        {compareIds.length >= 2 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[60] border-t"
            style={{ backgroundColor: 'white', borderColor: 'var(--border-default)', boxShadow: '0 -4px 24px rgba(0,0,0,0.1)' }}
          >
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
              <span className="font-sans font-semibold text-[12px] shrink-0" style={{ color: 'var(--text-muted)' }}>Comparing:</span>
              <div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
                {comparePlansData.map(p => (
                  <span
                    key={p.id}
                    className="flex items-center gap-1.5 h-7 pl-3 pr-2 rounded-full font-sans font-medium text-[12px] border shrink-0"
                    style={{ backgroundColor: 'var(--medical-50)', borderColor: 'var(--medical-200)', color: 'var(--medical-700)' }}
                  >
                    {p.name.split(' ').slice(0, 2).join(' ')}
                    <button type="button" onClick={() => toggleCompare(p.id)}
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'var(--medical-200)' }}
                    >
                      <X className="w-2.5 h-2.5" style={{ color: 'var(--medical-700)' }} />
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-2 h-9 px-4 rounded-xl font-sans font-bold text-[13px] text-white shrink-0 transition-all hover:-translate-y-px hover:shadow-lg active:scale-95"
                style={{ backgroundColor: 'var(--medical-600)' }}
              >
                <ArrowLeftRight className="w-4 h-4" />
                Compare {compareIds.length} Plans
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompareModal && (
          <MedicalCompareModal
            plans={comparePlansData}
            prices={comparePlansData.map(p => getPrice(p))}
            onClose={() => setShowCompareModal(false)}
            onSelect={(plan) => { setShowCompareModal(false); handleSelect(plan) }}
            onRemove={(id) => toggleCompare(id)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function MedicalPlanCard({
  plan, price, lives, selected, inCompare, compareDisabled, index, onSelect, onToggleCompare,
}: {
  plan: MedicalPlan
  price: number
  lives: number
  selected: boolean
  inCompare: boolean
  compareDisabled: boolean
  index: number
  onSelect: () => void
  onToggleCompare: () => void
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
        borderColor: selected ? 'var(--medical-600)' : inCompare ? 'var(--medical-400)' : plan.popular ? 'var(--medical-300)' : 'var(--border-default)',
        borderWidth: selected || plan.popular || inCompare ? '1.5px' : '1px',
        backgroundColor: selected ? 'var(--medical-50)' : 'white',
      }}
    >
      {(selected || plan.popular) && (
        <div className="h-1 w-full" style={{ backgroundColor: 'var(--medical-600)' }} />
      )}

      <div className="p-5">
        {/* Top row: badges + price */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full border"
              style={{ color: 'var(--medical-600)', borderColor: 'var(--medical-600)', backgroundColor: 'var(--medical-50)' }}
            >
              {NETWORK_LABELS[plan.networkTier]}
            </span>
            {plan.badge && (
              <span className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full bg-[var(--green-50)] text-[var(--green-700)] border border-[var(--green-100)]">
                {plan.badge}
              </span>
            )}
            {selected && (
              <span className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: 'var(--medical-600)' }}>
                Selected
              </span>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-display font-extrabold text-[22px] leading-none" style={{ color: 'var(--medical-600)' }}>
              {formatNGN(price)}
            </p>
            <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              /yr{lives > 1 ? ` · ${lives} lives` : ' · per person'} · excl. taxes
            </p>
          </div>
        </div>

        {/* Insurer row */}
        <div className="mb-4 flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden bg-white p-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
            {plan.logo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={plan.logo} alt={plan.insurer} className="w-full h-full object-contain" />
              : <span className="font-display font-bold text-[13px]" style={{ color: 'var(--medical-600)' }}>{plan.insurer.slice(0, 2).toUpperCase()}</span>
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
            { label: 'ANNUAL LIMIT',    value: plan.annualLimit },
            { label: 'CONSULTATION',    value: plan.consultation },
            { label: 'PHARMACY',        value: plan.pharmacy },
            { label: 'DENTAL',          value: plan.dental },
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
                color: activeTab === tab ? 'var(--medical-600)' : 'var(--text-muted)',
                borderBottomColor: activeTab === tab ? 'var(--medical-600)' : 'transparent',
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
                style={{ backgroundColor: activeTab === 'highlights' ? 'var(--medical-50)' : '#fef2f2' }}
              >
                {activeTab === 'highlights'
                  ? <Check className="w-2.5 h-2.5" style={{ color: 'var(--medical-600)' }} strokeWidth={3} />
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
            style={{ color: 'var(--medical-600)' }}
          >
            {showAll
              ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
              : <><ChevronDown className="w-3.5 h-3.5" /> Show all {plan.features.length} features</>}
          </button>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={onToggleCompare}
            disabled={compareDisabled}
            className="flex items-center gap-1.5 h-9 px-4 rounded-lg font-sans font-semibold text-[13px] transition-all border disabled:opacity-40 disabled:cursor-not-allowed"
            style={inCompare
              ? { borderColor: 'var(--medical-600)', color: 'var(--medical-600)', backgroundColor: 'var(--medical-50)' }
              : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)', backgroundColor: 'white' }}
          >
            {inCompare
              ? <><Check className="w-3.5 h-3.5" /> In Compare</>
              : <><Plus className="w-3.5 h-3.5" /> Compare</>}
          </button>
          <button
            type="button"
            onClick={onSelect}
            className="flex items-center gap-1.5 h-9 px-5 rounded-lg font-sans font-semibold text-[13px] text-white transition-all hover:-translate-y-px hover:shadow-md"
            style={{ backgroundColor: selected ? 'var(--medical-700)' : 'var(--medical-600)' }}
          >
            {selected ? <><Check className="w-3.5 h-3.5" /> Selected</> : 'Select Plan →'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function MedicalCompareModal({ plans, prices, onClose, onSelect, onRemove }: {
  plans: MedicalPlan[]
  prices: number[]
  onClose: () => void
  onSelect: (plan: MedicalPlan) => void
  onRemove: (id: string) => void
}) {
  const allFeatures = Array.from(new Set(plans.flatMap(p => p.features)))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div className="min-h-full flex items-start justify-center p-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 24 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: 'white' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-default)' }}>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--medical-100), var(--medical-50))' }}
              >
                <ArrowLeftRight className="w-4 h-4" style={{ color: 'var(--medical-600)' }} />
              </div>
              <div>
                <h3 className="font-display font-bold text-[17px]" style={{ color: 'var(--text-primary)' }}>Plan Comparison</h3>
                <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{plans.length} plans side by side</p>
              </div>
            </div>
            <button type="button" onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--surface-raised)]"
            >
              <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: `${160 + plans.length * 224}px` }}>
              <thead>
                <tr>
                  {/* Sticky label column */}
                  <th
                    className="sticky left-0 z-10 w-40 border-b border-r px-4 py-5 text-left align-bottom"
                    style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-subtle)' }}
                  >
                    <span className="font-sans font-bold text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      {plans.length} plans
                    </span>
                  </th>
                  {plans.map((plan, i) => (
                    <th
                      key={plan.id}
                      className="border-b border-l px-5 py-5 text-left align-top"
                      style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-subtle)', minWidth: '224px' }}
                    >
                      {/* Logo + remove */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div
                          className="w-12 h-12 rounded-2xl border-2 flex items-center justify-center overflow-hidden bg-white shrink-0 p-1"
                          style={{ borderColor: 'var(--border-default)' }}
                        >
                          {plan.logo
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={plan.logo} alt={plan.insurer} className="w-full h-full object-contain" />
                            : <span className="font-display font-bold text-[14px]" style={{ color: 'var(--medical-600)' }}>
                                {plan.insurer.slice(0, 2).toUpperCase()}
                              </span>
                          }
                        </div>
                        <button type="button" onClick={() => onRemove(plan.id)}
                          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                          style={{ backgroundColor: '#fef2f2' }}
                        >
                          <X className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>

                      {/* Badge */}
                      {plan.badge && (
                        <span
                          className="inline-flex items-center font-sans font-bold text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full mb-2"
                          style={{ backgroundColor: 'var(--medical-50)', color: 'var(--medical-700)', border: '1px solid var(--medical-100)' }}
                        >
                          {plan.badge}
                        </span>
                      )}

                      {/* Name + insurer */}
                      <p className="font-display font-bold text-[15px] leading-tight" style={{ color: 'var(--text-primary)' }}>{plan.name}</p>
                      <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{plan.insurer}</p>

                      {/* Star rating */}
                      <div className="flex items-center gap-0.5 mt-2 mb-3">
                        {[1, 2, 3, 4, 5].map(n => (
                          <Star key={n} className="w-3 h-3 fill-current" style={{ color: n <= Math.round(plan.rating) ? '#F59E0B' : '#D1D5DB' }} />
                        ))}
                        <span className="font-sans font-semibold text-[11px] ml-1" style={{ color: 'var(--text-secondary)' }}>{plan.rating}</span>
                        <span className="font-sans text-[11px] ml-0.5" style={{ color: 'var(--text-muted)' }}>· {plan.reviews.toLocaleString()}</span>
                      </div>

                      {/* Price + select */}
                      <div className="pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                        <p className="font-display font-extrabold text-[24px] leading-none" style={{ color: 'var(--medical-600)' }}>
                          {formatNGN(prices[i])}
                        </p>
                        <p className="font-sans text-[11px] mt-0.5 mb-3" style={{ color: 'var(--text-muted)' }}>/yr · excl. taxes</p>
                        <button
                          type="button"
                          onClick={() => onSelect(plan)}
                          className="w-full h-9 rounded-xl font-sans font-bold text-[12px] text-white transition-all hover:-translate-y-px hover:shadow-md active:scale-95"
                          style={{ backgroundColor: 'var(--medical-600)' }}
                        >
                          Select Plan →
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Key stats section */}
                <tr>
                  <td
                    colSpan={plans.length + 1}
                    className="px-4 py-2 font-sans font-bold text-[10px] uppercase tracking-widest"
                    style={{ backgroundColor: 'var(--medical-50)', color: 'var(--medical-700)', borderTop: '2px solid var(--medical-100)', borderBottom: '1px solid var(--medical-100)' }}
                  >
                    Key Statistics
                  </td>
                </tr>

                {([
                  ['Annual Limit', 'annualLimit'],
                  ['Consultation', 'consultation'],
                  ['Pharmacy', 'pharmacy'],
                  ['Dental', 'dental'],
                  ['Hospitalization', 'hospitalization'],
                  ['Network', 'networkTier'],
                ] as [string, keyof MedicalPlan][]).map(([label, key], idx) => (
                  <tr key={key} className="border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: idx % 2 === 0 ? 'white' : 'var(--surface-raised)' }}>
                    <td
                      className="sticky left-0 z-10 px-4 py-3.5 font-sans font-semibold text-[12px] border-r"
                      style={{ color: 'var(--text-secondary)', backgroundColor: idx % 2 === 0 ? 'white' : 'var(--surface-raised)', borderColor: 'var(--border-subtle)' }}
                    >
                      {label}
                    </td>
                    {plans.map(plan => (
                      <td key={plan.id} className="px-5 py-3.5 font-sans font-medium text-[13px] border-l" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}>
                        {key === 'networkTier' ? NETWORK_LABELS[plan.networkTier] : String(plan[key])}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Features section */}
                <tr>
                  <td
                    colSpan={plans.length + 1}
                    className="px-4 py-2 font-sans font-bold text-[10px] uppercase tracking-widest"
                    style={{ backgroundColor: 'var(--medical-50)', color: 'var(--medical-700)', borderTop: '2px solid var(--medical-100)', borderBottom: '1px solid var(--medical-100)' }}
                  >
                    Features Included
                  </td>
                </tr>

                {allFeatures.map((feature, idx) => (
                  <tr key={feature} className="border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: idx % 2 === 0 ? 'white' : 'var(--surface-raised)' }}>
                    <td
                      className="sticky left-0 z-10 px-4 py-2.5 font-sans text-[12px] border-r"
                      style={{ color: 'var(--text-secondary)', backgroundColor: idx % 2 === 0 ? 'white' : 'var(--surface-raised)', borderColor: 'var(--border-subtle)' }}
                    >
                      {feature}
                    </td>
                    {plans.map(plan => {
                      const has = plan.features.some(f => f.toLowerCase() === feature.toLowerCase())
                      return (
                        <td key={plan.id} className="px-5 py-2.5 border-l" style={{ borderColor: 'var(--border-subtle)' }}>
                          <div className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: has ? 'var(--medical-50)' : '#fef2f2' }}
                          >
                            {has
                              ? <Check className="w-3 h-3" style={{ color: 'var(--medical-600)' }} strokeWidth={3} />
                              : <X className="w-3 h-3 text-red-400" strokeWidth={3} />}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
