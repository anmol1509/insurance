'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Car, Heart, Plane, Building2, Search, Users, MapPin, Briefcase, Trophy, Star } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const, delay: i * 0.08 },
  }),
}

const TABS = [
  { key: 'motor',    label: 'Motor',    icon: Car,       color: 'var(--motor-600)',    bg: 'var(--motor-50)',    href: '/quote/motor'    },
  { key: 'medical',  label: 'Medical',  icon: Heart,     color: 'var(--medical-600)',  bg: 'var(--medical-50)',  href: '/quote/medical'  },
  { key: 'travel',   label: 'Travel',   icon: Plane,     color: 'var(--travel-600)',   bg: 'var(--travel-50)',   href: '/quote/travel'   },
  { key: 'business', label: 'Business', icon: Building2, color: 'var(--business-600)', bg: 'var(--business-50)', href: '/quote/business' },
] as const

type TabKey = 'motor' | 'medical' | 'travel' | 'business'

const COVERAGE_OPTIONS = ['Just me', 'Me + spouse', 'Family (3–5)', 'Family (6+)']
const BUSINESS_TYPES  = ['Retail / Shop', 'Restaurant / Food', 'Construction', 'Tech / Agency', 'Manufacturing', 'Other']
const DESTINATIONS    = ['United Kingdom', 'United States', 'Schengen (Europe)', 'Canada', 'UAE / Dubai', 'Other destination']

