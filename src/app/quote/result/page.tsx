'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuoteStore } from '@/store/quoteStore'
import { formatNaira } from '@/lib/formatters'
import { Shield, Star, ArrowLeft, Check, GitCompare, X, FileText, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import { MOTOR_PLANS } from '@/lib/motorPlans'
import type { MotorPlan } from '@/lib/motorPlans'

type SortKey = 'popular' | 'price' | 'rating'

interface Plan {
  id: string
  name: string
  insurer: string
  logo?: string
  coverType: string
  rating: number
  reviews: number
  badge?: string
  multiplier: number
  features: string[]
  exclusions: string[]
  claimSettlement: string
  responseTime: string
  popular?: boolean
}

const MEDICAL_PLANS: Plan[] = [
  {
    id: 'hygeia-individual',
    name: 'Hygeia HMO Individual',
    insurer: 'Hygeia HMO',
    coverType: 'individual',
    rating: 4.8,
    reviews: 3120,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['700+ accredited hospitals', 'Outpatient & inpatient cover', 'Maternity benefit', 'Dental & optical', 'Emergency evacuation', 'Free annual check-up'],
    exclusions: ['Cosmetic surgery', 'Pre-existing conditions (first 6 months)', 'Self-inflicted injuries', 'Experimental treatment'],
    claimSettlement: '97%',
    responseTime: '24 hours',
    popular: true,
  },
  {
    id: 'axa-family',
    name: 'AXA Mansard Family Care',
    insurer: 'AXA Mansard Health',
    coverType: 'family',
    rating: 4.7,
    reviews: 2480,
    badge: 'Best value',
    multiplier: 0.88,
    features: ['Covers up to 6 dependants', '500+ hospital network', 'Cashless claims', 'Maternity & newborn cover', '24/7 teleconsultation', 'Preventive care'],
    exclusions: ['Cosmetic procedures', 'War-related injuries', 'Substance abuse treatment', 'Infertility treatment'],
    claimSettlement: '95%',
    responseTime: '48 hours',
  },
  {
    id: 'leadway-premium',
    name: 'Leadway Health Premium',
    insurer: 'Leadway Assurance',
    coverType: 'premium',
    rating: 4.6,
    reviews: 1870,
    multiplier: 1.15,
    features: ['International coverage', '900+ hospital network', 'Private ward access', 'Specialist consultations', 'Chronic disease management', 'Annual wellness exam'],
    exclusions: ['Cosmetic surgery', 'Organ transplant (first year)', 'Hearing aids', 'Fertility treatments'],
    claimSettlement: '96%',
    responseTime: '24 hours',
  },
  {
    id: 'reliance-basic',
    name: 'Reliance HMO Basic',
    insurer: 'Reliance HMO',
    coverType: 'individual',
    rating: 4.4,
    reviews: 1240,
    multiplier: 0.52,
    features: ['300+ hospital network', 'Outpatient consultations', 'Basic diagnostics', 'Emergency care', 'NHIA compliant'],
    exclusions: ['Specialist referrals', 'Maternity benefit', 'Dental & optical', 'Surgery (non-emergency)'],
    claimSettlement: '93%',
    responseTime: '48 hours',
  },
]

const TRAVEL_PLANS: Plan[] = [
  {
    id: 'aiico-schengen',
    name: 'AIICO Schengen Standard',
    insurer: 'AIICO Insurance',
    coverType: 'schengen',
    rating: 4.8,
    reviews: 1950,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['€30,000 medical cover', 'Schengen visa compliant', 'Trip cancellation cover', 'Lost baggage up to €500', 'Flight delay compensation', 'Certificate in 5 minutes'],
    exclusions: ['Pre-existing conditions', 'Adventure sports', 'War zones', 'Intentional self-harm'],
    claimSettlement: '97%',
    responseTime: '24 hours',
    popular: true,
  },
  {
    id: 'nsia-worldwide',
    name: 'NSIA Worldwide Cover',
    insurer: 'NSIA Insurance',
    coverType: 'worldwide',
    rating: 4.7,
    reviews: 1320,
    badge: 'Best value',
    multiplier: 0.85,
    features: ['$50,000 medical cover', 'Global coverage incl. USA/Canada', 'Emergency evacuation', 'Personal liability cover', 'Lost passport assistance', '24/7 emergency helpline'],
    exclusions: ['Pre-existing conditions', 'Extreme sports', 'Pandemics (optional add-on)', 'Business travel'],
    claimSettlement: '95%',
    responseTime: '48 hours',
  },
  {
    id: 'axa-premium-travel',
    name: 'AXA Travel Premium',
    insurer: 'AXA Mansard',
    coverType: 'worldwide',
    rating: 4.6,
    reviews: 980,
    multiplier: 1.22,
    features: ['€100,000 medical cover', 'Business travel included', 'Cancel for any reason', 'Electronic device cover', 'Emergency dental', 'Concierge service'],
    exclusions: ['Suicide or self-harm', 'Drug/alcohol related', 'Illegal activities', 'Known events at booking'],
    claimSettlement: '96%',
    responseTime: '24 hours',
  },
  {
    id: 'leadway-basic-travel',
    name: 'Leadway Travel Basic',
    insurer: 'Leadway Assurance',
    coverType: 'schengen',
    rating: 4.4,
    reviews: 760,
    multiplier: 0.60,
    features: ['€30,000 medical cover', 'Schengen visa compliant', 'Emergency hospitalisation', 'Repatriation cover', 'NAICOM licensed'],
    exclusions: ['Trip cancellation', 'Baggage loss', 'Pre-existing conditions', 'Adventure activities'],
    claimSettlement: '92%',
    responseTime: '48 hours',
  },
]

const BUSINESS_PLANS: Plan[] = [
  {
    id: 'aiico-business-comp',
    name: 'AIICO Business Comprehensive',
    insurer: 'AIICO Insurance',
    coverType: 'comprehensive',
    rating: 4.8,
    reviews: 1430,
    badge: 'Most popular',
    multiplier: 1.0,
    features: ['Fire & allied perils', 'Burglary & theft', 'Public liability cover', 'Employer\'s liability', 'Business interruption', 'Electronic equipment cover'],
    exclusions: ['Gradual deterioration', 'War & terrorism', 'Nuclear risk', 'Intentional damage by owner'],
    claimSettlement: '96%',
    responseTime: '48 hours',
    popular: true,
  },
  {
    id: 'leadway-sme',
    name: 'Leadway SME Shield',
    insurer: 'Leadway Assurance',
    coverType: 'standard',
    rating: 4.7,
    reviews: 1180,
    badge: 'Best value',
    multiplier: 0.87,
    features: ['Fire & building cover', 'Stock & inventory cover', 'Money in transit', 'Fidelity guarantee', 'Glass breakage', 'Goods in transit'],
    exclusions: ['Mechanical breakdown', 'War & civil unrest', 'Wear & tear', 'Cyber attacks'],
    claimSettlement: '94%',
    responseTime: '48 hours',
  },
  {
    id: 'nsia-business',
    name: 'NSIA Business Plus',
    insurer: 'NSIA Insurance',
    coverType: 'comprehensive',
    rating: 4.6,
    reviews: 870,
    multiplier: 1.12,
    features: ['All-risk property cover', 'Product liability', 'Directors & officers liability', 'Cyber liability add-on', 'Business travel cover', 'Key person insurance'],
    exclusions: ['Pre-existing structural defects', 'Pollution liability', 'Nuclear risk', 'Intentional acts'],
    claimSettlement: '95%',
    responseTime: '24 hours',
  },
  {
    id: 'axa-business-basic',
    name: 'AXA Business Starter',
    insurer: 'AXA Mansard',
    coverType: 'standard',
    rating: 4.4,
    reviews: 640,
    multiplier: 0.65,
    features: ['Fire & allied perils', 'Burglary cover', 'Public liability (basic)', 'NAICOM licensed', 'Online policy management'],
    exclusions: ['Business interruption', 'Electronic equipment', 'Goods in transit', 'Employer\'s liability'],
    claimSettlement: '92%',
    responseTime: '72 hours',
  },
]

const ALL_PLANS: Record<string, Plan[]> = {
  motor: MOTOR_PLANS,
  medical: MEDICAL_PLANS,
  travel: TRAVEL_PLANS,
  business: BUSINESS_PLANS,
}

const COVER_TYPE_LABELS: Record<string, string> = {
  comprehensive: 'Comprehensive',
  tpo: 'Third Party Only',
  individual: 'Individual Plan',
  family: 'Family Plan',
  premium: 'Premium Plan',
  schengen: 'Schengen / Europe',
  worldwide: 'Worldwide Cover',
  standard: 'Standard Cover',
}

const PRODUCT_COVER_TYPES: Record<string, string[]> = {
  motor:    ['comprehensive', 'tpo'],
  medical:  ['individual', 'family', 'premium'],
  travel:   ['schengen', 'worldwide'],
  business: ['standard', 'comprehensive'],
}

const PRODUCT_FEATURE_FILTERS: Record<string, string[]> = {
  motor:    ['Roadside Assist', 'Towing', 'NIID Registered', 'Windscreen Cover'],
  medical:  ['Maternity Cover', 'Dental & Optical', 'International Cover', 'Teleconsultation'],
  travel:   ['Trip Cancellation', 'Baggage Cover', 'Emergency Evacuation', 'Flight Delay'],
  business: ['Fire Cover', 'Burglary Cover', 'Public Liability', 'Business Interruption'],
}

const PRODUCT_COLORS: Record<string, { main: string; light: string; text: string }> = {
  motor:    { main: 'var(--motor-600)',    light: 'var(--motor-50)',    text: 'var(--motor-700)' },
  medical:  { main: 'var(--medical-600)',  light: 'var(--medical-50)',  text: 'var(--medical-700)' },
  travel:   { main: 'var(--travel-600)',   light: 'var(--travel-50)',   text: 'var(--travel-700)' },
  business: { main: 'var(--business-600)', light: 'var(--business-50)', text: 'var(--business-700)' },
}


function PlanCard({
  plan, basePrice, color, index, compareSelected, onToggleCompare, canCompare, onSelect,
}: {
  plan: Plan
  basePrice: number
  color: { main: string; light: string; text: string }
  index: number
  compareSelected: boolean
  onToggleCompare: (id: string) => void
  canCompare: boolean
  onSelect: (plan: Plan) => void
}) {
  const [activeTab, setActiveTab] = useState<'highlights' | 'exclusions'>('highlights')
  const [showAll, setShowAll] = useState(false)
  const price = Math.round(basePrice * plan.multiplier)
  const displayFeatures = showAll ? plan.features : plan.features.slice(0, 6)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: plan.popular ? color.main : 'var(--border-default)', borderWidth: plan.popular ? '1.5px' : '1px' }}
    >
      {plan.popular && (
        <div className="h-1 w-full" style={{ backgroundColor: color.main }} />
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full border"
              style={{ color: color.main, borderColor: color.main, backgroundColor: color.light }}
            >
              {COVER_TYPE_LABELS[plan.coverType]}
            </span>
            {plan.badge && (
              <span className="font-sans font-semibold text-[11px] px-2.5 py-1 rounded-full bg-[var(--green-50)] text-[var(--green-700)] border border-[var(--green-100)]">
                {plan.badge}
              </span>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-display font-extrabold text-[22px] leading-none" style={{ color: color.main }}>
              {formatNaira(price)}
            </p>
            <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>/yr · excl. taxes</p>
          </div>
        </div>

        <div className="mb-4 flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden bg-white p-1.5" style={{ borderColor: 'var(--border-subtle)' }}>
            {plan.logo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={plan.logo} alt={plan.insurer} className="w-full h-full object-contain" />
              : <span className="font-display font-bold text-[13px]" style={{ color: color.main }}>{plan.insurer.slice(0, 2).toUpperCase()}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-[17px] leading-tight" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{plan.insurer}</span>
              <span className="w-1 h-1 rounded-full bg-[var(--border-medium)]" />
              <Star className="w-3 h-3 fill-current" style={{ color: '#F59E0B' }} />
              <span className="font-sans text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{plan.rating}</span>
              <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>({plan.reviews.toLocaleString()})</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 py-3 border-y border-[var(--border-subtle)] mb-4">
          {[
            { label: 'CLAIM SETTLEMENT', value: plan.claimSettlement },
            { label: 'RESPONSE TIME', value: plan.responseTime },
            { label: 'COVER', value: COVER_TYPE_LABELS[plan.coverType].split(' ')[0] },
            { label: 'NAICOM', value: 'Licensed' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="font-sans font-bold text-[9px] uppercase tracking-[0.06em] mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
              <p className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-primary)' }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-5 border-b border-[var(--border-subtle)] mb-3">
          {(['highlights', 'exclusions'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className="pb-2 font-sans font-medium text-[13px] capitalize transition-colors border-b-2 -mb-px"
              style={{
                color: activeTab === tab ? color.main : 'var(--text-muted)',
                borderBottomColor: activeTab === tab ? color.main : 'transparent',
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
                style={{ backgroundColor: activeTab === 'highlights' ? color.light : '#fef2f2' }}
              >
                {activeTab === 'highlights'
                  ? <Check className="w-2.5 h-2.5" style={{ color: color.main }} strokeWidth={3} />
                  : <X className="w-2.5 h-2.5" style={{ color: '#ef4444' }} strokeWidth={3} />}
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
            style={{ color: color.main }}
          >
            {showAll ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> Show all {plan.features.length} features</>}
          </button>
        )}

        <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)] flex-wrap">
          <button
            type="button"
            disabled={!canCompare}
            onClick={() => onToggleCompare(plan.id)}
            className="flex items-center gap-1.5 font-sans text-[12px] font-medium transition-all disabled:opacity-40 mr-auto"
            style={{ color: compareSelected ? color.main : 'var(--text-muted)' }}
          >
            <span
              className="w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-all"
              style={compareSelected
                ? { backgroundColor: color.main, borderColor: color.main }
                : { borderColor: 'var(--border-medium)' }}
            >
              {compareSelected && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
            </span>
            Add to Compare
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border font-sans text-[12px] font-medium transition-colors hover:bg-[var(--surface-raised)]"
            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
          >
            <FileText className="w-3.5 h-3.5" />
            Policy Doc
          </button>

          <button
            type="button"
            onClick={() => onSelect(plan)}
            className="flex items-center gap-1.5 h-9 px-5 rounded-lg font-sans font-semibold text-[13px] text-white transition-all hover:-translate-y-px hover:shadow-md"
            style={{ backgroundColor: color.main }}
          >
            Select Plan →
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function SaveEmailModal({ onClose, lowestPrice }: { onClose: () => void; lowestPrice: number }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18 }}
        className="relative bg-white rounded-2xl shadow-2xl p-7 w-full max-w-[400px]"
        onClick={e => e.stopPropagation()}
      >
        <button type="button" onClick={onClose} className="absolute top-4 right-4" style={{ color: 'var(--text-muted)' }}>
          <X className="w-5 h-5" />
        </button>
        {sent ? (
          <div className="text-center py-3">
            <div className="w-12 h-12 rounded-full bg-[var(--green-50)] flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-[var(--green-700)]" />
            </div>
            <h3 className="font-display font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Quote sent!</h3>
            <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>Check your inbox — valid for 24 hours.</p>
            <button type="button" onClick={onClose} className="mt-5 h-10 px-6 rounded-xl font-sans font-semibold text-sm text-white" style={{ backgroundColor: 'var(--green-700)' }}>Done</button>
          </div>
        ) : (
          <>
            <h3 className="font-display font-bold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Save your quote</h3>
            <p className="font-sans text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
              We'll email results from {formatNaira(lowestPrice)}/yr so you can compare later.
            </p>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 rounded-xl border-[1.5px] border-[var(--border-medium)] px-4 font-sans text-[13px] outline-none mb-3 focus:border-[var(--green-700)]"
            />
            <button
              type="button" onClick={() => setSent(true)} disabled={!email.includes('@')}
              className="w-full h-10 rounded-xl font-sans font-semibold text-sm text-white disabled:opacity-40"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              Send to email
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}

function CompareModal({ plans, basePrice, color, onClose, onSelect }: {
  plans: Plan[]; basePrice: number; color: { main: string; light: string; text: string }; onClose: () => void; onSelect: (p: Plan) => void
}) {
  const allFeatures = Array.from(new Set(plans.flatMap(p => p.features)))
  const allExclusions = Array.from(new Set(plans.flatMap(p => p.exclusions)))
  const colW = 180
  const labelW = 150

  const KEY_METRICS: { label: string; getValue: (p: Plan) => string }[] = [
    { label: 'Annual Premium', getValue: p => formatNaira(Math.round(basePrice * p.multiplier)) + '/yr' },
    { label: 'Claim Settlement', getValue: p => p.claimSettlement },
    { label: 'Response Time', getValue: p => p.responseTime },
    { label: 'Rating', getValue: p => `${p.rating} ★  (${p.reviews.toLocaleString()} reviews)` },
    { label: 'Cover Type', getValue: p => COVER_TYPE_LABELS[p.coverType] },
    { label: 'NAICOM Licensed', getValue: () => 'Yes' },
  ]

  function SectionLabel({ label }: { label: string }) {
    return (
      <div className="flex items-center gap-3 py-2.5 mt-1" style={{ minWidth: `${labelW + colW * plans.length}px` }}>
        <span className="font-sans font-bold text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
      </div>
    )
  }

  function Row({ label, children, shade }: { label: string; children: React.ReactNode; shade?: boolean }) {
    return (
      <div
        className="flex items-center gap-0 rounded-lg"
        style={{ minWidth: `${labelW + colW * plans.length}px`, backgroundColor: shade ? 'var(--surface-raised)' : 'transparent' }}
      >
        <div style={{ width: labelW, minWidth: labelW }} className="py-2.5 pr-4 shrink-0">
          <span className="font-sans text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</span>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="relative mt-auto bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[var(--border-medium)]" />
        </div>

        <div className="flex items-center justify-between px-5 py-2.5 border-b border-[var(--border-subtle)] shrink-0">
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4" style={{ color: color.main }} />
            <h2 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>Compare Plans</h2>
          </div>
          <button type="button" onClick={onClose} style={{ color: 'var(--text-muted)' }}><X className="w-5 h-5" /></button>
        </div>

        <div className="shrink-0 bg-white border-b border-[var(--border-default)] px-5 py-4 overflow-x-auto">
          <div className="flex gap-0" style={{ minWidth: `${labelW + colW * plans.length}px` }}>
            <div style={{ width: labelW, minWidth: labelW }} className="shrink-0" />
            {plans.map((p, i) => {
              const price = Math.round(basePrice * p.multiplier)
              const isFirst = i === 0
              return (
                <div
                  key={p.id}
                  className="flex flex-col gap-1.5 px-4 py-3 rounded-2xl"
                  style={{
                    width: colW, minWidth: colW,
                    backgroundColor: isFirst ? color.light : 'var(--surface-raised)',
                  }}
                >
                  {p.badge && (
                    <span
                      className="font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full w-fit"
                      style={{ backgroundColor: isFirst ? color.main : 'var(--border-medium)', color: 'white' }}
                    >
                      {p.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 overflow-hidden bg-white p-1" style={{ borderColor: 'var(--border-subtle)' }}>
                      {p.logo
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={p.logo} alt={p.insurer} className="w-full h-full object-contain" />
                        : <span className="font-display font-bold text-[10px]" style={{ color: color.main }}>{p.insurer.slice(0, 2).toUpperCase()}</span>
                      }
                    </div>
                    <div>
                      <p className="font-display font-bold text-[13px] leading-tight" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                      <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.insurer}</p>
                    </div>
                  </div>
                  <p className="font-display font-extrabold text-[18px] leading-none" style={{ color: color.main }}>
                    {formatNaira(price)}
                  </p>
                  <p className="font-sans text-[10px] -mt-1" style={{ color: 'var(--text-muted)' }}>/yr · excl. taxes</p>
                  <button
                    type="button"
                    onClick={() => onSelect(p)}
                    className="mt-1 h-9 w-full rounded-xl font-sans font-semibold text-[12px] text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: color.main }}
                  >
                    Select Plan →
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="overflow-auto flex-1 px-5 py-3">
          <SectionLabel label="Key Metrics" />
          {KEY_METRICS.map((m, idx) => (
            <Row key={m.label} label={m.label} shade={idx % 2 === 0}>
              {plans.map(p => (
                <div key={p.id} style={{ width: colW, minWidth: colW }} className="py-2.5 px-4 text-center">
                  <span className="font-sans text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>{m.getValue(p)}</span>
                </div>
              ))}
            </Row>
          ))}

          <SectionLabel label="Features Included" />
          {allFeatures.map((f, idx) => (
            <Row key={f} label={f} shade={idx % 2 === 0}>
              {plans.map(p => (
                <div key={p.id} style={{ width: colW, minWidth: colW }} className="py-2.5 px-4 flex justify-center">
                  {p.features.includes(f)
                    ? <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: color.light }}>
                        <Check className="w-3 h-3" style={{ color: color.main }} strokeWidth={3} />
                      </div>
                    : <span className="font-sans text-[15px]" style={{ color: 'var(--border-medium)' }}>—</span>}
                </div>
              ))}
            </Row>
          ))}

          <SectionLabel label="Not Covered" />
          {allExclusions.map((e, idx) => (
            <Row key={e} label={e} shade={idx % 2 === 0}>
              {plans.map(p => (
                <div key={p.id} style={{ width: colW, minWidth: colW }} className="py-2.5 px-4 flex justify-center">
                  {p.exclusions.includes(e)
                    ? <div className="w-5 h-5 rounded-full flex items-center justify-center bg-red-50">
                        <X className="w-3 h-3 text-red-400" strokeWidth={3} />
                      </div>
                    : <span className="font-sans text-[15px]" style={{ color: 'var(--border-medium)' }}>—</span>}
                </div>
              ))}
            </Row>
          ))}

          <div className="h-6" />
        </div>
      </motion.div>
    </div>
  )
}

export default function QuoteResultPage() {
  const router = useRouter()
  const { calculatedPremium, activeProduct, motorData } = useQuoteStore()
  const [sortBy, setSortBy] = useState<SortKey>('popular')
  const [coverFilters, setCoverFilters] = useState<string[]>([])
  const [featureFilters, setFeatureFilters] = useState<string[]>([])
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)

  const product = (activeProduct ?? 'motor') as string
  const color = PRODUCT_COLORS[product] ?? PRODUCT_COLORS.motor

  useEffect(() => {
    if (product === 'motor' && motorData.coverType) {
      setCoverFilters([motorData.coverType])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const state = product === 'motor' ? (motorData.geographicalState || 'Nigeria') : 'Nigeria'

  let basePrice: number
  if (product === 'motor') {
    const carValue = motorData.carValue ?? 0
    if (motorData.coverType === 'comprehensive' && carValue > 0) {
      basePrice = Math.round(carValue * 0.05)
    } else if (motorData.coverType === 'tpo') {
      basePrice = 15000
    } else {
      basePrice = (calculatedPremium && calculatedPremium > 0) ? calculatedPremium : 50000
    }
  } else {
    basePrice = (calculatedPremium && calculatedPremium > 0) ? calculatedPremium : 50000
  }

  function toggleCoverFilter(val: string) {
    setCoverFilters(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
  }
  function toggleFeatureFilter(val: string) {
    setFeatureFilters(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
  }
  function toggleCompare(id: string) {
    setCompareIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev)
  }

  const productPlans = ALL_PLANS[product] ?? MOTOR_PLANS
  const FEATURE_FILTER_OPTIONS = PRODUCT_FEATURE_FILTERS[product] ?? PRODUCT_FEATURE_FILTERS.motor
  const COVER_TYPE_OPTIONS = PRODUCT_COVER_TYPES[product] ?? PRODUCT_COVER_TYPES.motor

  const plans = [...productPlans]
    .filter(p => {
      if (coverFilters.length && !coverFilters.includes(p.coverType)) return false
      if (featureFilters.length && !featureFilters.every(f => p.features.some(pf => pf.toLowerCase().includes(f.toLowerCase())))) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.multiplier - b.multiplier
      if (sortBy === 'rating') return b.rating - a.rating
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0)
    })

  const lowestPrice = Math.round(basePrice * Math.min(...productPlans.map(p => p.multiplier)))

  function handleSelect(_plan: Plan) {
    router.push('/quote/checkout')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b" style={{ borderColor: 'var(--border-default)' }}>
        <div className="max-w-6xl mx-auto px-5 lg:px-10 h-[60px] flex items-center gap-4">
          <Logo size={28} href="/" />

          <div className="h-5 w-px shrink-0 hidden sm:block" style={{ backgroundColor: 'var(--border-default)' }} />

          <div className="flex-1 min-w-0 flex items-baseline gap-2">
            <span className="font-display font-extrabold text-[24px] tracking-tight leading-none" style={{ color: color.main }}>
              {plans.length}
            </span>
            <span className="font-display font-bold text-[17px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
              plans available
            </span>
            <span className="hidden md:inline font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
              · compare and choose the right cover
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-end">
            <Link href={`/quote/${product}`}
              className="flex items-center gap-1.5 font-sans text-[13px] hover:underline hidden sm:flex"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Edit details
            </Link>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}>
              <Shield className="w-3.5 h-3.5" style={{ color: 'var(--green-700)' }} />
              <span className="font-sans font-medium text-[11px]" style={{ color: 'var(--green-700)' }}>NAICOM licensed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 lg:px-10 py-7">
        {/* Horizontal filter bar */}
        <div className="bg-white rounded-2xl border border-[var(--border-default)] px-4 py-3 mb-5 flex items-center gap-2 flex-wrap">
          {/* Sort pills */}
          <span className="font-sans font-bold text-[10px] uppercase tracking-[0.1em] shrink-0" style={{ color: 'var(--text-muted)' }}>Sort</span>
          {([['popular', 'Popular'], ['price', 'Lowest Price'], ['rating', 'Best Rating']] as [SortKey, string][]).map(([key, label]) => (
            <button key={key} type="button" onClick={() => setSortBy(key)}
              className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border shrink-0"
              style={sortBy === key
                ? { backgroundColor: color.main, borderColor: color.main, color: 'white' }
                : { backgroundColor: 'transparent', borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
            >
              {label}
            </button>
          ))}

          <div className="h-5 w-px shrink-0 hidden sm:block" style={{ backgroundColor: 'var(--border-subtle)' }} />

          {/* Cover type pills */}
          <span className="font-sans font-bold text-[10px] uppercase tracking-[0.1em] shrink-0" style={{ color: 'var(--text-muted)' }}>Cover</span>
          {COVER_TYPE_OPTIONS.map(key => (
            <button key={key} type="button" onClick={() => toggleCoverFilter(key)}
              className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border shrink-0"
              style={coverFilters.includes(key)
                ? { backgroundColor: color.main, borderColor: color.main, color: 'white' }
                : { backgroundColor: 'transparent', borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
            >
              {COVER_TYPE_LABELS[key] ?? key}
            </button>
          ))}

          <div className="h-5 w-px shrink-0 hidden sm:block" style={{ backgroundColor: 'var(--border-subtle)' }} />

          {/* Feature pills */}
          {FEATURE_FILTER_OPTIONS.map(f => (
            <button key={f} type="button" onClick={() => toggleFeatureFilter(f)}
              className="h-7 px-3 rounded-full font-sans text-[12px] font-medium transition-all border shrink-0"
              style={featureFilters.includes(f)
                ? { backgroundColor: color.main, borderColor: color.main, color: 'white' }
                : { backgroundColor: 'transparent', borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
            >
              {f}
            </button>
          ))}

          {/* Clear */}
          {(coverFilters.length > 0 || featureFilters.length > 0) && (
            <button type="button" onClick={() => { setCoverFilters([]); setFeatureFilters([]) }}
              className="ml-auto h-7 px-3 rounded-full font-sans text-[12px] font-medium border transition-colors hover:bg-[var(--surface-raised)] shrink-0"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
            >
              Clear
            </button>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="font-sans font-semibold text-[12px] px-3 py-1 rounded-full border"
              style={{ backgroundColor: color.light, borderColor: color.main, color: color.text }}>
              Plans for {state}
            </span>
            <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
              Starting from <strong style={{ color: color.main }}>{formatNaira(lowestPrice)}/yr</strong>
            </span>
          </div>

          {plans.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--border-default)] p-10 text-center">
              <p className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>No plans match your filters</p>
              <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>Try clearing some filters to see more options.</p>
              <button type="button" onClick={() => { setCoverFilters([]); setFeatureFilters([]) }}
                className="mt-4 h-9 px-5 rounded-xl font-sans font-semibold text-sm text-white"
                style={{ backgroundColor: color.main }}>Clear filters</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {plans.map((plan, i) => (
                <PlanCard
                  key={plan.id} plan={plan} basePrice={basePrice} color={color} index={i}
                  compareSelected={compareIds.includes(plan.id)}
                  onToggleCompare={toggleCompare}
                  canCompare={compareIds.length < 3 || compareIds.includes(plan.id)}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-5 flex items-center justify-between gap-4 flex-wrap bg-white rounded-2xl border border-[var(--border-default)] px-5 py-4"
          >
            <div className="flex flex-wrap gap-5">
              {[
                { icon: '🔒', label: '256-bit SSL' },
                { icon: '📋', label: 'NAICOM regulated' },
                { icon: '⚡', label: 'Instant certificate' },
                { icon: '📞', label: '24/7 claims support' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-[15px]">{icon}</span>
                  <span className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setShowEmailModal(true)}
              className="flex items-center gap-2 h-9 px-4 rounded-xl border font-sans font-medium text-[12px] hover:bg-[var(--surface-raised)] transition-colors shrink-0"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
            >
              <Mail className="w-3.5 h-3.5" /> Save quote
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {compareIds.length >= 2 && (
          <motion.div
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4"
          >
            <div className="flex items-center gap-3 bg-white rounded-2xl shadow-xl border border-[var(--border-default)] px-4 py-3">
              <span className="font-sans text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                {compareIds.length} plans selected
              </span>
              <button type="button" onClick={() => setShowCompare(true)}
                className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-sans font-semibold text-sm text-white"
                style={{ backgroundColor: color.main }}
              >
                <GitCompare className="w-4 h-4" /> Compare
              </button>
              <button type="button" onClick={() => setCompareIds([])}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--surface-raised)]"
                style={{ color: 'var(--text-muted)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEmailModal && <SaveEmailModal onClose={() => setShowEmailModal(false)} lowestPrice={lowestPrice} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCompare && (
          <CompareModal
            plans={productPlans.filter(p => compareIds.includes(p.id))}
            basePrice={basePrice} color={color}
            onClose={() => setShowCompare(false)}
            onSelect={handleSelect}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
