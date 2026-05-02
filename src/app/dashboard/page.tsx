'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bell, Plus, Upload, FileText, Download, ArrowRight, RefreshCw } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { mockPolicies, mockClaims, PRODUCT_COLORS } from '@/lib/mockData'
import { formatNaira, formatNairaShort } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'

const QUICK_ACTIONS = [
  { label: 'New quote',       icon: Plus,       color: 'var(--green-700)', bg: 'var(--green-50)',     href: '/quote/motor' },
  { label: 'Upload document', icon: Upload,      color: 'var(--motor-600)', bg: 'var(--motor-50)',    href: '/dashboard/documents' },
  { label: 'File a claim',    icon: FileText,    color: 'var(--error)',     bg: '#FEF2F2',            href: '/dashboard/claims' },
  { label: 'Renew policy',    icon: RefreshCw,   color: 'var(--travel-600)', bg: 'var(--travel-50)', href: '/dashboard/policies' },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const firstName = user?.name.split(' ')[0] ?? 'there'

  const activePolicies = mockPolicies.filter((p) => p.status === 'active').length
  const expiringPolicies = mockPolicies.filter((p) => p.status === 'expiring')
  const totalCover = mockPolicies.reduce((sum, p) => sum + p.sumInsured, 0)
  const openClaims = mockClaims.filter((c) => c.status === 'under_review' || c.status === 'submitted').length

  const stats = [
    { label: 'Active Policies', value: String(activePolicies) },
    { label: 'Total Cover',     value: formatNairaShort(totalCover) },
    { label: 'Open Claims',     value: String(openClaims) },
    { label: 'Next Renewal',    value: '14 days' },
  ]

  const statusVariant = (s: string): 'status-active' | 'status-expiring' | 'status-expired' => {
    if (s === 'active') return 'status-active'
    if (s === 'expiring') return 'status-expiring'
    return 'status-expired'
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-extrabold text-[26px] tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {firstName} 👋
          </h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {activePolicies} active {activePolicies === 1 ? 'policy' : 'policies'} · {openClaims} open {openClaims === 1 ? 'claim' : 'claims'}
          </p>
        </div>
        <Link
          href="/dashboard/settings"
          className="hidden lg:flex w-10 h-10 rounded-full items-center justify-center border transition-colors hover:bg-[var(--surface-raised)]"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <Bell className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
        </Link>
      </div>

      {/* Renewal alert */}
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

      {/* Stats */}
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
            <p className="font-sans font-medium text-[11px] uppercase tracking-[0.07em] mb-1.5" style={{ color: 'var(--text-subtle)' }}>
              {stat.label}
            </p>
            <p className="font-display font-bold text-[28px] leading-none" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Policies */}
      <div className="rounded-2xl border overflow-hidden mb-6" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>My Policies</p>
          <Link href="/dashboard/policies" className="font-sans font-semibold text-[12px] hover:underline" style={{ color: 'var(--green-700)' }}>
            View all →
          </Link>
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {mockPolicies.map((p) => {
            const colors = PRODUCT_COLORS[p.productType]
            const expDate = new Date(p.expiryDate)
            const daysLeft = Math.ceil((expDate.getTime() - Date.now()) / 86400000)
            return (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px] shrink-0"
                  style={{ backgroundColor: colors.light }}
                >
                  {colors.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-semibold text-[14px] truncate" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {p.insurer} · {p.ref}
                  </p>
                </div>
                <div className="hidden sm:block text-right shrink-0">
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                    {formatNaira(p.sumInsured)}
                  </p>
                  <p className="font-sans text-[11px]" style={{ color: daysLeft < 30 ? 'var(--error)' : 'var(--text-muted)' }}>
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

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: action.bg }}>
                <action.icon className="w-4 h-4" style={{ color: action.color }} />
              </div>
              <p className="font-sans font-semibold text-[13px] flex-1" style={{ color: 'var(--text-primary)' }}>{action.label}</p>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
