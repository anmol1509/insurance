'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuoteStore } from '@/store/quoteStore'
import { formatNaira } from '@/lib/formatters'
import { Shield, Star, ArrowLeft, Check, Mail, X, GitCompare, Pencil, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type SortKey = 'popular' | 'price' | 'rating'
type RatingFilter = 'all' | '4.5' | '4.7'

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
  instant?: boolean
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
    features: ['NIID auto-registered', '24/7 roadside assist', 'Claims in 24 hrs'],
    claimSettlement: '98%',
    popular: true,
    instant: true,
  },
  {
    id: 'aiico-motor',
    insurer: 'AIICO Insurance',
    logo: '🏢',
    rating: 4.7,
    reviews: 1892,
    badge: 'Best value',
    multiplier: 0.91,
    features: ['NIID auto-registered', 'Towing included', 'Cashless claims'],
    claimSettlement: '96%',
    instant: true,
  },
  {
    id: 'axa-motor',
    insurer: 'AXA Mansard',
    logo: '🌐',
    rating: 4.6,
    reviews: 1534,
    multiplier: 1.08,
    features: ['New-for-old replacement', 'International coverage', 'Priority claims'],
    claimSettlement: '97%',
  },
  {
    id: 'nsia-motor',
    insurer: 'NSIA Insurance',
    logo: '🛡',
    rating: 4.5,
    reviews: 987,
    multiplier: 0.86,
    features: ['Fleet discounts', 'Online policy management', 'NIID registered'],
    claimSettlement: '94%',
  },
  {
    id: 'zenith-motor',
    insurer: 'Zenith General Insurance',
    logo: '⚡',
    rating: 4.4,
    reviews: 743,
    multiplier: 0.83,
    features: ['Excess waiver option', 'Courtesy car', 'NAICOM regulated'],
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
    features: ['500+ hospitals nationwide', 'Cashless treatment', 'Emergency evacuation'],
    claimSettlement: '99%',
    networkSize: '500+ hospitals',
    popular: true,
    instant: true,
  },
  {
    id: 'hygeia',
    insurer: 'Hygeia HMO',
    logo: '🏥',
    rating: 4.7,
    reviews: 2214,
    badge: 'Best network',
    multiplier: 1.05,
    features: ['700+ accredited facilities', 'Telemedicine included', 'Annual check-ups'],
    claimSettlement: '98%',
    networkSize: '700+ hospitals',
    instant: true,
  },
  {
    id: 'reliance-hmo',
    insurer: 'Reliance HMO',
    logo: '💊',
    rating: 4.6,
    reviews: 1677,
    multiplier: 0.93,
    features: ['App-based claims', '400+ hospitals', 'Maternity cover'],
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
    features: ['Inpatient & outpatient', 'Preventive care', 'Nationwide coverage'],
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
    features: ['Schengen compliant', '€50,000 medical cover', 'Trip cancellation'],
    claimSettlement: '98%',
    popular: true,
    instant: true,
  },
  {
    id: 'leadway-travel',
    insurer: 'Leadway Assurance',
    logo: '🌍',
    rating: 4.7,
    reviews: 1341,
    multiplier: 0.94,
    features: ['€30,000 medical', 'Baggage & delay', 'Flight cancellation'],
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
    features: ['Multi-trip option', 'Baggage loss', 'Repatriation cover'],
    claimSettlement: '97%',
  },
  {
    id: 'aiico-travel',
    insurer: 'AIICO Insurance',
    logo: '🏢',
    rating: 4.4,
    reviews: 612,
    multiplier: 0.82,
    features: ['Single & multi-trip', 'Medical emergency', 'Personal liability'],
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
    features: ['Business interruption', 'Employee cover', 'Priority claims desk'],
    claimSettlement: '97%',
    popular: true,
    instant: true,
  },
  {
    id: 'zenith-business',
    insurer: 'Zenith Insurance',
    logo: '⚡',
    rating: 4.6,
    reviews: 1342,
    multiplier: 0.92,
    features: ['All-risks property', 'Public liability', 'Goods in transit'],
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
    features: ['Fire & burglary', 'Machinery breakdown', 'Group personal accident'],
    claimSettlement: '95%',
  },
  {
    id: 'custodian-business',
    insurer: 'Custodian Insurance',
    logo: '🔒',
    rating: 4.4,
    reviews: 654,
    multiplier: 0.89,
    features: ['Commercial property', 'Employee liability', 'Online portal'],
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

const ADDON_OPTIONS = [
  { id: 'roadside', label: 'Roadside assistance' },
  { id: 'zero_dep', label: 'Zero depreciation' },
  { id: 'engine', label: 'Engine protection' },
  { id: 'ncb', label: 'No claim bonus protect' },
]

// ── Horizontal plan card (PolicyBazaar style) ────────────────────────────────
function PlanCard({ plan, basePrice, color, index, compareSelected, onToggleCompare, canCompare, onChoose }: {
  plan: Plan
  basePrice: number
  color: { main: string; light: string; text: string }
  index: number
  compareSelected: boolean
  onToggleCompare: (id: string) => void
  canCompare: boolean
  onChoose: () => void
}) {
  const price = Math.round(basePrice * plan.multiplier)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow duration-200"
      style={{ borderColor: plan.popular ? color.main : 'var(--border-default)' }}
    >
      {/* Instant policy badge */}
      {plan.instant && (
        <div className="px-4 pt-3 pb-0">
          <span className="inline-flex items-center gap-1 font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full" style={{ backgroundColor: '#DCFCE7', color: '#15803D' }}>
            ⚡ Instant policy issuance
          </span>
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Main horizontal layout */}
        <div className="flex gap-4">
          {/* Left: logo + insurer + rating + claim */}
          <div className="flex flex-col gap-2 w-[140px] sm:w-[160px] shrink-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: color.light }}>
              {plan.logo}
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <h3 className="font-display font-bold text-[14px] leading-tight" style={{ color: 'var(--text-primary)' }}>{plan.insurer}</h3>
              </div>
              {plan.badge && (
                <span className="inline-block font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full mb-1" style={{ backgroundColor: color.light, color: color.text }}>
                  {plan.badge}
                </span>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" style={{ color: '#F59E0B' }} />
                <span className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-secondary)' }}>{plan.rating}</span>
                <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>({plan.reviews.toLocaleString()})</span>
              </div>
              <div className="mt-1">
                <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>Claim: </span>
                <span className="font-sans font-bold text-[11px]" style={{ color: 'var(--green-700)' }}>{plan.claimSettlement}</span>
              </div>
            </div>
          </div>

          {/* Middle: features */}
          <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
            {plan.features.slice(0, 3).map(f => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: color.light }}>
                  <Check className="w-2.5 h-2.5" style={{ color: color.main }} strokeWidth={3} />
                </div>
                <span className="font-sans text-[12px] truncate" style={{ color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className="w-3 h-3 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>NIID auto-registered</span>
            </div>
          </div>

          {/* Right: price + CTA */}
          <div className="flex flex-col items-end justify-between gap-3 shrink-0 w-[120px] sm:w-[140px]">
            <div className="text-right">
              <p className="font-display font-extrabold text-[24px] leading-none" style={{ color: color.main }}>
                {formatNaira(price)}
              </p>
              <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>/year</p>
            </div>
            <button
              type="button"
              onClick={onChoose}
              className="w-full h-10 rounded-xl font-sans font-semibold text-[13px] text-white transition-all hover:-translate-y-px hover:shadow-md"
              style={{ backgroundColor: color.main }}
            >
              Buy plan →
            </button>
          </div>
        </div>

        {/* Compare toggle */}
        <div className="flex items-center mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            type="button"
            aria-label={compareSelected ? 'Remove from comparison' : 'Add to comparison'}
            disabled={!canCompare}
            onClick={() => onToggleCompare(plan.id)}
            className="flex items-center gap-1.5 font-sans text-[11px] font-medium transition-all disabled:opacity-40"
            style={{ color: compareSelected ? color.main : 'var(--text-muted)' }}
          >
            <span
              className="w-4 h-4 rounded-sm border flex items-center justify-center transition-all"
              style={compareSelected
                ? { backgroundColor: color.main, borderColor: color.main }
                : { backgroundColor: 'transparent', borderColor: 'var(--border-medium)' }
              }
            >
              {compareSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </span>
            Add to compare
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Compare modal ────────────────────────────────────────────────────────────
function CompareModal({ plans, basePrice, color, onClose, onChoosePlan }: {
  plans: Plan[]
  basePrice: number
  color: { main: string; light: string; text: string }
  onClose: () => void
  onChoosePlan: (planId: string) => void
}) {
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
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[var(--border-medium)]" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4" style={{ color: color.main }} />
            <h2 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>Compare Plans</h2>
          </div>
          <button type="button" onClick={onClose} className="text-[var(--text-subtle)] hover:text-[var(--text-muted)]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-auto flex-1 px-4 py-4">
          <table className="w-full border-collapse" style={{ minWidth: `${plans.length * 160 + 120}px` }}>
            <thead>
              <tr>
                <th className="text-left font-sans text-[11px] uppercase tracking-wide pb-3 pr-4 w-[120px]" style={{ color: 'var(--text-muted)' }}>Feature</th>
                {plans.map(plan => {
                  const price = Math.round(basePrice * plan.multiplier)
                  return (
                    <th key={plan.id} className="pb-3 px-2 text-center" style={{ minWidth: '140px' }}>
                      <div className="flex flex-col items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onChoosePlan(plan.id)}
                          className="w-full h-9 rounded-xl font-sans font-semibold text-[13px] text-white transition-all hover:-translate-y-px hover:shadow-md"
                          style={{ backgroundColor: color.main }}
                        >
                          Choose plan →
                        </button>
                        <span className="text-2xl mt-1">{plan.logo}</span>
                        <span className="font-display font-bold text-[13px] leading-tight" style={{ color: 'var(--text-primary)' }}>{plan.insurer}</span>
                        <span className="font-display font-extrabold text-base" style={{ color: color.main }}>{formatNaira(price)}</span>
                        <span className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>per year</span>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[var(--border-subtle)]">
                <td className="py-2.5 pr-4 font-sans text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Annual Premium</td>
                {plans.map(plan => (
                  <td key={plan.id} className="py-2.5 px-2 text-center font-display font-bold text-sm" style={{ color: color.main }}>
                    {formatNaira(Math.round(basePrice * plan.multiplier))}
                  </td>
                ))}
              </tr>
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
              <tr className="border-t border-[var(--border-subtle)]">
                <td className="py-2.5 pr-4 font-sans text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>Claim Settlement</td>
                {plans.map(plan => (
                  <td key={plan.id} className="py-2.5 px-2 text-center font-sans font-semibold text-[13px]" style={{ color: 'var(--green-700)' }}>
                    {plan.claimSettlement}
                  </td>
                ))}
              </tr>
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

// ── Save email modal ─────────────────────────────────────────────────────────
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

// ── Main page ────────────────────────────────────────────────────────────────
export default function QuoteResultPage() {
  const { calculatedPremium, activeProduct, motorData, updateMotor, setStep } = useQuoteStore()
  const router = useRouter()
  const [sortBy, setSortBy] = useState<SortKey>('popular')
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all')
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  function toggleCompare(id: string) {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length < 3) return [...prev, id]
      return prev
    })
  }

  function toggleAddon(id: string) {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function handleChoosePlan(planId: string) {
    if (activeProduct === 'motor') {
      updateMotor({ selectedUnderwriter: planId })
      setStep('motor', 2)
      router.push('/quote/motor')
    } else {
      router.push('/quote/checkout')
    }
  }

  const product = (activeProduct ?? 'motor') as string
  const basePrice = calculatedPremium ?? 50000
  const color = PRODUCT_COLORS[product] ?? PRODUCT_COLORS.motor
  const rawPlans = PLANS_BY_PRODUCT[product] ?? MOTOR_PLANS

  const plans = [...rawPlans]
    .filter(p => {
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

  // Quote summary from store
  const coverLabel = motorData.coverType === 'comprehensive' ? 'Comprehensive'
    : motorData.coverType === 'tpo' ? 'Third Party'
    : motorData.coverType === 'tpft' ? 'TPFT'
    : 'Motor'

  const idvLabel = motorData.marketValueRange
    ? formatNaira(Number(motorData.marketValueRange))
    : null

  const summaryParts = [
    motorData.vehicleMakeModel || 'Motor',
    coverLabel,
    idvLabel ? `${idvLabel} IDV` : null,
    motorData.geographicalState || null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--page-bg)' }}>

      {/* ── Top header band ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[var(--border-default)]">
        <div className="max-w-[1180px] mx-auto px-5 lg:px-8 py-5">
          <Link
            href={`/quote/${product}`}
            className="inline-flex items-center gap-1.5 font-sans text-sm mb-3 hover:underline"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to quote form
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-extrabold text-[26px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
                Motor insurance plans
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)]">
                  <span className="text-base">🚗</span>
                  <span className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {summaryParts}
                  </span>
                </div>
                <Link
                  href={`/quote/${product}`}
                  className="inline-flex items-center gap-1.5 font-sans text-[13px] font-medium hover:underline"
                  style={{ color: color.main }}
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit quote
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}>
              <Shield className="w-4 h-4" style={{ color: 'var(--green-700)' }} />
              <span className="font-sans font-medium text-sm" style={{ color: 'var(--green-700)' }}>All NAICOM licensed</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile filter bar ────────────────────────────────────────────── */}
      <div className="lg:hidden bg-white border-b border-[var(--border-default)] overflow-x-auto">
        <div className="flex items-center gap-2 px-4 py-3 w-max">
          <SlidersHorizontal className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
          <span className="font-sans text-[12px] font-medium shrink-0 mr-1" style={{ color: 'var(--text-muted)' }}>Sort:</span>
          {([['popular', 'Popular'], ['price', 'Price'], ['rating', 'Rating']] as [SortKey, string][]).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setSortBy(key)}
              className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border shrink-0"
              style={sortBy === key
                ? { backgroundColor: color.main, color: 'white', borderColor: color.main }
                : { backgroundColor: 'white', color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }
              }
            >{label}</button>
          ))}
          <div className="w-px h-5 shrink-0" style={{ backgroundColor: 'var(--border-medium)' }} />
          <span className="font-sans text-[12px] font-medium shrink-0 mr-1" style={{ color: 'var(--text-muted)' }}>Rating:</span>
          {([['all', 'Any'], ['4.5', '4.5+'], ['4.7', '4.7+']] as [RatingFilter, string][]).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setRatingFilter(key)}
              className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border shrink-0"
              style={ratingFilter === key
                ? { backgroundColor: color.main, color: 'white', borderColor: color.main }
                : { backgroundColor: 'white', color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }
              }
            >{label}</button>
          ))}
        </div>
      </div>

      {/* ── Two-column layout ────────────────────────────────────────────── */}
      <div className="max-w-[1180px] mx-auto px-5 lg:px-8 py-6 flex gap-6 items-start">

        {/* ── LEFT SIDEBAR (desktop only, sticky) ─────────────────────── */}
        <aside className="hidden lg:flex flex-col gap-4 w-[260px] shrink-0 sticky top-6">

          {/* Quote details */}
          <div className="bg-white rounded-2xl border border-[var(--border-default)] overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
              <p className="font-display font-bold text-[14px]" style={{ color: 'var(--text-primary)' }}>Quote details</p>
            </div>
            <div className="px-4 py-3 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🚗</span>
                <div>
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                    {motorData.vehicleMakeModel || 'Your vehicle'}{motorData.yearOfManufacture ? ` ${motorData.yearOfManufacture}` : ''}
                  </p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {[motorData.registrationNumber, motorData.useType?.replace('_', ' ')].filter(Boolean).join(' · ') || 'Motor insurance'}
                  </p>
                </div>
              </div>
              {idvLabel && (
                <div>
                  <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>IDV: </span>
                  <span className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-primary)' }}>{idvLabel}</span>
                </div>
              )}
              {motorData.coverType && (
                <div>
                  <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>Cover: </span>
                  <span className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-primary)' }}>{coverLabel}</span>
                </div>
              )}
              {motorData.geographicalState && (
                <div>
                  <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>State: </span>
                  <span className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-primary)' }}>{motorData.geographicalState}</span>
                </div>
              )}
              <Link
                href={`/quote/${product}`}
                className="inline-flex items-center gap-1.5 font-sans text-[12px] font-medium mt-1 hover:underline"
                style={{ color: color.main }}
              >
                <Pencil className="w-3 h-3" /> Edit quote
              </Link>
            </div>
          </div>

          {/* Sort by */}
          <div className="bg-white rounded-2xl border border-[var(--border-default)] px-4 py-3">
            <p className="font-display font-bold text-[13px] mb-3" style={{ color: 'var(--text-primary)' }}>Sort by</p>
            <div className="space-y-2">
              {([['popular', 'Popular'], ['price', 'Price — Low to high'], ['rating', 'Rating']] as [SortKey, string][]).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                  <span
                    className="w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0"
                    style={sortBy === key
                      ? { borderColor: color.main, backgroundColor: color.main }
                      : { borderColor: 'var(--border-medium)', backgroundColor: 'white' }
                    }
                  >
                    {sortBy === key && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <button type="button" onClick={() => setSortBy(key)} className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Rating filter */}
          <div className="bg-white rounded-2xl border border-[var(--border-default)] px-4 py-3">
            <p className="font-display font-bold text-[13px] mb-3" style={{ color: 'var(--text-primary)' }}>Min rating</p>
            <div className="space-y-2">
              {([['all', 'Any rating'], ['4.5', '4.5+ stars'], ['4.7', '4.7+ stars']] as [RatingFilter, string][]).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                  <span
                    className="w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0"
                    style={ratingFilter === key
                      ? { borderColor: color.main, backgroundColor: color.main }
                      : { borderColor: 'var(--border-medium)', backgroundColor: 'white' }
                    }
                  >
                    {ratingFilter === key && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <button type="button" onClick={() => setRatingFilter(key)} className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          <div className="bg-white rounded-2xl border border-[var(--border-default)] px-4 py-3">
            <p className="font-display font-bold text-[13px] mb-3" style={{ color: 'var(--text-primary)' }}>Add-ons included</p>
            <div className="space-y-2.5">
              {ADDON_OPTIONS.map(addon => (
                <label key={addon.id} className="flex items-center gap-2.5 cursor-pointer">
                  <span
                    className="w-4 h-4 rounded border-[1.5px] flex items-center justify-center shrink-0"
                    style={selectedAddons.includes(addon.id)
                      ? { borderColor: color.main, backgroundColor: color.main }
                      : { borderColor: 'var(--border-medium)', backgroundColor: 'white' }
                    }
                    onClick={() => toggleAddon(addon.id)}
                  >
                    {selectedAddons.includes(addon.id) && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                  </span>
                  <button type="button" onClick={() => toggleAddon(addon.id)} className="font-sans text-[13px] text-left" style={{ color: 'var(--text-secondary)' }}>
                    {addon.label}
                  </button>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Results header */}
          <div className="mb-4">
            <p className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>
              {plans.length} {coverLabel} plans starting from {formatNaira(lowestPrice)}/yr
            </p>
            <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Sorted by popularity · All NAICOM licensed
              {ratingFilter !== 'all' && (
                <button type="button" onClick={() => setRatingFilter('all')}
                  className="ml-2 font-semibold underline" style={{ color: color.main }}>
                  Clear filter
                </button>
              )}
            </p>
          </div>

          {/* Plan cards */}
          {plans.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-[var(--border-default)] p-12 text-center"
            >
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No plans match your filters</h3>
              <p className="font-sans text-[14px] mb-5" style={{ color: 'var(--text-muted)' }}>Try lowering the minimum rating filter.</p>
              <button
                type="button"
                onClick={() => setRatingFilter('all')}
                className="h-10 px-5 rounded-xl font-sans font-semibold text-sm text-white"
                style={{ backgroundColor: color.main }}
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
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
                  onChoose={() => handleChoosePlan(plan.id)}
                />
              ))}
            </div>
          )}

          {/* Save quote CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-5 flex items-center justify-center gap-3 flex-wrap"
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
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 rounded-2xl border border-[var(--border-default)] bg-white flex flex-wrap items-center justify-center gap-5"
          >
            {[
              { icon: '🔒', label: '256-bit SSL encryption' },
              { icon: '📋', label: 'NAICOM regulated insurers' },
              { icon: '⚡', label: 'Certificate within minutes' },
              { icon: '📞', label: '24/7 claims support' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-base">{icon}</span>
                <span className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Floating compare bar ─────────────────────────────────────────── */}
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

      {/* ── Save-to-email modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showEmailModal && <SaveEmailModal onClose={() => setShowEmailModal(false)} lowestPrice={lowestPrice} />}
      </AnimatePresence>

      {/* ── Compare modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showCompare && (
          <CompareModal
            plans={rawPlans.filter(p => compareIds.includes(p.id))}
            basePrice={basePrice}
            color={color}
            onClose={() => setShowCompare(false)}
            onChoosePlan={handleChoosePlan}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
