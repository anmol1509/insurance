'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuoteStore } from '@/store/quoteStore'
import { formatNaira } from '@/lib/formatters'
import { Shield, Star, ChevronDown, ChevronUp, ArrowLeft, Check, Mail, X, GitCompare } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'

type SortKey = 'popular' | 'price' | 'rating'

interface Plan {
  id: string
  insurer: string
  logo: string
  rating: number
  reviews: number
  badge?: string
  multiplier: number
  features: string[]
  claimSettlement: string
  networkSize?: string
  popular?: boolean
}

const MOTOR_PLANS: Plan[] = [
  {
    id: 'leadway-motor',
    insurer: 'Leadway Assurance',
    logo: '🏦',
    rating: 4.8,
    reviews: 2341,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['Comprehensive cover', 'NIID auto-registered', '24/7 roadside assist', 'Claims in 24 hrs'],
    claimSettlement: '98%',
    popular: true,
  },
  {
    id: 'aiico-motor',
    insurer: 'AIICO Insurance',
    logo: '🏢',
    rating: 4.7,
    reviews: 1892,
    badge: 'Best value',
    multiplier: 0.91,
    features: ['Comprehensive cover', 'Towing included', 'Windscreen cover', 'Flood & fire'],
    claimSettlement: '96%',
  },
  {
    id: 'axa-motor',
    insurer: 'AXA Mansard',
    logo: '🌐',
    rating: 4.6,
    reviews: 1534,
    multiplier: 1.08,
    features: ['Comprehensive cover', 'New-for-old replacement', 'International coverage', 'Priority claims'],
    claimSettlement: '97%',
  },
  {
    id: 'nsia-motor',
    insurer: 'NSIA Insurance',
    logo: '🛡',
    rating: 4.5,
    reviews: 987,
    multiplier: 0.86,
    features: ['Third party & comprehensive', 'Fleet discounts', 'Online policy management', 'NIID registered'],
    claimSettlement: '94%',
  },
  {
    id: 'zenith-motor',
    insurer: 'Zenith General Insurance',
    logo: '⚡',
    rating: 4.4,
    reviews: 743,
    multiplier: 0.83,
    features: ['Comprehensive & TPO', 'Excess waiver option', 'Courtesy car', 'NAICOM regulated'],
    claimSettlement: '93%',
  },
]

const MEDICAL_PLANS: Plan[] = [
  {
    id: 'leadway-health',
    insurer: 'Leadway Health',
    logo: '❤️',
    rating: 4.8,
    reviews: 3102,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['500+ hospitals nationwide', 'Cashless treatment', 'Specialist referrals', 'Emergency evacuation'],
    claimSettlement: '99%',
    networkSize: '500+ hospitals',
    popular: true,
  },
  {
    id: 'hygeia',
    insurer: 'Hygeia HMO',
    logo: '🏥',
    rating: 4.7,
    reviews: 2214,
    badge: 'Best network',
    multiplier: 1.05,
    features: ['700+ accredited facilities', 'Telemedicine included', 'Dental & vision option', 'Annual check-ups'],
    claimSettlement: '98%',
    networkSize: '700+ hospitals',
  },
  {
    id: 'reliance-hmo',
    insurer: 'Reliance HMO',
    logo: '💊',
    rating: 4.6,
    reviews: 1677,
    multiplier: 0.93,
    features: ['App-based claims', '400+ hospitals', 'Maternity cover', 'Lab & diagnostic tests'],
    claimSettlement: '97%',
    networkSize: '400+ hospitals',
  },
  {
    id: 'aiico-medical',
    insurer: 'AIICO Medical',
    logo: '🩺',
    rating: 4.4,
    reviews: 891,
    multiplier: 0.87,
    features: ['Inpatient & outpatient', 'Group plan discounts', 'Preventive care', 'Nationwide coverage'],
    claimSettlement: '95%',
    networkSize: '350+ hospitals',
  },
]

