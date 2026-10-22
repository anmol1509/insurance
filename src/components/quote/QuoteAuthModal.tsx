'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, Phone, ShieldCheck, Loader2, X, RotateCw, CheckCircle2, Zap, FileText, ChevronDown, Search, Check, Car, HeartPulse, Plane, BriefcaseBusiness, Ship, Users, Globe2, Building2, type LucideIcon } from 'lucide-react'
import { useAuthStore, type OtpChannel } from '@/store/authStore'
import { COUNTRIES, DEFAULT_COUNTRY, type Country } from '@/lib/countryCodes'

type Perk = { icon: LucideIcon; text: string }

interface ProductAuth {
  color: string
  colorBg: string
  icon: LucideIcon
  /** Small pill beside the icon. */
  pill: string
  /** Two-line headline: plain first line, coloured second line. */
  title: [string, string]
  /** What the one-time code is for, shown under the headline. */
  reason: string
  /** Three reassurance chips shown on the email tab. */
  perks: [Perk, Perk, Perk]
  /** Left-panel image: the illustration is shown as is, a photo in a rounded frame. */
  image?: { src: string; kind: 'illustration' | 'photo'; position?: string }
}

const PRODUCT_CONFIG: Record<string, ProductAuth> = {
  motor: {
    color: 'var(--motor-600)', colorBg: 'var(--motor-50)', icon: Car,
    pill: 'Secure & Instant',
    title: ['Let’s get your', 'motor quote'],
    reason: 'confirm it’s you',
    perks: [{ icon: Zap, text: 'Quick & easy' }, { icon: ShieldCheck, text: 'Your data is safe' }, { icon: FileText, text: 'No spam guaranteed' }],
    image: { src: '/auth/car-illustration.webp', kind: 'illustration' },
  },
  medical: {
    color: 'var(--medical-600)', colorBg: 'var(--medical-50)', icon: HeartPulse,
    pill: 'Cover for your family',
    title: ['Let’s find your', 'health cover'],
    reason: 'keep your health quote private',
    perks: [{ icon: Users, text: 'Plans for the whole family' }, { icon: ShieldCheck, text: 'Your health data stays private' }, { icon: Zap, text: 'Compare in minutes' }],
    image: { src: '/home/photos/medical.webp', kind: 'photo', position: '75% 50%' },
  },
  travel: {
    color: 'var(--travel-600)', colorBg: 'var(--travel-50)', icon: Plane,
    pill: 'Travel with confidence',
    title: ['Let’s cover', 'your trip'],
    reason: 'save your trip quote',
    perks: [{ icon: Globe2, text: 'Cover for wherever you go' }, { icon: ShieldCheck, text: 'Your trip details stay private' }, { icon: Zap, text: 'Quote in minutes' }],
    image: { src: '/home/photos/travel.webp', kind: 'photo', position: '70% 50%' },
  },
  business: {
    color: 'var(--business-600)', colorBg: 'var(--business-50)', icon: BriefcaseBusiness,
    pill: 'Built for business',
    title: ['Let’s protect your', 'business'],
    reason: 'keep your business quote secure',
    perks: [{ icon: Building2, text: 'Cover built around your business' }, { icon: ShieldCheck, text: 'Your company data is safe' }, { icon: Zap, text: 'Quick to compare' }],
    image: { src: '/home/photos/business.webp', kind: 'photo', position: '78% 50%' },
  },
  marine: {
    color: 'var(--marine-600)', colorBg: 'var(--marine-50)', icon: Ship,
    pill: 'Secure & Instant',
    title: ['Let’s get your', 'marine quote'],
    reason: 'confirm it’s you',
    perks: [{ icon: Zap, text: 'Quick & easy' }, { icon: ShieldCheck, text: 'Your data is safe' }, { icon: FileText, text: 'No spam guaranteed' }],
  },
  'personal-accident': {
    color: 'var(--pa-600)', colorBg: 'var(--pa-50)', icon: ShieldCheck,
    pill: 'Secure & Instant',
    title: ['Let’s get your', 'accident cover quote'],
    reason: 'confirm it’s you',
    perks: [{ icon: Zap, text: 'Quick & easy' }, { icon: ShieldCheck, text: 'Your data is safe' }, { icon: FileText, text: 'No spam guaranteed' }],
  },
}

