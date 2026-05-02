'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Logo from '@/components/ui/Logo'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, user } = useAuthStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) router.replace('/dashboard')
  }, [user, router])

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3
  const pwLabels = ['', 'Weak', 'Good', 'Strong']
  const pwColors = ['', 'var(--error)', 'var(--warning)', 'var(--success)']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) { setError('Please accept the terms to continue.'); return }
    setError('')
    const result = await register(name, email, phone, password)
    if (!result.success) {
      setError(result.error ?? 'Registration failed.')
    } else {
      router.push('/dashboard')
    }
  }

  const inputCls = "w-full h-12 rounded-2xl border-[1.5px] px-4 font-sans text-[14px] outline-none transition-all"
  const focusStyle = { borderColor: 'var(--green-700)', boxShadow: '0 0 0 3px rgba(10,92,54,0.1)' }
  const blurStyle = { borderColor: 'var(--border-medium)', boxShadow: 'none' }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10" style={{ backgroundColor: 'var(--green-700)' }}>
        <Logo size={36} variant="white" wordmarkColor="white" />
        <div>
          <p className="font-display font-extrabold text-[34px] text-white leading-tight tracking-tight mb-4">
            Get covered in<br />under 3 minutes.
          </p>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed mb-8">
            Create your free account to save quotes, track policies, and file claims — all in one secure dashboard.
          </p>
          <div className="space-y-3">
            {[
              'Compare plans from 10+ insurers',
              'Digital certificate instantly on payment',
              'Track claims in real-time',
              'Free — no broker mark-up',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <span className="font-sans text-[14px] text-white/80">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="font-sans text-[12px] text-white/40">
          © {new Date().getFullYear()} ShopInsurance Nigeria Ltd
        </p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          <div className="lg:hidden mb-8"><Logo size={32} /></div>

          <h1 className="font-display font-extrabold text-[28px] tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
            Create your account
          </h1>
          <p className="font-sans text-[15px] mb-6" style={{ color: 'var(--text-muted)' }}>
            Free forever · No credit card required
          </p>

          {/* Google */}
          <button type="button"
            className="w-full h-12 rounded-2xl border-[1.5px] font-sans font-medium text-[14px] flex items-center justify-center gap-3 mb-4 hover:bg-[var(--surface-raised)] transition-colors"
            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
            <span className="font-sans text-[12px]" style={{ color: 'var(--text-subtle)' }}>or with email</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-subtle)' }} />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Emeka Okonkwo"
                className={inputCls} style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
              />
            </div>

            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com"
                className={inputCls} style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
              />
            </div>

            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone number</label>
              <div className="relative flex items-center">
                <div className="absolute left-0 h-full flex items-center px-3 border-r rounded-l-2xl font-sans font-medium text-[13px] pointer-events-none"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-raised)' }}
                >+234</div>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} required
                  placeholder="801 234 5678" className={`${inputCls} pl-16`}
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                  onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                />
              </div>
            </div>

            <div>
              <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="At least 8 characters" className={`${inputCls} pr-12`}
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                  onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                />
                <button type="button" onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-colors"
                        style={{ backgroundColor: pwStrength >= i ? pwColors[pwStrength] : 'var(--border-subtle)' }} />
                    ))}
                  </div>
                  <span className="font-sans text-[11px] font-medium" style={{ color: pwColors[pwStrength] }}>
                    {pwLabels[pwStrength]}
                  </span>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer mt-1">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded shrink-0" />
              <span className="font-sans text-[12px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                I agree to the{' '}
                <Link href="/terms" className="underline" style={{ color: 'var(--green-700)' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline" style={{ color: 'var(--green-700)' }}>Privacy Policy</Link>.
                I understand my data is processed in line with NDPR.
              </span>
            </label>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-sans text-[13px] px-4 py-2.5 rounded-xl"
                style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error)' }}>{error}</motion.p>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full h-12 rounded-2xl font-sans font-semibold text-[15px] text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-60 mt-1"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              {isLoading
                ? <motion.span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
                    animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                : <>Create account <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="font-sans text-[13px] text-center mt-5" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--green-700)' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
