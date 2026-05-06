'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuoteStore, type MotorData } from '@/store/quoteStore'
import { calculateMotorPremium } from '@/lib/premiumCalculator'
import { NIGERIAN_STATES } from '@/lib/constants'
import { ArrowLeft, Search, Loader2, X, Phone, ChevronDown, Sparkles, MapPin, Gauge } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Link from 'next/link'
import { formatNaira } from '@/lib/formatters'

interface Props { onComplete: () => void }

const coverOptions = [
  {
    id: 'comprehensive' as const,
    label: 'Comprehensive',
    price: 'From ₦65,000/yr',
    desc: 'Full protection — your vehicle and third party. Recommended for vehicles under 10 years.',
    recommended: true,
  },
  {
    id: 'tpo' as const,
    label: 'Third Party Only',
    price: 'From ₦15,000/yr',
    desc: 'Legal minimum in Nigeria. Covers damage you cause to others only.',
  },
]

const useOptions = [
  { id: 'private' as const, label: 'Private', sub: 'Personal / family use' },
  { id: 'commercial' as const, label: 'Commercial', sub: 'Taxi, Uber, Bolt' },
  { id: 'own_goods' as const, label: 'Own Goods', sub: 'Transporting cargo' },
  { id: 'hired' as const, label: 'Hired', sub: 'Rented to third parties' },
]

