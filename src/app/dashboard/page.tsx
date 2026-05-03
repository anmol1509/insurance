'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Plus, Upload, FileText, Download, ArrowRight, RefreshCw,
  Copy, Check, Share2, AlertTriangle, ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { mockPolicies, mockClaims, PRODUCT_COLORS } from '@/lib/mockData'
import { formatNaira, formatNairaShort } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'

/* ─────────────────────────── constants ─────────────────────────── */

const QUICK_ACTIONS = [
  { label: 'New quote',       icon: Plus,      color: 'var(--green-700)',   bg: 'var(--green-50)',   href: '/quote/motor' },
  { label: 'Upload document', icon: Upload,    color: 'var(--motor-600)',   bg: 'var(--motor-50)',   href: '/dashboard/documents' },
  { label: 'File a claim',    icon: FileText,  color: 'var(--error)',       bg: '#FEF2F2',           href: '/dashboard/claims' },
  { label: 'Renew policy',    icon: RefreshCw, color: 'var(--travel-600)', bg: 'var(--travel-50)', href: '/dashboard/policies' },
]

const NOTIFICATIONS = [
  {
    id: 1,
    icon: '🔔',
    text: 'Motor policy renews in 14 days — Leadway Assurance',
    cta: 'Renew now',
    time: '2h ago',
  },
  {
    id: 2,
    icon: '✅',
    text: 'Claim CLM-2025-0921 approved — ₦320,000 will be credited in 3–5 days',
    cta: null,
    time: '1d ago',
  },
  {
    id: 3,
    icon: '📋',
    text: 'Upload your vehicle inspection report to activate full cover',
    cta: 'Upload now',
    time: '3d ago',
  },
]

const INCOMPLETE_ITEMS = [
  { text: 'Add your BVN for KYC verification',   href: '/dashboard/settings' },
  { text: 'Upload a profile photo',              href: '/dashboard/settings' },
  { text: 'Add nominee / beneficiary',           href: '/dashboard/settings' },
]

const COVERAGE_GAPS = [
  {
    id: 'travel',
    title: 'No Travel Insurance',
    body: 'You have motor + medical but no travel cover. If you travel abroad, a single medical emergency can cost ₦4–12M.',
    cta: 'Get Travel Cover',
    borderColor: '#F97316',
    btnStyle: { backgroundColor: '#F97316', color: '#fff' },
    icon: '✈️',
  },
  {
    id: 'business',
    title: 'No Business Cover',
    body: 'Your motor and medical policies don\'t cover professional liability. Required for most corporate clients.',
    cta: 'Get Business Cover',
    borderColor: '#7C3AED',
    btnStyle: { backgroundColor: '#7C3AED', color: '#fff' },
    icon: '🏢',
  },
]

/* ─────────────────────────── page ─────────────────────────── */