const TRAVEL_PLANS: Plan[] = [
  {
    id: 'axa-travel',
    insurer: 'AXA Mansard Travel',
    logo: '✈️',
    rating: 4.8,
    reviews: 1823,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['Schengen compliant', '€50,000 medical cover', 'Trip cancellation', '24/7 emergency line'],
    claimSettlement: '98%',
    popular: true,
  },
  {
    id: 'leadway-travel',
    insurer: 'Leadway Assurance',
    logo: '🌍',
    rating: 4.7,
    reviews: 1341,
    multiplier: 0.94,
    features: ['€30,000 medical', 'Baggage & delay', 'Adventure sports option', 'Flight cancellation'],
    claimSettlement: '96%',
  },
  {
    id: 'allianz-travel',
    insurer: 'Allianz Nigeria',
    logo: '🔵',
    rating: 4.6,
    reviews: 987,
    badge: 'Best price',
    multiplier: 0.88,
    features: ['Multi-trip option', '€30,000 medical', 'Baggage loss', 'Repatriation cover'],
    claimSettlement: '97%',
  },
  {
    id: 'aiico-travel',
    insurer: 'AIICO Insurance',
    logo: '🏢',
    rating: 4.4,
    reviews: 612,
    multiplier: 0.82,
    features: ['Single & multi-trip', 'Medical emergency', 'Personal liability', 'NAICOM licensed'],
    claimSettlement: '94%',
  },
]

const BUSINESS_PLANS: Plan[] = [
  {
    id: 'leadway-business',
    insurer: 'Leadway Assurance',
    logo: '🏦',
    rating: 4.8,
    reviews: 2109,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['Property & liability', 'Business interruption', 'Employee cover', 'Priority claims desk'],
    claimSettlement: '97%',
    popular: true,
  },
  {
    id: 'zenith-business',
    insurer: 'Zenith Insurance',
    logo: '⚡',
    rating: 4.6,
    reviews: 1342,
    multiplier: 0.92,
    features: ['All-risks property', 'Public liability', 'Goods in transit', 'Directors cover'],
    claimSettlement: '96%',
  },
  {
    id: 'nsia-business',
    insurer: 'NSIA Insurance',
    logo: '🛡',
    rating: 4.5,
    reviews: 876,
    badge: 'Best price',
    multiplier: 0.85,
    features: ['Fire & burglary', 'Machinery breakdown', 'Group personal accident', 'NAICOM regulated'],
    claimSettlement: '95%',
  },
  {
    id: 'custodian-business',
    insurer: 'Custodian Insurance',
    logo: '🔒',
    rating: 4.4,
    reviews: 654,
    multiplier: 0.89,
    features: ['Commercial property', 'Employee liability', 'Fidelity guarantee', 'Online portal'],
    claimSettlement: '94%',
  },
]

const PLANS_BY_PRODUCT: Record<string, Plan[]> = {
  motor: MOTOR_PLANS,
  medical: MEDICAL_PLANS,
  travel: TRAVEL_PLANS,
  business: BUSINESS_PLANS,
}

const PRODUCT_COLORS: Record<string, { main: string; light: string; text: string }> = {
  motor:    { main: 'var(--motor-600)',    light: 'var(--motor-50)',    text: 'var(--motor-700)' },
  medical:  { main: 'var(--medical-600)',  light: 'var(--medical-50)',  text: 'var(--medical-700)' },
  travel:   { main: 'var(--travel-600)',   light: 'var(--travel-50)',   text: 'var(--travel-700)' },
  business: { main: 'var(--business-600)', light: 'var(--business-50)', text: 'var(--business-700)' },
}

