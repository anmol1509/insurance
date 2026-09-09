'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, Phone, ShieldCheck, Loader2, X, Lock } from 'lucide-react'
import { useAuthStore, type OtpChannel } from '@/store/authStore'

const PRODUCT_CONFIG = {
  motor:    { color: 'var(--motor-600)',    colorBg: 'var(--motor-50)',    label: 'motor quote'    },
  medical:  { color: 'var(--medical-600)',  colorBg: 'var(--medical-50)',  label: 'health quote'   },
  travel:   { color: 'var(--travel-600)',   colorBg: 'var(--travel-50)',   label: 'travel quote'   },
  business: { color: 'var(--business-600)', colorBg: 'var(--business-50)', label: 'business quote' },
  marine:   { color: 'var(--marine-600)',   colorBg: 'var(--marine-50)',   label: 'marine quote'   },
  'personal-accident': { color: 'var(--pa-600)', colorBg: 'var(--pa-50)', label: 'accident cover quote' },
}

type Product = keyof typeof PRODUCT_CONFIG

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
  const { requestOtp, verifyOtp, isLoading } = useAuthStore()

  const [channel, setChannel] = useState<OtpChannel>('phone')
  const [value, setValue] = useState('')
  const [stage, setStage] = useState<'identify' | 'otp'>('identify')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)
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

  const sentTo = channel === 'phone' ? `+234 ${value}` : value

  async function sendCode() {
    setError('')
    const res = await requestOtp(channel, value)
    if (!res.success) return setError(res.error ?? 'Something went wrong.')
    setStage('otp')
    setSecondsLeft(RESEND_SECONDS)
    setTimeout(() => boxes.current[0]?.focus(), 60)
  }

  async function submitCode() {
    setError('')
    const res = await verifyOtp(channel, value, code.join(''))
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop also blocks the flow behind until the customer is verified. */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="absolute inset-0 backdrop-blur-[3px]"
        style={{ backgroundColor: 'rgba(2, 44, 34, 0.55)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        role="dialog"
        aria-modal="true"
        aria-label="Verify your contact"
        className="relative w-full max-w-[420px] bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={() => router.push('/')}
          aria-label="Close and go back"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors"
        >
          <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        </button>

        <div className="px-6 pt-7 pb-6 sm:px-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: config.colorBg }}>
            {stage === 'identify'
              ? <Lock className="w-5 h-5" style={{ color: config.color }} />
              : <ShieldCheck className="w-5 h-5" style={{ color: config.color }} />}
          </div>

          <AnimatePresence mode="wait">
            {stage === 'identify' ? (
              <motion.div key="identify" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
                <h2 className="font-display font-bold text-[22px] tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                  Let’s get your {config.label}
                </h2>
                <p className="font-sans text-[14px] mb-5" style={{ color: 'var(--text-muted)' }}>
                  Enter your mobile number or email — we’ll send a one-time code to confirm it’s you.
                </p>

                {/* Mobile / Email switch */}
                <div className="flex p-1 rounded-2xl mb-4" style={{ backgroundColor: 'var(--surface-raised)' }}>
                  {([['phone', 'Mobile', Phone], ['email', 'Email', Mail]] as const).map(([key, label, Icon]) => {
                    const active = channel === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => switchChannel(key)}
                        className="flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 font-sans font-semibold text-[13px] transition-all"
                        style={active
                          ? { backgroundColor: 'white', color: config.color, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                          : { color: 'var(--text-muted)' }}
                      >
                        <Icon className="w-3.5 h-3.5" /> {label}
                      </button>
                    )
                  })}
                </div>

                <div className="relative mb-3">
                  {channel === 'phone' ? (
                    <>
                      <span
                        className="absolute left-3 top-1/2 -translate-y-1/2 font-sans font-semibold text-[14px] pr-3 border-r"
                        style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-default)' }}
                      >
                        +234
                      </span>
                      <input
                        autoFocus
                        type="tel"
                        inputMode="numeric"
                        value={value}
                        onChange={(e) => setValue(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                        placeholder="801 234 5678"
                        className="w-full h-13 py-3.5 pl-[76px] pr-4 rounded-2xl border-[1.5px] font-sans text-[15px] outline-none transition-all"
                        style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = config.color }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }}
                      />
                    </>
                  ) : (
                    <>
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-subtle)' }} />
                      <input
                        autoFocus
                        type="email"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                        placeholder="you@example.com"
                        className="w-full h-13 py-3.5 pl-11 pr-4 rounded-2xl border-[1.5px] font-sans text-[15px] outline-none transition-all"
                        style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = config.color }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }}
                      />
                    </>
                  )}
                </div>

                {error && <p className="font-sans text-[13px] mb-3" style={{ color: 'var(--error)' }}>{error}</p>}

                <button
                  type="button"
                  onClick={sendCode}
                  disabled={isLoading || !value.trim()}
                  className="w-full h-12 rounded-2xl font-display font-semibold text-[15px] text-white transition-all hover:-translate-y-px hover:shadow-md disabled:opacity-40 disabled:translate-y-0 flex items-center justify-center gap-2"
                  style={{ backgroundColor: config.color }}
                >
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending code…</> : 'Continue →'}
                </button>
              </motion.div>
            ) : (
              <motion.div key="otp" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
                <h2 className="font-display font-bold text-[22px] tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                  Enter the 6-digit code
                </h2>
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
                      className="w-full max-w-[52px] h-13 py-3 rounded-xl border-[1.5px] text-center font-display font-bold text-[19px] outline-none transition-all"
                      style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = config.color }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }}
                    />
                  ))}
                </div>

                <p className="font-sans text-[12px] rounded-xl px-3 py-2.5 mb-3" style={{ backgroundColor: config.colorBg, color: 'var(--text-secondary)' }}>
                  <strong>Demo mode</strong> — no code is actually sent. Enter any 6 digits, e.g. <strong>123456</strong>.
                </p>

                {error && <p className="font-sans text-[13px] mb-3" style={{ color: 'var(--error)' }}>{error}</p>}

                <button
                  type="button"
                  onClick={submitCode}
                  disabled={isLoading || code.some((d) => !d)}
                  className="w-full h-12 rounded-2xl font-display font-semibold text-[15px] text-white transition-all hover:-translate-y-px hover:shadow-md disabled:opacity-40 disabled:translate-y-0 flex items-center justify-center gap-2"
                  style={{ backgroundColor: config.color }}
                >
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : 'Verify & continue →'}
                </button>

                <div className="flex items-center justify-between mt-3">
                  <button
                    type="button"
                    onClick={() => { setStage('identify'); setCode(['', '', '', '', '', '']); setError('') }}
                    className="flex items-center gap-1.5 font-sans text-[13px] hover:underline"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={sendCode}
                    disabled={secondsLeft > 0}
                    className="font-sans font-medium text-[13px] disabled:cursor-not-allowed hover:enabled:underline"
                    style={{ color: secondsLeft > 0 ? 'var(--text-subtle)' : config.color }}
                  >
                    {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : 'Resend code'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p
          className="px-6 sm:px-8 py-3.5 font-sans text-[11.5px] text-center border-t"
          style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-subtle)', color: 'var(--text-subtle)' }}
        >
          By continuing you agree to be contacted about this quote. NAICOM regulated · SSL secure.
        </p>
      </motion.div>
    </div>
  )
}