export default function DashboardPage() {
  const { user } = useAuthStore()
  const firstName = user?.name.split(' ')[0] ?? 'there'

  /* notification bell */
  const [notifOpen, setNotifOpen]   = useState(false)
  const bellRef                     = useRef<HTMLDivElement>(null)

  /* referral copy */
  const [copied, setCopied] = useState(false)
  const REFERRAL_CODE       = 'EMEKA2025'

  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_CODE).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* close notif on outside click */
  useEffect(() => {
    if (!notifOpen) return
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [notifOpen])

  /* derived data */
  const activePolicies  = mockPolicies.filter((p) => p.status === 'active').length
  const expiringPolicies = mockPolicies.filter((p) => p.status === 'expiring')
  const totalCover      = mockPolicies.reduce((sum, p) => sum + p.sumInsured, 0)
  const openClaims      = mockClaims.filter((c) => c.status === 'under_review' || c.status === 'submitted').length

  const stats = [
    {
      label: 'Active Policies',
      value: String(activePolicies),
      trend: '+1 this month',
      trendColor: 'var(--green-700)',
    },
    {
      label: 'Total Cover',
      value: formatNairaShort(totalCover),
      trend: '+₦18M vs last year',
      trendColor: 'var(--green-700)',
    },
    {
      label: 'Open Claims',
      value: String(openClaims),
      trend: '−2 since last month',
      trendColor: 'var(--green-700)',
    },
    {
      label: 'Next Renewal',
      value: '14 days',
      trend: 'Urgent',
      trendColor: 'var(--warning)',
    },
  ]

  const statusVariant = (s: string): 'status-active' | 'status-expiring' | 'status-expired' => {
    if (s === 'active') return 'status-active'
    if (s === 'expiring') return 'status-expiring'
    return 'status-expired'
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1100px] mx-auto">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="font-display font-extrabold text-[26px] tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Welcome back, {firstName} 👋
          </h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {activePolicies} active {activePolicies === 1 ? 'policy' : 'policies'} · {openClaims} open {openClaims === 1 ? 'claim' : 'claims'}
          </p>
        </div>

        {/* Bell with dropdown */}
        <div className="hidden lg:block relative" ref={bellRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-10 h-10 rounded-full flex items-center justify-center border transition-colors hover:bg-[var(--surface-raised)]"
            style={{ borderColor: 'var(--border-default)' }}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            {/* badge */}
            <span
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center font-sans font-bold text-[10px] text-white"
              style={{ backgroundColor: 'var(--error)' }}
            >
              3
            </span>
          </button>

          {/* Backdrop */}
          {notifOpen && (
            <div
              className="fixed inset-0 z-20"
              onClick={() => setNotifOpen(false)}
            />
          )}

          {/* Dropdown panel */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-[340px] rounded-2xl border shadow-lg overflow-hidden z-30"
                style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
              >
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}
                >
                  <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>
                    Notifications
                  </p>
                  <span
                    className="font-sans text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--error)', color: '#fff' }}
                  >
                    3 unread
                  </span>
                </div>

                <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                  {NOTIFICATIONS.map((n) => (
                    <div key={n.id} className="flex gap-3 px-4 py-3.5 hover:bg-[var(--surface-raised)] transition-colors">
                      <span className="text-[20px] shrink-0 mt-0.5">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[13px] leading-snug" style={{ color: 'var(--text-primary)' }}>
                          {n.text}
                        </p>
                        {n.cta && (
                          <p className="font-sans font-semibold text-[12px] mt-0.5 hover:underline cursor-pointer" style={{ color: 'var(--green-700)' }}>
                            {n.cta} →
                          </p>
                        )}
                        <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                          {n.time}
                        </p>
                      </div>
                      {/* unread dot */}
                      <span
                        className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                        style={{ backgroundColor: 'var(--error)' }}
                      />
                    </div>
                  ))}
                </div>

                <div
                  className="px-4 py-2.5 border-t text-center"
                  style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}
                >
                  <Link
                    href="/dashboard/settings"
                    className="font-sans font-semibold text-[12px] hover:underline"
                    style={{ color: 'var(--green-700)' }}
                  >
                    View all notifications →
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Renewal alert ── */}
      {expiringPolicies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 mb-5 rounded-xl"
          style={{ backgroundColor: 'var(--warning-bg)', borderLeft: '4px solid var(--warning)' }}
        >
          <span className="text-base shrink-0">⚠️</span>
          <p className="font-sans font-medium text-[13px]" style={{ color: '#92400E' }}>
            {expiringPolicies[0].name} expires soon.{' '}
            <Link href="/dashboard/policies" className="font-bold underline" style={{ color: 'var(--warning)' }}>
              Renew now →
            </Link>
          </p>
        </motion.div>
      )}

      {/* ── Profile completeness bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl border p-5 mb-6"
        style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-sans font-bold text-[14px]" style={{ color: 'var(--text-primary)' }}>
            Profile <span style={{ color: 'var(--green-700)' }}>75%</span> complete
          </p>
          <p className="font-sans text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--green-50)', color: 'var(--green-700)' }}>
            Save up to 15%
          </p>
        </div>

        {/* progress bar */}
        <div className="w-full h-2 rounded-full mb-4 overflow-hidden" style={{ backgroundColor: 'var(--border-subtle)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '75%' }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--green-700)' }}
          />
        </div>

        <div className="space-y-2 mb-3">
          {INCOMPLETE_ITEMS.map((item) => (
            <div key={item.text} className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#F97316' }} />
              <p className="flex-1 font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                {item.text}
              </p>
              <Link href={item.href}>
                <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
              </Link>
            </div>
          ))}
        </div>

        <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
          Complete profile for up to <strong style={{ color: 'var(--green-700)' }}>15% premium discount</strong>
        </p>
      </motion.div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border p-5"
            style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
          >
            <p
              className="font-sans font-medium text-[11px] uppercase tracking-[0.07em] mb-1.5"
              style={{ color: 'var(--text-subtle)' }}
            >
              {stat.label}
            </p>
            <p className="font-display font-bold text-[28px] leading-none mb-1.5" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </p>
            <p className="font-sans font-semibold text-[11px]" style={{ color: stat.trendColor }}>
              {stat.trend}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Policies ── */}
      <div
        className="rounded-2xl border overflow-hidden mb-6"
        style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
      >
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}
        >
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>
            My Policies
          </p>
          <Link
            href="/dashboard/policies"
            className="font-sans font-semibold text-[12px] hover:underline"
            style={{ color: 'var(--green-700)' }}
          >
            View all →
          </Link>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {mockPolicies.map((p) => {
            const colors  = PRODUCT_COLORS[p.productType]
            const expDate = new Date(p.expiryDate)
            const daysLeft = Math.ceil((expDate.getTime() - Date.now()) / 86400000)
            return (
              <div
                key={p.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] shrink-0"
                  style={{ backgroundColor: colors.light }}
                >
                  {colors.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-[14px] truncate" style={{ color: 'var(--text-primary)' }}>
                    {p.name}
                  </p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {p.insurer} · {p.ref}
                  </p>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                    {formatNaira(p.sumInsured)}
                  </p>
                  <p
                    className="font-sans text-[11px]"
                    style={{ color: daysLeft < 30 ? 'var(--error)' : 'var(--text-muted)' }}
                  >
                    {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
                  </p>
                </div>
                <Badge variant={statusVariant(p.status)}>
                  {p.status === 'active' ? 'Active' : p.status === 'expiring' ? 'Expiring' : 'Expired'}
                </Badge>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {QUICK_ACTIONS.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + i * 0.06 }}
          >
            <Link
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-2xl border transition-all hover:shadow-sm hover:border-[var(--green-100)] group"
              style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: action.bg }}
              >
                <action.icon className="w-4 h-4" style={{ color: action.color }} />
              </div>
              <p className="font-sans font-semibold text-[13px] flex-1" style={{ color: 'var(--text-primary)' }}>
                {action.label}
              </p>
              <ArrowRight
                className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-muted)' }}
              />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── Coverage Gap Widget ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="rounded-2xl border p-5 mb-6"
        style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
      >
        <p className="font-sans font-bold text-[15px] mb-0.5" style={{ color: 'var(--text-primary)' }}>
          Coverage Analysis
        </p>
        <p className="font-sans text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
          Based on your profile, you may be under-covered
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {COVERAGE_GAPS.map((gap) => (
            <div
              key={gap.id}
              className="rounded-xl p-4 border"
              style={{
                borderColor: 'var(--border-default)',
                borderLeftWidth: '4px',
                borderLeftColor: gap.borderColor,
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-[22px] shrink-0">{gap.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-bold text-[13px] mb-1" style={{ color: 'var(--text-primary)' }}>
                    {gap.title}
                  </p>
                  <p className="font-sans text-[12px] leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                    {gap.body}
                  </p>
                  <button
                    className="font-sans font-semibold text-[12px] px-3.5 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                    style={gap.btnStyle}
                  >
                    {gap.cta}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Referral Widget ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="rounded-2xl p-6"
        style={{ backgroundColor: 'var(--green-900, #14532d)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">

          {/* left: copy */}
          <div className="flex-1 min-w-0">
            <p className="font-display font-extrabold text-[20px] leading-snug text-white mb-1.5">
              Refer a friend, earn ₦5,000
            </p>
            <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
              For every friend who buys a policy, you both get ₦5,000 off your next renewal.
            </p>
          </div>

          {/* middle: referral code pill */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}
            >
              <span className="font-mono font-bold text-[15px] tracking-widest text-white">
                {REFERRAL_CODE}
              </span>
              <button
                onClick={handleCopy}
                className="transition-opacity hover:opacity-80 ml-1"
                aria-label="Copy referral code"
              >
                {copied
                  ? <Check className="w-4 h-4" style={{ color: '#86efac' }} />
                  : <Copy className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
                }
              </button>
            </div>
            {copied && (
              <span className="font-sans text-[12px] font-semibold" style={{ color: '#86efac' }}>
                Copied!
              </span>
            )}
          </div>

          {/* right: share buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://wa.me/?text=Use%20my%20referral%20code%20${REFERRAL_CODE}%20on%20Brolly%20Insurance%20and%20we%20both%20get%20%E2%82%A65%2C000%20off!`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-sans font-semibold text-[13px] px-4 py-2 rounded-xl transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#25D366', color: '#fff' }}
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp
            </a>
            <button
              className="font-sans font-semibold text-[13px] px-4 py-2 rounded-xl border transition-colors hover:bg-white/10"
              style={{ borderColor: 'rgba(255,255,255,0.35)', color: 'white' }}
              onClick={handleCopy}
            >
              Share link
            </button>
          </div>

        </div>
      </motion.div>

    </div>
  )
}
