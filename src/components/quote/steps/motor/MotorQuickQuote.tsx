'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuoteStore, type MotorData } from '@/store/quoteStore'
import { calculateMotorPremium } from '@/lib/premiumCalculator'
import { NIGERIAN_STATES } from '@/lib/constants'
import { ArrowLeft, Search, Loader2, X, Phone, ChevronDown } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Link from 'next/link'
import { formatNaira } from '@/lib/formatters'

interface Props {
  onComplete: () => void
}

const coverOptions = [
  {
    id: 'comprehensive' as const,
    icon: '🛡️',
    label: 'Comprehensive',
    price: 'From ₦65,000/yr',
    desc: 'Full protection for your vehicle + third party. Best for cars under 10 years.',
    recommended: true,
  },
  {
    id: 'tpo' as const,
    icon: '⚖️',
    label: 'Third Party Only',
    price: 'From ₦15,000/yr',
    desc: 'Legal minimum in Nigeria. Covers damage you cause to others only.',
  },
]

const useOptions = [
  { id: 'private' as const, icon: '🏠', label: 'Private' },
  { id: 'commercial' as const, icon: '🚕', label: 'Commercial' },
  { id: 'own_goods' as const, icon: '📦', label: 'Own Goods' },
  { id: 'hired' as const, icon: '🔑', label: 'Hired' },
]

const QUICK_VALUES = [
  { label: '₦1.5M', value: '1500000' },
  { label: '₦3M', value: '3000000' },
  { label: '₦5M', value: '5000000' },
  { label: '₦8M', value: '8000000' },
  { label: '₦12M', value: '12000000' },
  { label: '₦20M', value: '20000000' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i)

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
}

