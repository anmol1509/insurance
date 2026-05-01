'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuoteStore } from '@/store/quoteStore'
import { formatNaira } from '@/lib/formatters'
import { Shield, Star, ChevronDown, ChevronUp, SlidersHorizontal, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

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

function PlanCard({ plan, basePrice, color, index }: {
  plan: Plan
  basePrice: number
  color: { main: string; light: string; text: string }
  index: number
}) {
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

export default function QuoteResultPage() {
  const { calculatedPremium, activeProduct } = useQuoteStore()
  const [sortBy, setSortBy] = useState<SortKey>('popular')

  const product = (activeProduct ?? 'motor') as string
  const basePrice = calculatedPremium ?? 50000
  const color = PRODUCT_COLORS[product] ?? PRODUCT_COLORS.motor
  const rawPlans = PLANS_BY_PRODUCT[product] ?? MOTOR_PLANS

  const plans = [...rawPlans].sort((a, b) => {
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
        {/* Sort bar */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>Sort by:</span>
          {([['popular', 'Most popular'], ['price', 'Lowest price'], ['rating', 'Highest rated']] as [SortKey, string][]).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSortBy(key)}
              className="h-8 px-3.5 rounded-full font-sans text-[13px] font-medium transition-all border"
              style={sortBy === key
                ? { backgroundColor: color.main, color: 'white', borderColor: color.main }
                : { backgroundColor: 'white', color: 'var(--text-secondary)', borderColor: 'var(--border-medium)' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Plan cards */}
        <div className="flex flex-col gap-4">
          {plans.map((plan, i) => (
            <PlanCard key={plan.id} plan={plan} basePrice={basePrice} color={color} index={i} />
          ))}
        </div>

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
    </div>
  )
}