type Product = 'motor' | 'medical' | 'travel' | 'business' | 'marine' | 'personal-accident'

const RESEND_SECONDS = 30


/**
 * Sign-in popup shown over the quote flow: the customer verifies a single
 * contact — mobile number *or* email — with a one-time code before the
 * steps become usable, so every quote is attached to someone reachable.
 * Demo only: no code is sent and any 6 digits pass.
 */
export default function QuoteAuthModal({ product }: { product: Product }) {
  const router = useRouter()
  const config = PRODUCT_CONFIG[product]
  const { requestOtp, verifyOtp, demoLogin, isLoading } = useAuthStore()

  const [channel, setChannel] = useState<OtpChannel>('phone')
  const [value, setValue] = useState('')
  const [country, setCountry] = useState<Country>(DEFAULT_COUNTRY)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [countryQuery, setCountryQuery] = useState('')
  const pickerRef = useRef<HTMLDivElement | null>(null)
  const dialCode = country.dial
  const [stage, setStage] = useState<'identify' | 'otp'>('identify')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [resent, setResent] = useState(false)
  const boxes = useRef<(HTMLInputElement | null)[]>([])

  // The flow behind must not scroll while the popup is up.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  useEffect(() => {
    if (!pickerOpen) return
    const onDown = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setPickerOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPickerOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [pickerOpen])

  const sentTo = channel === 'phone' ? `${dialCode} ${value}` : value
  // What the auth store sees: the full international number for a phone, so
  // two countries' numbers never look alike.
  const contact = channel === 'phone' ? `${dialCode} ${value}` : value

  async function sendCode() {
    setError('')
    setResent(false)
    const res = await requestOtp(channel, contact)
    if (!res.success) return setError(res.error ?? 'Something went wrong.')
    setStage('otp')
    setSecondsLeft(RESEND_SECONDS)
    setTimeout(() => boxes.current[0]?.focus(), 60)
  }

  /** Resend clears whatever was typed, restarts the countdown and confirms itself. */
  async function resendCode() {
    if (secondsLeft > 0 || isLoading) return
    setError('')
    const res = await requestOtp(channel, contact)
    if (!res.success) return setError(res.error ?? 'Something went wrong.')
    setCode(['', '', '', '', '', ''])
    setSecondsLeft(RESEND_SECONDS)
    setResent(true)
    boxes.current[0]?.focus()
  }

  async function submitCode() {
    setError('')
    const res = await verifyOtp(channel, contact, code.join(''))
    if (!res.success) setError(res.error ?? 'Something went wrong.')
    // On success the store holds a user and the quote page drops this modal.
  }

  function setDigit(i: number, raw: string) {
    const digits = raw.replace(/\D/g, '')
    if (!digits) return setCode((c) => c.map((d, n) => (n === i ? '' : d)))
    setCode((c) => {
      const next = [...c]
      // Pasting the whole code into one box fills the rest too.
      digits.split('').forEach((d, n) => { if (i + n < 6) next[i + n] = d })
      return next
    })
    boxes.current[Math.min(i + digits.length, 5)]?.focus()
  }

  function switchChannel(next: OtpChannel) {
    setChannel(next)
    setValue('')
    setError('')
  }

  const inputBase = 'w-full h-14 rounded-full border-[1.5px] bg-white font-sans text-[15px] outline-none transition-all'
  const focusOn = (e: React.FocusEvent<HTMLElement>) => { e.currentTarget.style.borderColor = config.color }
  const focusOff = (e: React.FocusEvent<HTMLElement>) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }
  const q = countryQuery.trim().toLowerCase().replace(/^\+/, '')
  const visibleCountries = q
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q) || c.dial.slice(1).startsWith(q) || c.iso.toLowerCase() === q)
    : COUNTRIES

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop also blocks the flow behind until the customer is verified. */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="absolute inset-0 backdrop-blur-[6px]"
        style={{ backgroundColor: 'rgba(2, 44, 34, 0.45)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        role="dialog"
        aria-modal="true"
        aria-label="Verify your contact"
        className="relative w-full max-w-[920px] bg-white rounded-[28px] shadow-2xl overflow-hidden max-h-[94vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={() => router.push('/')}
          aria-label="Close and go back"
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors"
        >
          <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        </button>

        <div className="grid md:grid-cols-2 items-center">
          {/* Left: message + illustration */}
          <div
            className="relative px-7 pt-8 pb-2 md:px-10 md:pt-10 md:pb-8 md:self-stretch flex flex-col"
            style={{ background: `linear-gradient(160deg, ${config.colorBg} 0%, white 55%)` }}
          >
            <div className="flex items-center gap-3 mb-5 md:mb-7">
              <span
                className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0"
                style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}
              >
                {stage === 'identify'
                  ? <config.icon className="w-6 h-6" style={{ color: config.color }} />
                  : <ShieldCheck className="w-6 h-6" style={{ color: config.color }} />}
              </span>
              <span
                className="px-4 py-1.5 rounded-full font-sans font-semibold text-[13px]"
                style={{ backgroundColor: config.colorBg, color: 'var(--text-primary)' }}
              >
                {stage === 'identify' ? config.pill : 'Secure & Instant'}
              </span>
            </div>

            {stage === 'identify' ? (
              <>
                <h2 className="font-display font-bold text-[30px] md:text-[34px] leading-[1.1] tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
                  {config.title[0]}<br />
                  <span style={{ color: config.color }}>{config.title[1]}</span>
                </h2>
                <p className="font-sans text-[15px] leading-relaxed max-w-[330px]" style={{ color: 'var(--text-muted)' }}>
                  {channel === 'phone'
                    ? `Enter your mobile number or email — we’ll send a one-time code to ${config.reason}.`
                    : `Enter your email or mobile number — we’ll send a one-time code to ${config.reason}.`}
                </p>
              </>
            ) : (
              <>
                <h2 className="font-display font-bold text-[30px] md:text-[34px] leading-[1.1] tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
                  Verify it’s<br />
                  <span style={{ color: config.color }}>really you</span>
                </h2>
                <p className="font-sans text-[15px] leading-relaxed max-w-[330px]" style={{ color: 'var(--text-muted)' }}>
                  Enter the 6-digit code we sent to confirm your {channel === 'phone' ? 'number' : 'email'}.
                </p>
              </>
            )}

            {channel === 'email' && stage === 'identify' && (
              <div className="hidden md:flex gap-3 mt-6">
                {config.perks.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 flex-1">
                    <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: config.colorBg }}>
                      <Icon className="w-4 h-4" style={{ color: config.color }} />
                    </span>
                    <span className="font-sans text-[12.5px] leading-tight" style={{ color: 'var(--text-secondary)' }}>{text}</span>
                  </div>
                ))}
              </div>
            )}

            {config.image && (config.image.kind === 'illustration' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.image.src}
                alt=""
                aria-hidden="true"
                className="hidden md:block w-full max-w-[400px] mt-auto pt-6 select-none pointer-events-none"
              />
            ) : (
              <div className="hidden md:block mt-auto pt-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.image.src}
                  alt=""
                  aria-hidden="true"
                  className="w-full max-w-[400px] h-[210px] object-cover rounded-3xl select-none pointer-events-none"
                  style={{ objectPosition: config.image.position, boxShadow: '0 14px 34px rgba(15, 23, 42, 0.14)' }}
                />
              </div>
            ))}
          </div>

          {/* Right: form */}
          <div className="px-7 pt-6 pb-7 md:px-10 md:py-12">
            <AnimatePresence mode="wait">
              {stage === 'identify' ? (
                <motion.div key="identify" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
                  {/* Mobile / Email switch */}
                  <div className="flex p-1 rounded-full border mb-6" style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-subtle)' }}>
                    {([['phone', 'Mobile', Phone], ['email', 'Email', Mail]] as const).map(([key, label, Icon]) => {
                      const active = channel === key
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => switchChannel(key)}
                          className="flex-1 h-11 rounded-full flex items-center justify-center gap-2 font-sans font-semibold text-[14px] transition-all"
                          style={active
                            ? { backgroundColor: config.colorBg, color: 'var(--text-primary)', boxShadow: `0 0 0 1.5px ${config.color}33` }
                            : { color: 'var(--text-muted)' }}
                        >
                          <Icon className="w-4 h-4" style={{ color: active ? config.color : undefined }} /> {label}
                        </button>
                      )
                    })}
                  </div>

                  {channel === 'email' && (
                    <label className="block font-sans font-semibold text-[14px] mb-2" style={{ color: 'var(--text-primary)' }}>Email address</label>
                  )}

                  <div className="relative mb-4">
                    {channel === 'phone' ? (
                      <>
                        <div ref={pickerRef}>
                          <button
                            type="button"
                            aria-label="Country code"
                            aria-haspopup="listbox"
                            aria-expanded={pickerOpen}
                            onClick={() => { setPickerOpen((o) => !o); setCountryQuery('') }}
                            className="absolute left-0 top-0 h-full flex items-center pl-4 pr-3 border-r gap-1.5 rounded-l-full"
                            style={{ borderColor: 'var(--border-default)' }}
                          >
                            <span className="text-[17px] leading-none">{country.flag}</span>
                            <span className="font-sans font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>{country.dial}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${pickerOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
                          </button>

                          {pickerOpen && (
                            <div
                              className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 bg-white rounded-2xl border overflow-hidden"
                              style={{ borderColor: 'var(--border-default)', boxShadow: '0 12px 32px rgba(0,0,0,0.14)' }}
                            >
                              <div className="relative p-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-subtle)' }} />
                                <input
                                  autoFocus
                                  value={countryQuery}
                                  onChange={(e) => setCountryQuery(e.target.value)}
                                  placeholder="Search country or code"
                                  className="w-full h-10 pl-9 pr-3 rounded-xl font-sans text-[14px] outline-none"
                                  style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-primary)' }}
                                />
                              </div>
                              <ul role="listbox" className="max-h-[220px] overflow-y-auto py-1">
                                {visibleCountries.length === 0 && (
                                  <li className="px-4 py-3 font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>No country found</li>
                                )}
                                {visibleCountries.map((c) => {
                                  const active = c.iso === country.iso
                                  return (
                                    <li key={c.iso} role="option" aria-selected={active}>
                                      <button
                                        type="button"
                                        onClick={() => { setCountry(c); setPickerOpen(false) }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--surface-raised)] transition-colors"
                                      >
                                        <span className="text-[18px] leading-none">{c.flag}</span>
                                        <span className="flex-1 font-sans text-[14px] truncate" style={{ color: 'var(--text-primary)' }}>{c.name}</span>
                                        <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{c.dial}</span>
                                        {active && <Check className="w-4 h-4" style={{ color: config.color }} />}
                                      </button>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                        <input
                          autoFocus
                          type="tel"
                          inputMode="numeric"
                          value={value}
                          onChange={(e) => setValue(e.target.value.replace(/\D/g, '').slice(0, 15))}
                          onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                          placeholder="801 234 5678"
                          className={`${inputBase} pl-[150px] pr-5`}
                          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                          onFocus={focusOn}
                          onBlur={focusOff}
                        />
                      </>
                    ) : (
                      <>
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px]" style={{ color: 'var(--text-subtle)' }} />
                        <input
                          autoFocus
                          type="email"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                          placeholder="you@example.com"
                          className={`${inputBase} pl-12 pr-5`}
                          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                          onFocus={focusOn}
                          onBlur={focusOff}
                        />
                      </>
                    )}
                  </div>

                  {error && <p className="font-sans text-[13px] mb-3" style={{ color: 'var(--error)' }}>{error}</p>}

                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={isLoading || !value.trim()}
                    className="w-full h-14 rounded-full font-display font-semibold text-[16px] text-white transition-all hover:-translate-y-px hover:shadow-md disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
                    style={{ backgroundColor: config.color }}
                  >
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending code…</> : 'Continue →'}
                  </button>

                  <button
                    type="button"
                    onClick={demoLogin}
                    className="w-full mt-3 h-11 rounded-full font-sans font-semibold text-[13px] border-[1.5px] border-dashed transition-colors hover:bg-[var(--surface-raised)]"
                    style={{ borderColor: config.color, color: config.color }}
                  >
                    Demo: skip OTP and sign in as Emeka Okonkwo
                  </button>

                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3.5 mt-5" style={{ backgroundColor: 'var(--surface-raised)' }}>
                    <ShieldCheck className="w-6 h-6 shrink-0" style={{ color: config.color }} />
                    <p className="font-sans text-[12.5px] leading-snug" style={{ color: 'var(--text-muted)' }}>
                      By continuing you agree to be contacted about this quote.
                    </p>
                  </div>
                  <p className="font-sans text-[12px] text-center mt-3" style={{ color: 'var(--text-subtle)' }}>
                    NAICOM regulated · SSL secure · Your data is safe
                  </p>
                </motion.div>
              ) : (
                <motion.div key="otp" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
                  <p className="font-sans text-[14px] mb-5" style={{ color: 'var(--text-muted)' }}>
                    Sent to <strong style={{ color: 'var(--text-primary)' }}>{sentTo}</strong>{' '}
                    <button
                      type="button"
                      onClick={() => { setStage('identify'); setCode(['', '', '', '', '', '']); setError('') }}
                      className="font-medium hover:underline"
                      style={{ color: config.color }}
                    >
                      Change
                    </button>
                  </p>

                  <div className="flex gap-2 justify-between mb-4">
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { boxes.current[i] = el }}
                        value={digit}
                        inputMode="numeric"
                        maxLength={6}
                        onChange={(e) => setDigit(i, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !code[i] && i > 0) boxes.current[i - 1]?.focus()
                          if (e.key === 'Enter') submitCode()
                        }}
                        className="w-full max-w-[54px] h-14 rounded-2xl border-[1.5px] text-center font-display font-bold text-[20px] outline-none transition-all"
                        style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                        onFocus={focusOn}
                        onBlur={focusOff}
                      />
                    ))}
                  </div>

                  <AnimatePresence>
                    {resent && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="font-sans font-medium text-[12.5px] flex items-center gap-1.5 mb-3"
                        style={{ color: config.color }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> A new code has been sent to {sentTo}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <p className="font-sans text-[12px] rounded-2xl px-4 py-3 mb-4" style={{ backgroundColor: config.colorBg, color: 'var(--text-secondary)' }}>
                    <strong>Demo mode</strong> — no code is actually sent. Enter any 6 digits, e.g. <strong>123456</strong>.
                  </p>

                  {error && <p className="font-sans text-[13px] mb-3" style={{ color: 'var(--error)' }}>{error}</p>}

                  <button
                    type="button"
                    onClick={submitCode}
                    disabled={isLoading || code.some((d) => !d)}
                    className="w-full h-14 rounded-full font-display font-semibold text-[16px] text-white transition-all hover:-translate-y-px hover:shadow-md disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
                    style={{ backgroundColor: config.color }}
                  >
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : 'Verify & continue →'}
                  </button>

                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="button"
                      onClick={() => { setStage('identify'); setCode(['', '', '', '', '', '']); setError('') }}
                      className="flex items-center gap-1.5 font-sans text-[13px] hover:underline"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <span className="font-sans text-[13px] flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                      Didn’t get it?
                      <button
                        type="button"
                        onClick={resendCode}
                        disabled={secondsLeft > 0 || isLoading}
                        className="font-sans font-semibold text-[13px] flex items-center gap-1 disabled:cursor-not-allowed hover:enabled:underline"
                        style={{ color: secondsLeft > 0 ? 'var(--text-subtle)' : config.color }}
                      >
                        {secondsLeft > 0 ? (
                          <><RotateCw className="w-3.5 h-3.5" /> Resend in {secondsLeft}s</>
                        ) : (
                          <><RotateCw className="w-3.5 h-3.5" /> Resend OTP</>
                        )}
                      </button>
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