function PlanCard({ plan, basePrice, color, index, compareSelected, onToggleCompare, canCompare }: {
  plan: Plan
  basePrice: number
  color: { main: string; light: string; text: string }
  index: number
  compareSelected: boolean
  onToggleCompare: (id: string) => void
  canCompare: boolean
}) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const price = Math.round(basePrice * plan.multiplier)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-3xl border overflow-hidden hover:shadow-md transition-shadow duration-200"
      style={{ borderColor: plan.popular ? color.main : 'var(--border-default)' }}
    >
      {plan.popular && (
        <div className="h-1.5 w-full" style={{ backgroundColor: color.main }} />
      )}

      <div className="p-6">
        {/* Compare toggle — top-right corner */}
        <div className="flex justify-end mb-1 -mt-1">
          <button
            type="button"
            aria-label={compareSelected ? 'Remove from comparison' : 'Add to comparison'}
            disabled={!canCompare}
            onClick={() => onToggleCompare(plan.id)}
            className="flex items-center gap-1.5 font-sans text-[11px] font-medium transition-all disabled:opacity-40"
            style={{ color: compareSelected ? color.main : 'var(--text-muted)' }}
          >
            <span className="text-[10px] uppercase tracking-wide">Compare</span>
            <span
              className="w-4 h-4 rounded-sm border flex items-center justify-center transition-all"
              style={compareSelected
                ? { backgroundColor: color.main, borderColor: color.main }
                : { backgroundColor: 'transparent', borderColor: 'var(--border-medium)' }
              }
            >
              {compareSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </span>
          </button>
        </div>

        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: color.light }}>
              {plan.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>{plan.insurer}</h3>
                {plan.badge && (
                  <span className="font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: color.light, color: color.text }}>
                    {plan.badge}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-current" style={{ color: '#F59E0B' }} />
                <span className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>{plan.rating}</span>
                <span className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>({plan.reviews.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="font-sans text-[11px] uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-muted)' }}>Plans starting from</p>
            <p className="font-display font-extrabold text-[26px] leading-none" style={{ color: color.main }}>
              {formatNaira(price)}
            </p>
            <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>per year</p>
          </div>
        </div>

        {/* Key features */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-5">
          {plan.features.slice(0, expanded ? undefined : 4).map((f) => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: color.light }}>
                <Check className="w-2.5 h-2.5" style={{ color: color.main }} strokeWidth={3} />
              </div>
              <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-4 py-3 border-y border-[var(--border-subtle)] mb-5">
          <div>
            <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>Claim settlement</p>
            <p className="font-display font-bold text-sm" style={{ color: 'var(--green-700)' }}>{plan.claimSettlement}</p>
          </div>
          {plan.networkSize && (
            <div className="border-l border-[var(--border-subtle)] pl-4">
              <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>Network</p>
              <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{plan.networkSize}</p>
            </div>
          )}
          <div className="border-l border-[var(--border-subtle)] pl-4 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>NAICOM Licensed</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/quote/checkout')}
            className="flex-1 h-11 rounded-2xl font-sans font-semibold text-sm text-white transition-all hover:-translate-y-px hover:shadow-md"
            style={{ backgroundColor: color.main }}
          >
            Choose plan →
          </button>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="h-11 px-4 rounded-2xl border font-sans text-sm flex items-center gap-1.5 hover:bg-[var(--surface-raised)] transition-colors"
            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
          >
            {expanded ? <><ChevronUp className="w-4 h-4" /> Less</> : <><ChevronDown className="w-4 h-4" /> Details</>}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function CompareModal({ plans, basePrice, color, onClose }: {
  plans: Plan[]
  basePrice: number
  color: { main: string; light: string; text: string }
  onClose: () => void
}) {
  const router = useRouter()
  // Collect all unique feature strings across the selected plans
  const allFeatures = Array.from(new Set(plans.flatMap(p => p.features)))
  const hasNetwork = plans.some(p => p.networkSize)

  return (
    <div className="fixed inset-0 z-50 flex flex-col" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="relative mt-auto bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[var(--border-medium)]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4" style={{ color: color.main }} />
            <h2 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>Compare Plans</h2>
          </div>
          <button type="button" onClick={onClose} className="text-[var(--text-subtle)] hover:text-[var(--text-muted)]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable table */}
        <div className="overflow-auto flex-1 px-4 py-4">
          <table className="w-full border-collapse" style={{ minWidth: `${plans.length * 160 + 120}px` }}>
            <thead>
              <tr>
                <th className="text-left font-sans text-[11px] uppercase tracking-wide pb-3 pr-4 w-[120px]" style={{ color: 'var(--text-muted)' }}>
                  Feature
                </th>
                {plans.map(plan => {
                  const price = Math.round(basePrice * plan.multiplier)
                  return (
                    <th key={plan.id} className="pb-3 px-2 text-center" style={{ minWidth: '140px' }}>
                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => router.push('/quote/checkout')}
                          className="w-full h-9 rounded-xl font-sans font-semibold text-[13px] text-white transition-all hover:-translate-y-px hover:shadow-md"
                          style={{ backgroundColor: color.main }}
                        >
                          Choose plan →
                        </button>
                        <span className="text-2xl mt-1">{plan.logo}</span>
                        <span className="font-display font-bold text-[13px] leading-tight" style={{ color: 'var(--text-primary)' }}>
                          {plan.insurer}
                        </span>
                        <span className="font-display font-extrabold text-base" style={{ color: color.main }}>
                          {formatNaira(price)}
                        </span>
                        <span className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>per year</span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {/* Annual Premium row */}
              <tr className="border-t border-[var(--border-subtle)]">
                <td className="py-2.5 pr-4 font-sans text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Annual Premium</td>
                {plans.map(plan => (
                  <td key={plan.id} className="py-2.5 px-2 text-center font-display font-bold text-sm" style={{ color: color.main }}>
                    {formatNaira(Math.round(basePrice * plan.multiplier))}
                  </td>
                ))}
              </tr>
              {/* Star Rating row */}
              <tr className="border-t border-[var(--border-subtle)]">
                <td className="py-2.5 pr-4 font-sans text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Star Rating</td>
                {plans.map(plan => (
                  <td key={plan.id} className="py-2.5 px-2 text-center">
                    <span className="inline-flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 fill-current" style={{ color: '#F59E0B' }} />
                      <span className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{plan.rating}</span>
                    </span>
                  </td>
                ))}
              </tr>
              {/* Claim Settlement row */}
              <tr className="border-t border-[var(--border-subtle)]">
                <td className="py-2.5 pr-4 font-sans text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Claim Settlement</td>
                {plans.map(plan => (
                  <td key={plan.id} className="py-2.5 px-2 text-center font-sans font-semibold text-[13px]" style={{ color: 'var(--green-700)' }}>
                    {plan.claimSettlement}
                  </td>
                ))}
              </tr>
              {/* Network row — only if any plan has it */}
              {hasNetwork && (
                <tr className="border-t border-[var(--border-subtle)]">
                  <td className="py-2.5 pr-4 font-sans text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Network</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="py-2.5 px-2 text-center font-sans text-[13px]" style={{ color: 'var(--text-primary)' }}>
                      {plan.networkSize ?? '—'}
                    </td>
                  ))}
                </tr>
              )}
              {/* Individual feature rows */}
              {allFeatures.map(feature => (
                <tr key={feature} className="border-t border-[var(--border-subtle)]">
                  <td className="py-2.5 pr-4 font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{feature}</td>
                  {plans.map(plan => (
                    <td key={plan.id} className="py-2.5 px-2 text-center">
                      {plan.features.includes(feature)
                        ? <span className="text-base">✓</span>
                        : <span className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>—</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </motion.div>
    </div>
  )
}

function SaveEmailModal({ onClose, lowestPrice }: { onClose: () => void; lowestPrice: number }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!email.includes('@')) return
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-[420px]"
        onClick={e => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-[var(--text-subtle)] hover:text-[var(--text-muted)]">
          <X className="w-5 h-5" />
        </button>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">📬</div>
            <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>Quote sent!</h3>
            <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
              Check your inbox — we've emailed your comparison results. Valid for 24 hours.
            </p>
            <button type="button" onClick={onClose}
              className="mt-5 h-10 px-6 rounded-xl font-sans font-semibold text-sm text-white"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="text-3xl mb-4">📧</div>
            <h3 className="font-display font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>Save your quote</h3>
            <p className="font-sans text-[13px] mb-5" style={{ color: 'var(--text-muted)' }}>
              We'll email you these {formatNaira(lowestPrice)}/yr+ results so you can compare later or share with your family.
            </p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-12 rounded-xl border-[1.5px] border-[var(--border-medium)] px-4 font-sans text-[14px] outline-none mb-3 focus:border-[var(--green-700)]"
              style={{ color: 'var(--text-primary)' }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!email.includes('@')}
              className="w-full h-11 rounded-xl font-sans font-semibold text-sm text-white disabled:opacity-40 transition-opacity"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              Send quote to email
            </button>
            <p className="font-sans text-[11px] text-center mt-3" style={{ color: 'var(--text-muted)' }}>
              No spam. Unsubscribe any time. NDPR compliant.
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}

type PremiumFilter = 'all' | 'under30' | '30to80' | 'over80'
type RatingFilter = 'all' | '4.5' | '4.7'

export default function QuoteResultPage() {
  const { calculatedPremium, activeProduct } = useQuoteStore()
  const [sortBy, setSortBy] = useState<SortKey>('popular')
  const [premiumFilter, setPremiumFilter] = useState<PremiumFilter>('all')
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)

  function toggleCompare(id: string) {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length < 3) return [...prev, id]
      return prev
    })
  }

  const product = (activeProduct ?? 'motor') as string
  const basePrice = calculatedPremium ?? 50000
  const color = PRODUCT_COLORS[product] ?? PRODUCT_COLORS.motor
  const rawPlans = PLANS_BY_PRODUCT[product] ?? MOTOR_PLANS

  const plans = [...rawPlans]
    .filter((p) => {
      const price = Math.round(basePrice * p.multiplier)
      if (premiumFilter === 'under30' && price >= 30000) return false
      if (premiumFilter === '30to80' && (price < 30000 || price > 80000)) return false
      if (premiumFilter === 'over80' && price <= 80000) return false
      if (ratingFilter === '4.5' && p.rating < 4.5) return false
      if (ratingFilter === '4.7' && p.rating < 4.7) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.multiplier - b.multiplier
      if (sortBy === 'rating') return b.rating - a.rating
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
    })

  const lowestPrice = Math.round(basePrice * Math.min(...rawPlans.map(p => p.multiplier)))

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Header band */}
      <div className="py-8 px-5 lg:px-20 bg-white border-b border-[var(--border-default)]">
        <div className="max-w-[900px] mx-auto">
          <Link href={`/quote/${product}`} className="flex items-center gap-1.5 font-sans text-sm mb-4 hover:underline" style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft className="w-4 h-4" /> Back to quote form
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-extrabold text-[28px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {plans.length} plans found for you
              </h1>
              <p className="font-sans text-base mt-1" style={{ color: 'var(--text-muted)' }}>
                Plans starting from{' '}
                <span className="font-bold" style={{ color: color.main }}>{formatNaira(lowestPrice)}/yr</span>
                {' '}· Compare and choose the best fit
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}>
              <Shield className="w-4 h-4" style={{ color: 'var(--green-700)' }} />
              <span className="font-sans font-medium text-sm" style={{ color: 'var(--green-700)' }}>All plans NAICOM licensed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-5 lg:px-0 py-8">
        {/* Filter + Sort bar */}
        <div className="bg-white rounded-2xl border border-[var(--border-default)] p-4 mb-5 flex flex-col sm:flex-row gap-4">
          {/* Filters */}
          <div className="flex-1 flex flex-col gap-2">
            <span className="font-sans font-bold text-[10px] uppercase tracking-[0.08em]" style={{ color: 'var(--text-subtle)' }}>Filter by premium</span>
            <div className="flex gap-1.5 flex-wrap">
              {([['all', 'Any price'], ['under30', 'Under ₦30K'], ['30to80', '₦30K–₦80K'], ['over80', 'Over ₦80K']] as [PremiumFilter, string][]).map(([key, label]) => (
                <button key={key} type="button" onClick={() => setPremiumFilter(key)}
                  className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border"
                  style={premiumFilter === key
                    ? { backgroundColor: color.main, color: 'white', borderColor: color.main }
                    : { backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }
                  }
                >{label}</button>
              ))}
            </div>
          </div>
          <div className="w-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
          {/* Rating filter */}
          <div className="flex flex-col gap-2">
            <span className="font-sans font-bold text-[10px] uppercase tracking-[0.08em]" style={{ color: 'var(--text-subtle)' }}>Min rating</span>
            <div className="flex gap-1.5">
              {([['all', 'Any'], ['4.5', '4.5+'], ['4.7', '4.7+']] as [RatingFilter, string][]).map(([key, label]) => (
                <button key={key} type="button" onClick={() => setRatingFilter(key)}
                  className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border"
                  style={ratingFilter === key
                    ? { backgroundColor: color.main, color: 'white', borderColor: color.main }
                    : { backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }
                  }
                >{label}</button>
              ))}
            </div>
          </div>
          <div className="w-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
          {/* Sort */}
          <div className="flex flex-col gap-2">
            <span className="font-sans font-bold text-[10px] uppercase tracking-[0.08em]" style={{ color: 'var(--text-subtle)' }}>Sort by</span>
            <div className="flex gap-1.5">
              {([['popular', 'Popular'], ['price', 'Price'], ['rating', 'Rating']] as [SortKey, string][]).map(([key, label]) => (
                <button key={key} type="button" onClick={() => setSortBy(key)}
                  className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border"
                  style={sortBy === key
                    ? { backgroundColor: color.main, color: 'white', borderColor: color.main }
                    : { backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }
                  }
                >{label}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="font-sans text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{plans.length}</strong> of {rawPlans.length} plans
          {(premiumFilter !== 'all' || ratingFilter !== 'all') && (
            <button type="button" onClick={() => { setPremiumFilter('all'); setRatingFilter('all') }}
              className="ml-2 font-semibold underline" style={{ color: color.main }}>
              Clear filters
            </button>
          )}
        </p>

        {/* Plan cards */}
        <div className="flex flex-col gap-4">
          {plans.map((plan, i) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              basePrice={basePrice}
              color={color}
              index={i}
              compareSelected={compareIds.includes(plan.id)}
              onToggleCompare={toggleCompare}
              canCompare={compareIds.length < 3 || compareIds.includes(plan.id)}
            />
          ))}
        </div>

        {/* Save quote CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-center gap-3 flex-wrap"
        >
          <button
            type="button"
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-2 h-10 px-5 rounded-xl border font-sans font-medium text-[13px] hover:bg-[var(--surface-raised)] transition-colors"
            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
          >
            <Mail className="w-4 h-4" /> Save quote to email
          </button>
          <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
            Results valid for 24 hours · No spam
          </p>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-5 rounded-3xl border border-[var(--border-default)] bg-white flex flex-wrap items-center justify-center gap-6"
        >
          {[
            { icon: '🔒', label: '256-bit SSL encryption' },
            { icon: '📋', label: 'NAICOM regulated insurers' },
            { icon: '⚡', label: 'Certificate within minutes' },
            { icon: '📞', label: '24/7 claims support' },
          ].map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Floating compare bar — shown when 2+ plans selected */}
      <AnimatePresence>
        {compareIds.length >= 2 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed bottom-20 md:bottom-6 left-0 right-0 z-40 flex justify-center px-4"
          >
            <div className="flex items-center gap-3 bg-white rounded-2xl shadow-xl border border-[var(--border-default)] px-4 py-3">
              <span className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {compareIds.length} plans selected
              </span>
              <button
                type="button"
                onClick={() => setShowCompare(true)}
                className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-sans font-semibold text-sm text-white transition-all hover:-translate-y-px hover:shadow-md"
                style={{ backgroundColor: color.main }}
              >
                <GitCompare className="w-4 h-4" />
                Compare
              </button>
              <button
                type="button"
                aria-label="Clear comparison"
                onClick={() => setCompareIds([])}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--surface-raised)] transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save-to-email modal */}
      <AnimatePresence>
        {showEmailModal && <SaveEmailModal onClose={() => setShowEmailModal(false)} lowestPrice={lowestPrice} />}
      </AnimatePresence>

      {/* Compare modal */}
      <AnimatePresence>
        {showCompare && (
          <CompareModal
            plans={rawPlans.filter(p => compareIds.includes(p.id))}
            basePrice={basePrice}
            color={color}
            onClose={() => setShowCompare(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