export default function MotorQuickQuote({ onComplete }: Props) {
  const { motorData, updateMotor, setCalculatedPremium } = useQuoteStore()
  const [screen, setScreen] = useState(0)
  const [dir, setDir] = useState(1)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupDone, setLookupDone] = useState(false)
  const [stateSearch, setStateSearch] = useState('')
  const [showIdle, setShowIdle] = useState(false)
  const [showYearDrop, setShowYearDrop] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiEstimate, setAiEstimate] = useState<number | null>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const { total, breakdown } = calculateMotorPremium(motorData)
    setCalculatedPremium(total, breakdown)
  }, [motorData.coverType, motorData.marketValueRange, motorData.useType])

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setShowIdle(true), 35000)
  }, [])

  useEffect(() => {
    resetIdle()
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current) }
  }, [resetIdle])

  function go(target: number, direction = 1) {
    setDir(direction)
    setScreen(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function next() { go(screen + 1, 1) }

  function back() {
    if (screen === 0) return
    if (screen === 1) { go(0, -1); return }
    if (screen === 2) {
      if (lookupDone) { go(1, -1); return }
      go(0, -1); return
    }
    if (screen === 3) { go(2, -1); return }
    if (screen === 4) { go(3, -1); return }
  }

  async function handleLookup() {
    if (!motorData.registrationNumber) return
    setLookupLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    updateMotor({ vehicleMakeModel: 'Toyota Camry', yearOfManufacture: 2020, vehicleType: 'Saloon' })
    setLookupLoading(false)
    setLookupDone(true)
    setTimeout(() => go(1, 1), 400)
  }

  async function handleAiEstimate() {
    setAiLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    const year = motorData.yearOfManufacture
    let estimate: number
    if (year) {
      const age = currentYear - year
      estimate = Math.round(6000000 * Math.pow(0.85, age))
    } else {
      estimate = 4500000
    }
    setAiEstimate(estimate)
    updateMotor({ marketValueRange: String(estimate) })
    setAiLoading(false)
  }

  const filteredStates = NIGERIAN_STATES.filter(s =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  )

  // Screen 1 is only shown after auto-lookup. Progress counting:
  // If lookupDone: screens 0,1,2,3,4 = 5 total
  // If skip: screens 0,2,3,4 but we skip 1, so effectively 4 real steps
  const totalScreens = 5
  const progressIndex = screen

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--page-bg)' }}
      onMouseMove={resetIdle}
      onTouchStart={resetIdle}
      onClick={resetIdle}
    >
      {/* ── Header ── */}
      <div className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-[640px] mx-auto px-5 h-14 flex items-center gap-3">
          <button
            type="button"
            onClick={back}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--surface-raised)]"
            style={{ color: 'var(--text-muted)', visibility: screen > 0 ? 'visible' : 'hidden' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex justify-center">
            <Logo size={26} href="/" />
          </div>
          <Link
            href="/"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </Link>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-[var(--border-subtle)]">
          <motion.div
            className="h-full"
            style={{ backgroundColor: 'var(--motor-600)' }}
            animate={{ width: `${((progressIndex + 1) / totalScreens) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* ── Wizard body ── */}
      <div className="flex-1 flex flex-col items-center px-5 pt-10 pb-24">
        <div className="w-full max-w-[520px]">

          {/* Step dots */}
          <div className="flex justify-center items-center gap-1.5 mb-10">
            {Array.from({ length: totalScreens }).map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                animate={{
                  width: i === progressIndex ? 22 : 6,
                  height: 6,
                  backgroundColor: i <= progressIndex ? 'var(--motor-600)' : 'var(--border-medium)',
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={screen}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            >

              {/* ══ SCREEN 0: Registration ══ */}
              {screen === 0 && (
                <div className="space-y-8 text-center">
                  <div>
                    <div className="text-5xl mb-5">🚗</div>
                    <h1 className="font-display font-extrabold text-[30px] tracking-tight leading-tight mb-3" style={{ color: 'var(--text-primary)' }}>
                      Enter your vehicle<br />plate number
                    </h1>
                    <p className="font-sans text-[15px]" style={{ color: 'var(--text-muted)' }}>
                      We'll auto-fill your details from FRSC records
                    </p>
                  </div>

                  {/* Nigerian license plate UI */}
                  <div className="flex justify-center">
                    <div
                      className="w-full max-w-[320px] rounded-2xl p-3 shadow-lg"
                      style={{ backgroundColor: '#FFD600' }}
                    >
                      <div className="flex items-center justify-between px-2 mb-1.5">
                        <span className="font-sans font-black text-[9px] tracking-widest uppercase" style={{ color: '#1a1a1a', opacity: 0.6 }}>NIGERIA</span>
                        <span className="text-xs">🇳🇬</span>
                      </div>
                      <div
                        className="rounded-xl px-4 py-2.5"
                        style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
                      >
                        <input
                          type="text"
                          value={motorData.registrationNumber}
                          onChange={e => {
                            updateMotor({ registrationNumber: e.target.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '') })
                            setLookupDone(false)
                          }}
                          placeholder="LAG-123-AA"
                          className="w-full bg-transparent text-center font-display font-extrabold text-[32px] tracking-[0.25em] outline-none placeholder:opacity-40"
                          style={{ color: '#1a1a1a' }}
                          onKeyDown={e => e.key === 'Enter' && motorData.registrationNumber && handleLookup()}
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <button
                      type="button"
                      onClick={handleLookup}
                      disabled={lookupLoading || !motorData.registrationNumber}
                      className="w-full max-w-[320px] h-14 rounded-2xl font-display font-semibold text-[16px] text-white flex items-center justify-center gap-2.5 disabled:opacity-50 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                      style={{ backgroundColor: 'var(--motor-600)' }}
                    >
                      {lookupLoading
                        ? <><Loader2 className="w-5 h-5 animate-spin" /> Searching FRSC…</>
                        : <><Search className="w-5 h-5" /> Find my car</>
                      }
                    </button>
                    <button
                      type="button"
                      onClick={() => go(2, 1)}
                      className="font-sans text-[13px] hover:underline underline-offset-2 transition-all"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Don't have plate number? Skip →
                    </button>
                  </div>
                </div>
              )}

              {/* ══ SCREEN 1: Confirm vehicle + use type + state ══ */}
              {screen === 1 && (
                <div className="space-y-7">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0.5 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                      className="text-5xl mb-5"
                    >
                      ✅
                    </motion.div>
                    <h1 className="font-display font-extrabold text-[30px] tracking-tight leading-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                      Is this your vehicle?
                    </h1>
                    <p className="font-sans text-[15px]" style={{ color: 'var(--text-muted)' }}>
                      Details pre-filled from FRSC/NIID records
                    </p>
                  </div>

                  {/* Vehicle confirmation card */}
                  <div className="bg-white rounded-3xl border p-5 shadow-sm" style={{ borderColor: 'var(--border-default)' }}>
                    <div className="flex items-center justify-between mb-4 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: 'var(--motor-50)' }}>
                          🚗
                        </div>
                        <div>
                          <p className="font-display font-bold text-[17px]" style={{ color: 'var(--text-primary)' }}>
                            {motorData.vehicleMakeModel || 'Toyota Camry'}
                          </p>
                          <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            {motorData.registrationNumber}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => go(0, -1)}
                        className="h-8 px-3 rounded-xl font-sans font-medium text-[12px] border transition-all hover:bg-[var(--motor-50)]"
                        style={{ borderColor: 'var(--motor-100)', color: 'var(--motor-600)' }}
                      >
                        ✏️ Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Year — editable */}
                      <div className="relative">
                        <p className="font-sans text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Year</p>
                        <button
                          type="button"
                          onClick={() => setShowYearDrop(v => !v)}
                          className="w-full h-10 px-3 rounded-xl border flex items-center justify-between font-sans font-semibold text-[14px] transition-colors"
                          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)', backgroundColor: 'var(--surface-raised)' }}
                        >
                          {motorData.yearOfManufacture ?? 'Select'}
                          <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        </button>
                        <AnimatePresence>
                          {showYearDrop && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                              className="absolute top-full left-0 right-0 mt-1 z-20 bg-white rounded-2xl border shadow-xl overflow-hidden"
                              style={{ borderColor: 'var(--border-default)' }}
                            >
                              <div className="max-h-48 overflow-y-auto">
                                {years.map(y => (
                                  <button
                                    key={y}
                                    type="button"
                                    onClick={() => { updateMotor({ yearOfManufacture: y }); setShowYearDrop(false) }}
                                    className="w-full text-left px-4 py-2.5 font-sans text-[14px] hover:bg-[var(--surface-raised)] transition-colors"
                                    style={{ color: motorData.yearOfManufacture === y ? 'var(--motor-600)' : 'var(--text-primary)', fontWeight: motorData.yearOfManufacture === y ? 700 : 400 }}
                                  >
                                    {y}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Vehicle type */}
                      <div>
                        <p className="font-sans text-[11px] uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Type</p>
                        <div className="h-10 px-3 rounded-xl flex items-center font-sans font-semibold text-[14px]" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-primary)' }}>
                          {motorData.vehicleType || 'Saloon'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* How will you use it? */}
                  <div>
                    <p className="font-sans font-semibold text-[14px] mb-3" style={{ color: 'var(--text-primary)' }}>How will you use it?</p>
                    <div className="flex gap-2 flex-wrap">
                      {useOptions.map(opt => {
                        const sel = motorData.useType === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => updateMotor({ useType: opt.id })}
                            className="h-9 px-3.5 rounded-full font-sans font-medium text-[13px] border-[1.5px] transition-all flex items-center gap-1.5"
                            style={sel
                              ? { backgroundColor: 'var(--motor-600)', borderColor: 'var(--motor-600)', color: 'white' }
                              : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)', backgroundColor: 'white' }
                            }
                          >
                            <span>{opt.icon}</span>
                            <span>{opt.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Which state is it registered in? */}
                  <div>
                    <p className="font-sans font-semibold text-[14px] mb-3" style={{ color: 'var(--text-primary)' }}>Which state is it registered in?</p>
                    <div className="relative mb-3">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={stateSearch}
                        onChange={e => setStateSearch(e.target.value)}
                        placeholder="Search state…"
                        className="w-full h-11 pl-11 pr-4 rounded-2xl border-[1.5px] font-sans text-[14px] outline-none bg-white transition-all"
                        style={{ borderColor: 'var(--border-medium)' }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'var(--motor-600)' }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-medium)' }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pb-1">
                      {filteredStates.length === 0 && (
                        <p className="font-sans text-[13px] w-full text-center py-4" style={{ color: 'var(--text-muted)' }}>No states found</p>
                      )}
                      {filteredStates.map(state => (
                        <motion.button
                          key={state}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateMotor({ geographicalState: state })}
                          className="h-8 px-3.5 rounded-full font-sans font-medium text-[13px] border-[1.5px] transition-all"
                          style={motorData.geographicalState === state
                            ? { backgroundColor: 'var(--motor-600)', borderColor: 'var(--motor-600)', color: 'white' }
                            : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)', backgroundColor: 'white' }
                          }
                        >
                          {state}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={next}
                    disabled={!motorData.useType || !motorData.geographicalState}
                    className="w-full h-14 rounded-2xl font-display font-semibold text-[16px] text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                    style={{ backgroundColor: 'var(--motor-600)' }}
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* ══ SCREEN 2: Cover type ══ */}
              {screen === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-5xl mb-5">🛡️</div>
                    <h1 className="font-display font-extrabold text-[30px] tracking-tight leading-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                      What cover do you need?
                    </h1>
                    <p className="font-sans text-[15px]" style={{ color: 'var(--text-muted)' }}>
                      Tap to select — this determines your premium range
                    </p>
                  </div>
                  <div className="space-y-3">
                    {coverOptions.map((opt) => {
                      const sel = motorData.coverType === opt.id
                      return (
                        <motion.button
                          key={opt.id}
                          type="button"
                          onClick={() => { updateMotor({ coverType: opt.id }); setTimeout(next, 300) }}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full text-left p-5 rounded-3xl border-[2px] transition-all"
                          style={sel
                            ? { borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-50)', boxShadow: '0 0 0 4px color-mix(in srgb, var(--motor-600) 10%, transparent)' }
                            : { borderColor: 'var(--border-default)', backgroundColor: 'white' }
                          }
                        >
                          <div className="flex items-start gap-4">
                            <span className="text-2xl mt-0.5 shrink-0">{opt.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="font-display font-bold text-[15px]" style={{ color: sel ? 'var(--motor-700)' : 'var(--text-primary)' }}>
                                  {opt.label}
                                </span>
                                {opt.recommended && (
                                  <span className="font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: 'var(--motor-100)', color: 'var(--motor-700)' }}>
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <p className="font-sans text-[12px] mb-2" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
                              <span className="font-sans font-bold text-[13px]" style={{ color: 'var(--motor-600)' }}>{opt.price}</span>
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ══ SCREEN 3: Market value ══ */}
              {screen === 3 && (
                <div className="space-y-7">
                  <div className="text-center">
                    <div className="text-5xl mb-5">💰</div>
                    <h1 className="font-display font-extrabold text-[30px] tracking-tight leading-tight mb-2" style={{ color: 'var(--text-primary)' }}>
                      What's your vehicle worth?
                    </h1>
                    <p className="font-sans text-[15px]" style={{ color: 'var(--text-muted)' }}>
                      Enter its current market resale value — this sets your Insured Declared Value
                    </p>
                  </div>

                  <div>
                    <div className="relative">
                      <span
                        className="absolute left-5 top-1/2 -translate-y-1/2 font-display font-extrabold text-[22px]"
                        style={{ color: 'var(--text-muted)' }}
                      >₦</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={motorData.marketValueRange ? Number(motorData.marketValueRange.replace(/,/g, '')).toLocaleString('en-NG') : ''}
                        onChange={e => {
                          const raw = e.target.value.replace(/,/g, '').replace(/\D/g, '')
                          updateMotor({ marketValueRange: raw })
                          setAiEstimate(null)
                        }}
                        placeholder="0"
                        className="w-full h-[76px] pl-14 pr-5 rounded-3xl border-[2px] font-display font-extrabold text-[30px] outline-none transition-all bg-white"
                        style={{
                          borderColor: motorData.marketValueRange ? 'var(--motor-600)' : 'var(--border-medium)',
                          color: 'var(--text-primary)',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'var(--motor-600)'; e.currentTarget.style.boxShadow = '0 0 0 4px color-mix(in srgb, var(--motor-600) 10%, transparent)' }}
                        onBlur={e => { e.currentTarget.style.boxShadow = 'none' }}
                        onKeyDown={e => e.key === 'Enter' && Number(motorData.marketValueRange) > 0 && next()}
                        autoFocus
                      />
                    </div>
                    {/* Quick-pick chips */}
                    <p className="font-sans text-[11px] mt-3 mb-2" style={{ color: 'var(--text-muted)' }}>Quick select:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_VALUES.map(qv => (
                        <button
                          key={qv.value}
                          type="button"
                          onClick={() => { updateMotor({ marketValueRange: qv.value }); setAiEstimate(null) }}
                          className="h-8 px-3.5 rounded-full font-sans font-semibold text-[12px] border-[1.5px] transition-all"
                          style={motorData.marketValueRange === qv.value
                            ? { backgroundColor: 'var(--motor-600)', borderColor: 'var(--motor-600)', color: 'white' }
                            : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)', backgroundColor: 'white' }
                          }
                        >
                          {qv.label}
                        </button>
                      ))}
                    </div>

                    {/* AI estimate button */}
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={handleAiEstimate}
                        disabled={aiLoading}
                        className="w-full h-12 rounded-2xl font-sans font-semibold text-[14px] border-[1.5px] border-dashed flex items-center justify-center gap-2 transition-all hover:bg-[#F0FDF4] disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{ borderColor: 'var(--green-600)', color: 'var(--green-700)', backgroundColor: 'white' }}
                      >
                        {aiLoading
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Estimating value…</>
                          : <>✨ Use AI to estimate value</>
                        }
                      </button>
                      <AnimatePresence>
                        {aiEstimate !== null && !aiLoading && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="mt-2 px-4 py-2.5 rounded-xl flex items-center gap-2"
                            style={{ backgroundColor: '#F0FDF4', border: '1px solid var(--green-100)' }}
                          >
                            <span className="text-base">✓</span>
                            <span className="font-sans text-[13px]" style={{ color: 'var(--green-700)' }}>
                              AI estimated: {formatNaira(aiEstimate)} — based on your{' '}
                              {motorData.vehicleMakeModel ? motorData.vehicleMakeModel.split(' ')[0] : 'vehicle'}{' '}
                              {motorData.yearOfManufacture ?? ''}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={next}
                    disabled={!motorData.marketValueRange || Number(motorData.marketValueRange) <= 0}
                    className="w-full h-14 rounded-2xl font-display font-semibold text-[16px] text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                    style={{ backgroundColor: 'var(--motor-600)' }}
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* ══ SCREEN 4: Summary/Review ══ */}
              {screen === 4 && (
                <SummaryScreen motorData={motorData} onComplete={onComplete} />
              )}

            </motion.div>
          </AnimatePresence>

          <p className="text-center font-sans text-[11px] mt-10" style={{ color: 'var(--text-subtle)' }}>
            🔒 SSL encrypted · NAICOM licensed · NDPR compliant
          </p>
        </div>
      </div>

      {/* ── Idle popup ── */}
      <AnimatePresence>
        {showIdle && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowIdle(false)}
          >
            <motion.div
              className="absolute inset-0 bg-black/50"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-[380px] p-8 text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="sm:hidden absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--border-medium)' }} />

              <button
                type="button"
                onClick={() => setShowIdle(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-5xl mb-4">🤔</div>
              <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
                Need a hand?
              </h3>
              <p className="font-sans text-[14px] mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Our insurance experts can help you find the right cover and buy your policy in under 5 minutes.
              </p>
              <div className="space-y-3">
                <a
                  href="tel:+2349012345678"
                  className="flex items-center justify-center gap-2.5 w-full h-12 rounded-2xl font-sans font-semibold text-[14px] text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--motor-600)' }}
                >
                  <Phone className="w-4 h-4" /> Call an expert now
                </a>
                <button
                  type="button"
                  onClick={() => setShowIdle(false)}
                  className="w-full h-12 rounded-2xl font-sans font-medium text-[14px] border transition-colors hover:bg-[var(--surface-raised)]"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}
                >
                  Continue on my own
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Summary screen sub-component ──────────────────────────────────────────────
function SummaryScreen({ motorData, onComplete }: {
  motorData: MotorData
  onComplete: () => void
}) {
  const { calculatedPremium } = useQuoteStore()

  const premiumLow = calculatedPremium && calculatedPremium > 0
    ? Math.round(calculatedPremium * 0.85)
    : 15000
  const premiumHigh = calculatedPremium && calculatedPremium > 0
    ? Math.round(calculatedPremium * 1.15)
    : 85000

  const planCount = motorData.coverType === 'comprehensive' ? 5 : 4

  const rows = [
    { label: 'Vehicle', value: [motorData.vehicleMakeModel, motorData.yearOfManufacture].filter(Boolean).join(' ') || 'N/A' },
    { label: 'Registration', value: motorData.registrationNumber || 'N/A' },
    { label: 'Cover type', value: motorData.coverType === 'comprehensive' ? 'Comprehensive' : motorData.coverType === 'tpo' ? 'Third Party Only' : 'N/A' },
    { label: 'Market value', value: motorData.marketValueRange ? formatNaira(Number(motorData.marketValueRange)) : 'N/A' },
    { label: 'Use type', value: motorData.useType ? motorData.useType.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'N/A' },
    { label: 'State', value: motorData.geographicalState || 'N/A' },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="font-display font-extrabold text-[28px] tracking-tight leading-tight mb-2" style={{ color: 'var(--text-primary)' }}>
          Your quote is ready!
        </h1>
        <p className="font-sans text-[15px]" style={{ color: 'var(--text-muted)' }}>
          Here's a summary of your cover
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
        <div className="h-1.5" style={{ backgroundColor: 'var(--motor-600)' }} />
        <div className="p-5 space-y-0">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
            >
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{row.label}</span>
              <span className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated premium */}
      <div
        className="rounded-3xl p-5 text-center"
        style={{ backgroundColor: 'var(--motor-50)', border: '1px solid var(--motor-100)' }}
      >
        <p className="font-sans text-[12px] uppercase tracking-wide mb-1" style={{ color: 'var(--motor-600)' }}>Estimated premium range</p>
        <p className="font-display font-extrabold text-[28px] leading-tight" style={{ color: 'var(--motor-700)' }}>
          {formatNaira(premiumLow)} – {formatNaira(premiumHigh)}
          <span className="font-sans font-normal text-[15px] ml-1" style={{ color: 'var(--motor-600)' }}>/yr</span>
        </p>
        <p className="font-sans text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
          Final premium depends on selected insurer and add-ons
        </p>
      </div>

      {/* CTA button */}
      <button
        type="button"
        onClick={onComplete}
        className="w-full h-14 rounded-2xl font-display font-semibold text-[16px] text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
        style={{ backgroundColor: 'var(--motor-600)' }}
      >
        See {planCount} plans for you →
      </button>
    </div>
  )
}