const QUICK_VALUES = [
  { label: '₦1.5M', value: '1500000' },
  { label: '₦3M',   value: '3000000' },
  { label: '₦5M',   value: '5000000' },
  { label: '₦8M',   value: '8000000' },
  { label: '₦12M',  value: '12000000' },
  { label: '₦20M',  value: '20000000' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i)

const slide = {
  enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (d: number) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
}

// Screens: 0=plate, 1=confirm(lookup only), 2=use type, 3=state, 4=cover, 5=value, 6=summary
// When skipping: 0→2→3→4→5→6 (no screen 1)
const TOTAL_STEPS = 6  // always 6 logical steps regardless of whether screen 1 is shown

function stepIndex(screen: number, lookupDone: boolean) {
  if (lookupDone) return screen          // 0,1,2,3,4,5,6 → dots 0–6
  if (screen === 0) return 0
  return screen - 1                      // screens 2-6 map to dots 1-5
}

export default function MotorQuickQuote({ onComplete }: Props) {
  const { motorData, updateMotor, setCalculatedPremium } = useQuoteStore()
  const [screen, setScreen]       = useState(0)
  const [dir, setDir]             = useState(1)
  const [lookupLoading, setLL]    = useState(false)
  const [lookupDone, setLD]       = useState(false)
  const [stateSearch, setSS]      = useState('')
  const [showIdle, setShowIdle]   = useState(false)
  const [showYearDrop, setSYD]    = useState(false)
  const [aiLoading, setAIL]       = useState(false)
  const [aiEstimate, setAIE]      = useState<number | null>(null)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const { total, breakdown } = calculateMotorPremium(motorData)
    setCalculatedPremium(total, breakdown)
  }, [motorData.coverType, motorData.marketValueRange, motorData.useType])

  const resetIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setShowIdle(true), 35000)
  }, [])
  useEffect(() => { resetIdle(); return () => { if (idleTimer.current) clearTimeout(idleTimer.current) } }, [resetIdle])

  function go(target: number, direction = 1) {
    setDir(direction); setScreen(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function next() { go(screen + 1, 1) }
  function back() {
    if (screen === 0) return
    if (screen === 1) { go(0, -1); return }
    if (screen === 2) { go(lookupDone ? 1 : 0, -1); return }
    go(screen - 1, -1)
  }

  async function handleLookup() {
    if (!motorData.registrationNumber) return
    setLL(true)
    await new Promise(r => setTimeout(r, 1400))
    updateMotor({ vehicleMakeModel: 'Toyota Camry', yearOfManufacture: 2020, vehicleType: 'Saloon' })
    setLL(false); setLD(true)
    setTimeout(() => go(1, 1), 350)
  }

  async function handleAiEstimate() {
    setAIL(true); setAIE(null)
    await new Promise(r => setTimeout(r, 2000))
    const year = motorData.yearOfManufacture
    const age  = year ? Math.max(0, currentYear - year) : 3
    const est  = Math.round(6_000_000 * Math.pow(0.85, age) / 100_000) * 100_000
    setAIE(est)
    updateMotor({ marketValueRange: String(est) })
    setAIL(false)
  }

  const filteredStates = NIGERIAN_STATES.filter(s =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  )

  const dotTotal = TOTAL_STEPS + (lookupDone ? 1 : 0)   // 6 or 7 dots
  const dotIdx   = stepIndex(screen, lookupDone)

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--page-bg)' }}
      onMouseMove={resetIdle} onTouchStart={resetIdle} onClick={resetIdle}
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-[600px] mx-auto px-5 h-14 flex items-center gap-3">
          <button
            type="button" onClick={back}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors"
            style={{ color: 'var(--text-muted)', visibility: screen > 0 ? 'visible' : 'hidden' }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex justify-center"><Logo size={26} href="/" /></div>
          <Link href="/" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </Link>
        </div>
        <div className="h-[3px] bg-[var(--border-subtle)]">
          <motion.div
            className="h-full"
            style={{ backgroundColor: 'var(--motor-600)' }}
            animate={{ width: `${((dotIdx + 1) / dotTotal) * 100}%` }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center px-5 pt-8 pb-24">
        <div className="w-full max-w-[500px]">

          {/* Step dots */}
          <div className="flex justify-center items-center gap-1.5 mb-8">
            {Array.from({ length: dotTotal }).map((_, i) => (
              <motion.div key={i} className="rounded-full"
                animate={{
                  width: i === dotIdx ? 20 : 6, height: 6,
                  backgroundColor: i <= dotIdx ? 'var(--motor-600)' : 'var(--border-medium)',
                }}
                transition={{ duration: 0.25 }}
              />
            ))}
          </div>

          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={screen} custom={dir} variants={slide}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >

              {/* ══ SCREEN 0: Plate ══ */}
              {screen === 0 && (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <span
                      className="inline-block font-sans font-semibold text-[11px] tracking-[0.1em] uppercase px-3 py-1 rounded-full mb-3"
                      style={{ backgroundColor: 'var(--motor-50)', color: 'var(--motor-600)' }}
                    >
                      Motor Insurance
                    </span>
                    <h1 className="font-display font-extrabold text-[28px] tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                      Enter your vehicle<br />registration number
                    </h1>
                    <p className="font-sans text-[15px]" style={{ color: 'var(--text-muted)' }}>
                      We'll look up your details automatically from FRSC records
                    </p>
                  </div>

                  {/* Nigerian plate */}
                  <div className="flex justify-center">
                    <div className="w-full max-w-[300px] rounded-xl p-3 shadow-lg" style={{ backgroundColor: '#FFD600' }}>
                      <div className="flex items-center justify-between px-1.5 mb-1">
                        <span className="font-sans font-black text-[8px] tracking-[0.2em] uppercase" style={{ color: 'rgba(0,0,0,0.5)' }}>NIGERIA</span>
                        <span className="text-xs">🇳🇬</span>
                      </div>
                      <div className="rounded-lg px-4 py-2" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                        <input
                          type="text"
                          value={motorData.registrationNumber}
                          onChange={e => { updateMotor({ registrationNumber: e.target.value.toUpperCase().replace(/[^A-Z0-9\-]/g, '') }); setLD(false) }}
                          placeholder="LAG-123-AA"
                          className="w-full bg-transparent text-center font-display font-extrabold text-[28px] tracking-[0.2em] outline-none placeholder:opacity-35"
                          style={{ color: '#111' }}
                          onKeyDown={e => e.key === 'Enter' && motorData.registrationNumber && handleLookup()}
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button" onClick={handleLookup}
                      disabled={lookupLoading || !motorData.registrationNumber}
                      className="w-full max-w-[300px] h-13 rounded-xl font-sans font-semibold text-[15px] text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ backgroundColor: 'var(--motor-600)', height: '52px' }}
                    >
                      {lookupLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Searching FRSC…</>
                        : <><Search className="w-4 h-4" /> Look up my vehicle</>
                      }
                    </button>
                    <button
                      type="button" onClick={() => go(2, 1)}
                      className="font-sans text-[13px] hover:underline underline-offset-2"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Skip — I'll enter details manually
                    </button>
                  </div>
                </div>
              )}

              {/* ══ SCREEN 1: Confirm vehicle (after lookup) ══ */}
              {screen === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 14, stiffness: 220 }}
                      className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-2"
                      style={{ backgroundColor: 'var(--motor-50)' }}
                    >
                      <Gauge className="w-7 h-7" style={{ color: 'var(--motor-600)' }} />
                    </motion.div>
                    <h1 className="font-display font-extrabold text-[26px] tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                      Is this your vehicle?
                    </h1>
                    <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
                      Pre-filled from FRSC/NIID records — edit any field if needed
                    </p>
                  </div>

                  {/* Vehicle card */}
                  <div className="bg-white rounded-2xl border" style={{ borderColor: 'var(--border-default)' }}>
                    <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-[13px] shrink-0"
                          style={{ backgroundColor: 'var(--motor-600)', color: 'white' }}
                        >
                          {(motorData.vehicleMakeModel || 'MY').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-display font-bold text-[16px]" style={{ color: 'var(--text-primary)' }}>
                            {motorData.vehicleMakeModel || 'Toyota Camry'}
                          </p>
                          <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
                            {motorData.registrationNumber}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button" onClick={() => go(0, -1)}
                        className="font-sans font-medium text-[12px] px-3 h-8 rounded-lg border transition-all hover:bg-[var(--motor-50)]"
                        style={{ borderColor: 'var(--motor-200)', color: 'var(--motor-600)' }}
                      >
                        Change
                      </button>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-[var(--border-subtle)]">
                      {/* Year dropdown */}
                      <div className="p-4 relative">
                        <p className="font-sans text-[10px] uppercase tracking-[0.08em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Year</p>
                        <button
                          type="button" onClick={() => setSYD(v => !v)}
                          className="flex items-center gap-1.5 font-sans font-semibold text-[14px]"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {motorData.yearOfManufacture ?? 'Select'}
                          <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                        </button>
                        <AnimatePresence>
                          {showYearDrop && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                              className="absolute top-full left-0 w-40 mt-1 z-20 bg-white rounded-xl border shadow-xl overflow-hidden"
                              style={{ borderColor: 'var(--border-default)' }}
                            >
                              <div className="max-h-44 overflow-y-auto">
                                {years.map(y => (
                                  <button key={y} type="button"
                                    onClick={() => { updateMotor({ yearOfManufacture: y }); setSYD(false) }}
                                    className="w-full text-left px-4 py-2 font-sans text-[13px] hover:bg-[var(--surface-raised)]"
                                    style={{ color: motorData.yearOfManufacture === y ? 'var(--motor-600)' : 'var(--text-primary)', fontWeight: motorData.yearOfManufacture === y ? 700 : 400 }}
                                  >{y}</button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Type */}
                      <div className="p-4">
                        <p className="font-sans text-[10px] uppercase tracking-[0.08em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>Type</p>
                        <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
                          {motorData.vehicleType || 'Saloon'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button" onClick={next}
                    className="w-full h-[52px] rounded-xl font-sans font-semibold text-[15px] text-white transition-all hover:opacity-90 active:scale-[0.98]"
                    style={{ backgroundColor: 'var(--motor-600)' }}
                  >
                    Yes, that's my vehicle →
                  </button>
                  <button type="button" onClick={() => go(0, -1)}
                    className="w-full text-center font-sans text-[13px] hover:underline"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    This doesn't look right — search again
                  </button>
                </div>
              )}

              {/* ══ SCREEN 2: Use type ══ */}
              {screen === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-2" style={{ backgroundColor: 'var(--motor-50)' }}>
                      <MapPin className="w-6 h-6" style={{ color: 'var(--motor-600)' }} />
                    </span>
                    <h1 className="font-display font-extrabold text-[26px] tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                      How will you use this vehicle?
                    </h1>
                    <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
                      Tap to select — affects your premium rate
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    {useOptions.map(opt => {
                      const sel = motorData.useType === opt.id
                      return (
                        <motion.button
                          key={opt.id} type="button"
                          onClick={() => { updateMotor({ useType: opt.id }); setTimeout(next, 220) }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full text-left px-5 py-4 rounded-2xl border-[1.5px] transition-all flex items-center justify-between"
                          style={sel
                            ? { borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-50)' }
                            : { borderColor: 'var(--border-default)', backgroundColor: 'white' }
                          }
                        >
                          <div>
                            <p className="font-sans font-semibold text-[15px]" style={{ color: sel ? 'var(--motor-700)' : 'var(--text-primary)' }}>{opt.label}</p>
                            <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{opt.sub}</p>
                          </div>
                          <div
                            className="w-5 h-5 rounded-full border-[2px] flex items-center justify-center shrink-0 ml-4 transition-all"
                            style={sel
                              ? { borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-600)' }
                              : { borderColor: 'var(--border-medium)' }
                            }
                          >
                            {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ══ SCREEN 3: State ══ */}
              {screen === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-2" style={{ backgroundColor: 'var(--motor-50)' }}>
                      <MapPin className="w-6 h-6" style={{ color: 'var(--motor-600)' }} />
                    </span>
                    <h1 className="font-display font-extrabold text-[26px] tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                      Where is your vehicle<br />registered?
                    </h1>
                    <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
                      State of registration can affect your rate
                    </p>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text" value={stateSearch} onChange={e => setSS(e.target.value)}
                      placeholder="Search state…"
                      className="w-full h-11 pl-11 pr-4 rounded-xl border-[1.5px] font-sans text-[14px] outline-none bg-white"
                      style={{ borderColor: 'var(--border-medium)' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'var(--motor-600)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-medium)' }}
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pb-1">
                    {filteredStates.length === 0 && (
                      <p className="font-sans text-[13px] w-full text-center py-4" style={{ color: 'var(--text-muted)' }}>No states found</p>
                    )}
                    {filteredStates.map(state => (
                      <motion.button
                        key={state} type="button" whileTap={{ scale: 0.95 }}
                        onClick={() => { updateMotor({ geographicalState: state }); setTimeout(next, 200) }}
                        className="h-9 px-4 rounded-full font-sans font-medium text-[13px] border-[1.5px] transition-all"
                        style={motorData.geographicalState === state
                          ? { backgroundColor: 'var(--motor-600)', borderColor: 'var(--motor-600)', color: 'white' }
                          : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)', backgroundColor: 'white' }
                        }
                      >{state}</motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* ══ SCREEN 4: Cover type ══ */}
              {screen === 4 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-2" style={{ backgroundColor: 'var(--motor-50)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--motor-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </span>
                    <h1 className="font-display font-extrabold text-[26px] tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                      What type of cover<br />do you need?
                    </h1>
                    <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
                      Tap to select — determines your premium range
                    </p>
                  </div>
                  <div className="space-y-3">
                    {coverOptions.map(opt => {
                      const sel = motorData.coverType === opt.id
                      return (
                        <motion.button
                          key={opt.id} type="button"
                          onClick={() => { updateMotor({ coverType: opt.id }); setTimeout(next, 260) }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full text-left p-5 rounded-2xl border-[1.5px] transition-all"
                          style={sel
                            ? { borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-50)' }
                            : { borderColor: 'var(--border-default)', backgroundColor: 'white' }
                          }
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-display font-bold text-[15px]" style={{ color: sel ? 'var(--motor-700)' : 'var(--text-primary)' }}>
                                  {opt.label}
                                </span>
                                {opt.recommended && (
                                  <span className="font-sans font-semibold text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--motor-100)', color: 'var(--motor-700)' }}>
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <p className="font-sans text-[12px] mb-2.5" style={{ color: 'var(--text-muted)' }}>{opt.desc}</p>
                              <span className="font-sans font-bold text-[13px]" style={{ color: 'var(--motor-600)' }}>{opt.price}</span>
                            </div>
                            <div
                              className="w-5 h-5 rounded-full border-[2px] shrink-0 mt-0.5 flex items-center justify-center transition-all"
                              style={sel
                                ? { borderColor: 'var(--motor-600)', backgroundColor: 'var(--motor-600)' }
                                : { borderColor: 'var(--border-medium)' }
                              }
                            >
                              {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ══ SCREEN 5: Market value ══ */}
              {screen === 5 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-2" style={{ backgroundColor: 'var(--motor-50)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--motor-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      </svg>
                    </span>
                    <h1 className="font-display font-extrabold text-[26px] tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                      What is your vehicle<br />currently worth?
                    </h1>
                    <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
                      Market resale value — this sets your Insured Declared Value (IDV)
                    </p>
                  </div>

                  <div>
                    <div className="relative">
                      <span
                        className="absolute left-5 top-1/2 -translate-y-1/2 font-display font-extrabold text-[20px]"
                        style={{ color: 'var(--text-muted)' }}
                      >₦</span>
                      <input
                        type="text" inputMode="numeric"
                        value={motorData.marketValueRange ? Number(motorData.marketValueRange.replace(/,/g, '')).toLocaleString('en-NG') : ''}
                        onChange={e => {
                          const raw = e.target.value.replace(/,/g, '').replace(/\D/g, '')
                          updateMotor({ marketValueRange: raw }); setAIE(null)
                        }}
                        placeholder="0"
                        className="w-full h-[70px] pl-12 pr-5 rounded-2xl border-[2px] font-display font-extrabold text-[28px] outline-none bg-white transition-all"
                        style={{ borderColor: motorData.marketValueRange ? 'var(--motor-600)' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'var(--motor-600)'; e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--motor-600) 12%, transparent)' }}
                        onBlur={e => { e.currentTarget.style.boxShadow = 'none' }}
                        onKeyDown={e => e.key === 'Enter' && Number(motorData.marketValueRange) > 0 && next()}
                        autoFocus
                      />
                    </div>

                    <p className="font-sans text-[11px] mt-3 mb-2" style={{ color: 'var(--text-muted)' }}>Quick select:</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_VALUES.map(qv => (
                        <button key={qv.value} type="button"
                          onClick={() => { updateMotor({ marketValueRange: qv.value }); setAIE(null) }}
                          className="h-8 px-3.5 rounded-full font-sans font-semibold text-[12px] border-[1.5px] transition-all"
                          style={motorData.marketValueRange === qv.value
                            ? { backgroundColor: 'var(--motor-600)', borderColor: 'var(--motor-600)', color: 'white' }
                            : { borderColor: 'var(--border-medium)', color: 'var(--text-secondary)', backgroundColor: 'white' }
                          }
                        >{qv.label}</button>
                      ))}
                    </div>

                    {/* AI estimate */}
                    <button
                      type="button" onClick={handleAiEstimate} disabled={aiLoading}
                      className="mt-4 w-full h-11 rounded-xl border-[1.5px] border-dashed font-sans font-medium text-[13px] flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                      style={{ borderColor: 'var(--motor-300)', color: 'var(--motor-600)', backgroundColor: 'transparent' }}
                    >
                      {aiLoading
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Estimating…</>
                        : <><Sparkles className="w-4 h-4" /> Use AI to estimate value</>
                      }
                    </button>
                    <AnimatePresence>
                      {aiEstimate !== null && !aiLoading && (
                        <motion.p
                          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="font-sans text-[12px] mt-2 text-center"
                          style={{ color: 'var(--motor-600)' }}
                        >
                          ✓ AI estimated {formatNaira(aiEstimate)} — based on your {motorData.vehicleMakeModel?.split(' ')[0] ?? 'vehicle'} {motorData.yearOfManufacture ?? ''}. Edit above if needed.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="button" onClick={next}
                    disabled={!motorData.marketValueRange || Number(motorData.marketValueRange) <= 0}
                    className="w-full h-[52px] rounded-xl font-sans font-semibold text-[15px] text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--motor-600)' }}
                  >
                    Continue →
                  </button>
                </div>
              )}

              {/* ══ SCREEN 6: Summary ══ */}
              {screen === 6 && (
                <SummaryScreen motorData={motorData} onComplete={onComplete} />
              )}

            </motion.div>
          </AnimatePresence>

          <p className="text-center font-sans text-[11px] mt-8" style={{ color: 'var(--text-subtle)' }}>
            🔒 SSL encrypted · NAICOM licensed · NDPR compliant
          </p>
        </div>
      </div>

      {/* Idle popup */}
      <AnimatePresence>
        {showIdle && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowIdle(false)}>
            <motion.div className="absolute inset-0 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="relative bg-white rounded-t-3xl sm:rounded-2xl w-full sm:max-w-[360px] p-7 text-center shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="sm:hidden absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--border-medium)' }} />
              <button type="button" onClick={() => setShowIdle(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--motor-50)' }}>
                <Phone className="w-6 h-6" style={{ color: 'var(--motor-600)' }} />
              </div>
              <h3 className="font-display font-bold text-[18px] mb-2" style={{ color: 'var(--text-primary)' }}>Need a hand?</h3>
              <p className="font-sans text-[13px] mb-5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Our insurance experts can help you choose the right cover and complete your policy in under 5 minutes.
              </p>
              <div className="space-y-2.5">
                <a href="tel:+2349012345678"
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl font-sans font-semibold text-[14px] text-white"
                  style={{ backgroundColor: 'var(--motor-600)' }}
                >
                  <Phone className="w-4 h-4" /> Call an expert
                </a>
                <button type="button" onClick={() => setShowIdle(false)}
                  className="w-full h-11 rounded-xl font-sans font-medium text-[14px] border"
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

// ── Summary sub-component ─────────────────────────────────────────────────────
function SummaryScreen({ motorData, onComplete }: { motorData: MotorData; onComplete: () => void }) {
  const { calculatedPremium } = useQuoteStore()
  const low  = calculatedPremium && calculatedPremium > 0 ? Math.round(calculatedPremium * 0.85) : 15000
  const high = calculatedPremium && calculatedPremium > 0 ? Math.round(calculatedPremium * 1.15) : 85000

  const rows: { label: string; value: string }[] = [
    { label: 'Registration',  value: motorData.registrationNumber || '—' },
    { label: 'Vehicle',       value: [motorData.vehicleMakeModel, motorData.yearOfManufacture].filter(Boolean).join(' ') || '—' },
    { label: 'Cover',         value: motorData.coverType === 'comprehensive' ? 'Comprehensive' : motorData.coverType === 'tpo' ? 'Third Party Only' : '—' },
    { label: 'Market value',  value: motorData.marketValueRange ? formatNaira(Number(motorData.marketValueRange)) : '—' },
    { label: 'Use',           value: motorData.useType ? motorData.useType.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—' },
    { label: 'State',         value: motorData.geographicalState || '—' },
  ]

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 220 }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-1"
          style={{ backgroundColor: 'var(--motor-50)' }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--motor-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </motion.div>
        <h1 className="font-display font-extrabold text-[26px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Your quote is ready
        </h1>
        <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>
          Review your details before seeing plans
        </p>
      </div>

      {/* Summary table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
        <div className="h-1" style={{ backgroundColor: 'var(--motor-600)' }} />
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
          >
            <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{row.label}</span>
            <span className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>{row.value}</span>
          </div>
        ))}
      </div>

      {/* Premium range */}
      <div className="rounded-2xl p-5" style={{ backgroundColor: 'var(--motor-50)', border: '1px solid var(--motor-100)' }}>
        <p className="font-sans text-[11px] uppercase tracking-[0.08em] mb-1" style={{ color: 'var(--motor-600)' }}>Estimated annual premium</p>
        <p className="font-display font-extrabold text-[26px] leading-tight" style={{ color: 'var(--motor-700)' }}>
          {formatNaira(low)} – {formatNaira(high)}
          <span className="font-sans font-normal text-[14px] ml-1" style={{ color: 'var(--motor-500)' }}>/yr</span>
        </p>
        <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
          Final price depends on insurer selection
        </p>
      </div>

      <button
        type="button" onClick={onComplete}
        className="w-full h-[52px] rounded-xl font-sans font-semibold text-[15px] text-white transition-all hover:opacity-90"
        style={{ backgroundColor: 'var(--motor-600)' }}
      >
        See plans →
      </button>
    </div>
  )
}