export default function HeroSection() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>('motor')
  const [plateNum,  setPlateNum]  = useState('')

  const tab = TABS.find((t) => t.key === activeTab)!

  return (
    <section className="pt-16 pb-10 md:pt-20 md:pb-14" style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 55%, #065f46 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-20">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-10 lg:gap-16 items-center">

          {/* ── Left ── */}
          <div>
            {/* Award badges */}
            <motion.div className="flex flex-wrap gap-2.5 mb-5" initial="hidden" animate="visible">
              <motion.span custom={0} variants={fadeUp}
                className="inline-flex items-center gap-1.5 font-sans font-semibold text-xs px-3.5 py-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>
                <Trophy className="w-3 h-3" /> Nigeria&apos;s #1 Insurance Platform
              </motion.span>
              <motion.span custom={1} variants={fadeUp}
                className="inline-flex items-center gap-1.5 font-sans font-semibold text-xs px-3.5 py-1.5 rounded-full"
                style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}>
                <Star className="w-3 h-3" /> Best Insurtech 2025
              </motion.span>
            </motion.div>

            {/* H1 */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="mb-4">
              <h1 className="font-display font-extrabold leading-[1.08] tracking-tight"
                style={{ fontSize: 'clamp(36px, 4.8vw, 54px)', color: 'white' }}>
                Have Nigeria&apos;s smartest
                <br />insurer by your{' '}
                <em className="not-italic font-serif italic" style={{ fontSize: 'clamp(40px, 5.3vw, 60px)', borderBottom: '2px solid rgba(255,255,255,0.45)', paddingBottom: '2px' }}>side</em>
              </h1>
            </motion.div>

            <motion.p custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="font-sans text-[16px] leading-relaxed mb-7 max-w-[460px]"
              style={{ color: 'rgba(255,255,255,0.72)' }}>
              Instant quotes from 10+ NAICOM-licensed insurers.
              Digital certificate in under 3 minutes.
            </motion.p>

            {/* ── Quick-Quote Widget ── */}
            <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
              className="rounded-3xl border overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.07)] mb-6"
              style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>

              {/* Product tabs */}
              <div className="flex border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                {TABS.map((t) => {
                  const active = activeTab === t.key
                  const Icon = t.icon
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setActiveTab(t.key)}
                      className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-3 text-[11px] sm:text-[12px] font-sans font-semibold transition-all relative"
                      style={{
                        color: active ? t.color : 'var(--text-muted)',
                        backgroundColor: active ? t.bg : 'transparent',
                      }}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      {t.label}
                      {active && (
                        <motion.div
                          layoutId="tab-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5"
                          style={{ backgroundColor: t.color }}
                        />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Tab body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="p-4"
                >
                  {activeTab === 'motor' && (
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-subtle)' }} />
                        <input
                          type="text"
                          placeholder="Plate number (e.g. LAG-123-AA) — optional"
                          value={plateNum}
                          onChange={(e) => setPlateNum(e.target.value.toUpperCase())}
                          className="w-full h-11 pl-9 pr-4 rounded-2xl border font-sans text-[13px] outline-none transition-all"
                          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--motor-600)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(29,78,216,0.1)' }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push('/quote/motor')}
                        className="h-11 px-5 rounded-2xl font-sans font-bold text-[13px] text-white shrink-0 transition-all hover:-translate-y-px hover:shadow-md active:scale-95"
                        style={{ backgroundColor: 'var(--motor-600)' }}
                      >
                        Get Quotes →
                      </button>
                    </div>
                  )}

                  {activeTab === 'medical' && (
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 shrink-0" style={{ color: 'var(--text-subtle)' }} />
                        <select
                          className="w-full h-11 pl-9 pr-4 rounded-2xl border font-sans text-[13px] outline-none appearance-none cursor-pointer transition-all"
                          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)', backgroundColor: 'white' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--medical-600)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(5,150,105,0.1)' }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
                        >
                          <option value="">Who needs cover?</option>
                          {COVERAGE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push('/quote/medical')}
                        className="h-11 px-5 rounded-2xl font-sans font-bold text-[13px] text-white shrink-0 transition-all hover:-translate-y-px hover:shadow-md active:scale-95"
                        style={{ backgroundColor: 'var(--medical-600)' }}
                      >
                        Get Quotes →
                      </button>
                    </div>
                  )}

                  {activeTab === 'travel' && (
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 shrink-0" style={{ color: 'var(--text-subtle)' }} />
                        <select
                          className="w-full h-11 pl-9 pr-4 rounded-2xl border font-sans text-[13px] outline-none appearance-none cursor-pointer transition-all"
                          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)', backgroundColor: 'white' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--travel-600)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(217,119,6,0.1)' }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
                        >
                          <option value="">Where are you travelling?</option>
                          {DESTINATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push('/quote/travel')}
                        className="h-11 px-5 rounded-2xl font-sans font-bold text-[13px] text-white shrink-0 transition-all hover:-translate-y-px hover:shadow-md active:scale-95"
                        style={{ backgroundColor: 'var(--travel-600)' }}
                      >
                        Get Quotes →
                      </button>
                    </div>
                  )}

                  {activeTab === 'business' && (
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 shrink-0" style={{ color: 'var(--text-subtle)' }} />
                        <select
                          className="w-full h-11 pl-9 pr-4 rounded-2xl border font-sans text-[13px] outline-none appearance-none cursor-pointer transition-all"
                          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)', backgroundColor: 'white' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--business-600)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)' }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
                        >
                          <option value="">What type of business?</option>
                          {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push('/quote/business')}
                        className="h-11 px-5 rounded-2xl font-sans font-bold text-[13px] text-white shrink-0 transition-all hover:-translate-y-px hover:shadow-md active:scale-95"
                        style={{ backgroundColor: 'var(--business-600)' }}
                      >
                        Get Quotes →
                      </button>
                    </div>
                  )}

                  {/* Tab hint */}
                  <p className="font-sans text-[11px] mt-2.5 text-center" style={{ color: 'var(--text-subtle)' }}>
                    {activeTab === 'motor'    && 'Compare 5+ NAICOM-licensed motor insurers instantly'}
                    {activeTab === 'medical'  && '700+ accredited hospitals · personalised health plans'}
                    {activeTab === 'travel'   && 'Schengen certificate in 60 seconds · worldwide coverage'}
                    {activeTab === 'business' && 'Covers premises & staff · tax deductible under CITA'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Trust pills */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap gap-5">
              {['Instant NIID certificate', 'Claims in 24 hours', 'NAICOM regulated'].map((pill) => (
                <div key={pill} className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5 L4 7 L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-sans text-[13px]" style={{ color: 'rgba(255,255,255,0.72)' }}>{pill}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: mini bento (desktop only) ── */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-3 max-w-[420px]">
              {TABS.map((card, i) => {
                const Icon = card.icon
                const planCounts: Record<TabKey, string> = { motor: '5+ Plans', medical: '8+ Plans', travel: '6+ Plans', business: '4+ Plans' }
                const subLabels: Record<TabKey, string> = { motor: 'NAICOM licensed', medical: 'accredited hospitals', travel: 'worldwide cover', business: 'flexible cover' }
                return (
                  <motion.div
                    key={card.key}
                    custom={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                  >
                    <Link
                      href={card.href}
                      className="block relative overflow-hidden rounded-2xl p-5 cursor-pointer"
                      style={{ backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.13)' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                          <Icon className="w-4 h-4" style={{ color: card.color }} />
                        </div>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
                          <ArrowRight className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.7)' }} />
                        </div>
                      </div>
                      <p className="font-sans font-semibold text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        {card.label} Insurance
                      </p>
                      <p className="font-display font-bold text-2xl leading-none" style={{ color: 'white' }}>
                        {planCounts[card.key as TabKey]}
                      </p>
                      <p className="font-sans text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        {subLabels[card.key as TabKey]}
                      </p>
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Live policy badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-4 mx-auto w-fit bg-white rounded-full shadow-md px-4 py-2.5 flex items-center gap-2.5"
            >
              <div className="w-2 h-2 rounded-full animate-pulse shrink-0" style={{ backgroundColor: 'var(--green-500)' }} />
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Policy issued · Motor · Lagos · 2 min ago
              </span>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
