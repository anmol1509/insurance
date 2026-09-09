'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Mail, Phone, ShieldCheck, Loader2 } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuthStore } from '@/store/authStore'

const PRODUCT_CONFIG = {
  motor:    { color: 'var(--motor-600)',    colorBg: 'var(--motor-50)',    label: 'Motor Insurance'    },
  medical:  { color: 'var(--medical-600)',  colorBg: 'var(--medical-50)',  label: 'Medical Insurance'  },
  travel:   { color: 'var(--travel-600)',   colorBg: 'var(--travel-50)',   label: 'Travel Insurance'   },
  business: { color: 'var(--business-600)', colorBg: 'var(--business-50)', label: 'Business Insurance' },
  marine:   { color: 'var(--marine-600)',   colorBg: 'var(--marine-50)',   label: 'Marine Insurance'   },
  'personal-accident': { color: 'var(--pa-600)', colorBg: 'var(--pa-50)', label: 'Personal Accident Insurance' },
}

type Product = keyof typeof PRODUCT_CONFIG

/**
 * Sits in front of every quote flow: the customer verifies a phone number
 * and email before any step is shown, so a quote is always attached to a
 * contactable person. Demo only — no code is sent and any 6 digits pass.
 */
export default function QuoteAuthGate({ product }: { product: Product }) {
  const config = PRODUCT_CONFIG[product]
  const { requestOtp, verifyOtp, isLoading } = useAuthStore()

  const [stage, setStage] = useState<'details' | 'otp'>('details')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const boxes = useRef<(HTMLInputElement | null)[]>([])

  async function sendCode() {
    setError('')
    const res = await requestOtp(phone, email)
    if (!res.success) return setError(res.error ?? 'Something went wrong.')
    setStage('otp')
    setTimeout(() => boxes.current[0]?.focus(), 60)
  }

  async function submitCode() {
    setError('')
    const res = await verifyOtp(phone, email, code.join(''))
    if (!res.success) setError(res.error ?? 'Something went wrong.')
    // On success the store now holds a user, and the quote page renders the flow.
  }

  function setDigit(i: number, value: string) {
    const digits = value.replace(/\D/g, '')
    if (!digits) return setCode((c) => c.map((d, n) => (n === i ? '' : d)))
    setCode((c) => {
      const next = [...c]
      // Pasting the whole code into one box fills the rest of the boxes too.
      digits.split('').forEach((d, n) => { if (i + n < 6) next[i + n] = d })
      return next
    })
    boxes.current[Math.min(i + digits.length, 5)]?.focus()
  }

  const inputStyle = { borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center px-4 lg:px-8 h-14 max-w-[1280px] mx-auto">
          <Logo size={28} href="/" />
          <div className="flex-1 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" style={{ color: config.color }} />
            <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{config.label}</span>
          </div>
          <Link href="/" className="shrink-0 font-sans text-[13px] hover:underline" style={{ color: 'var(--text-muted)' }}>
            Exit
          </Link>
        </div>
      </div>

      <div className="flex-1 px-5 py-10 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="max-w-[440px] mx-auto bg-white rounded-3xl border p-7 sm:p-9"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: config.colorBg }}>
            {stage === 'details'
              ? <Lock className="w-6 h-6" style={{ color: config.color }} />
              : <ShieldCheck className="w-6 h-6" style={{ color: config.color }} />}
          </div>

          <h1 className="font-display font-bold text-2xl tracking-tight mb-1.5" style={{ color: 'var(--text-primary)' }}>
            {stage === 'details' ? 'Verify it’s you' : 'Enter your code'}
          </h1>
          <p className="font-sans text-[14px] mb-6" style={{ color: 'var(--text-muted)' }}>
            {stage === 'details'
              ? 'We send a one-time code so your quote, certificate and claims stay tied to you.'
              : `We sent a 6-digit code to ${phone} and ${email}.`}
          </p>

          {stage === 'details' ? (
            <div className="space-y-4">
              <div>
                <label className="font-sans font-semibold text-[13px] block mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Phone number <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-subtle)' }} />
                  <input
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                    placeholder="08012345678"
                    className="w-full h-12 pl-11 pr-4 rounded-2xl border-[1.5px] font-sans text-[15px] outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = config.color }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }}
                  />
                </div>
              </div>

              <div>
                <label className="font-sans font-semibold text-[13px] block mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Email address <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-subtle)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                    placeholder="you@example.com"
                    className="w-full h-12 pl-11 pr-4 rounded-2xl border-[1.5px] font-sans text-[15px] outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = config.color }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }}
                  />
                </div>
              </div>

              {error && <p className="font-sans text-[13px]" style={{ color: 'var(--error)' }}>{error}</p>}

              <button
                type="button"
                onClick={sendCode}
                disabled={isLoading || !phone.trim() || !email.trim()}
                className="w-full h-12 rounded-2xl font-display font-semibold text-[15px] text-white transition-all hover:-translate-y-px hover:shadow-md disabled:opacity-40 disabled:translate-y-0 flex items-center justify-center gap-2"
                style={{ backgroundColor: config.color }}
              >
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending code…</> : 'Send me a code →'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 justify-between">
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
                    className="w-full max-w-[52px] h-14 rounded-xl border-[1.5px] text-center font-display font-bold text-[20px] outline-none transition-all"
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = config.color }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }}
                  />
                ))}
              </div>

              <p className="font-sans text-[12px] rounded-xl px-3 py-2.5" style={{ backgroundColor: config.colorBg, color: 'var(--text-secondary)' }}>
                <strong>Demo mode</strong> — no code is actually sent. Enter any 6 digits, e.g. <strong>123456</strong>.
              </p>

              {error && <p className="font-sans text-[13px]" style={{ color: 'var(--error)' }}>{error}</p>}

              <button
                type="button"
                onClick={submitCode}
                disabled={isLoading || code.some((d) => !d)}
                className="w-full h-12 rounded-2xl font-display font-semibold text-[15px] text-white transition-all hover:-translate-y-px hover:shadow-md disabled:opacity-40 disabled:translate-y-0 flex items-center justify-center gap-2"
                style={{ backgroundColor: config.color }}
              >
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</> : 'Verify & continue →'}
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setStage('details'); setError(''); setCode(['', '', '', '', '', '']) }}
                  className="flex items-center gap-1.5 font-sans text-[13px] hover:underline"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change details
                </button>
                <button
                  type="button"
                  onClick={sendCode}
                  className="font-sans font-medium text-[13px] hover:underline"
                  style={{ color: config.color }}
                >
                  Resend code
                </button>
              </div>
            </div>
          )}

          <p className="font-sans text-[12px] mt-6 pt-5 border-t text-center" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-subtle)' }}>
            Your details are used only for this quote. NAICOM regulated · SSL secure.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
