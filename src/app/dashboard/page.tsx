'use client'
import { motion } from 'framer-motion'
import { Bell, ArrowRight, Plus, Upload, FileText, Download } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatNaira } from '@/lib/formatters'

const policies = [
  { name: 'Toyota Camry', ref: 'SI-2025-042983', type: 'motor', cover: 'Comprehensive', sumInsured: '₦3,500,000', expiry: '2025-12-15', status: 'status-active' as const },
  { name: 'Family Medical', ref: 'SI-2025-012456', type: 'medical', cover: 'Standard', sumInsured: '₦5,000,000', expiry: '2025-08-30', status: 'status-expiring' as const },
  { name: 'Business Office', ref: 'SI-2025-033218', type: 'business', cover: 'Fire & Burglary', sumInsured: '₦10,000,000', expiry: '2026-01-10', status: 'status-active' as const },
]

const stats = [
  { label: 'Active Policies', value: '3' },
  { label: 'Next Renewal', value: '14 days' },
  { label: 'Total Cover', value: '₦18.5M' },
  { label: 'Open Claims', value: '0' },
]

const quickActions = [
  { label: 'New quote', icon: Plus, color: 'var(--green-700)', bg: 'var(--green-50)', href: '/quote/motor' },
  { label: 'Upload document', icon: Upload, color: 'var(--motor-600)', bg: 'var(--motor-50)', href: '#' },
  { label: 'File a claim', icon: FileText, color: 'var(--error)', bg: '#FEF2F2', href: '/claims' },
  { label: 'Download cert', icon: Download, color: 'var(--business-600)', bg: 'var(--business-50)', href: '#' },
]

export default function DashboardPage() {
  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }} className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border-default)] px-5 lg:px-20 py-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="font-display font-bold text-[30px]" style={{ color: 'var(--text-primary)' }}>
              Welcome back, Emeka 👋
            </h1>
            <div className="flex items-center gap-3">
              <button type="button" className="w-10 h-10 rounded-full border border-[var(--border-default)] flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors">
                <Bell className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
              </button>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-sans font-semibold" style={{ backgroundColor: 'var(--green-50)', color: 'var(--green-700)' }}>
                EO
              </div>
            </div>
          </div>
          <p className="font-sans text-[15px] mt-2" style={{ color: 'var(--text-muted)' }}>
            3 active policies · 1 renewal due in 14 days
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 lg:px-20 py-8">
        {/* Renewal alert */}
        <div className="flex items-center gap-3 p-4 mb-6 rounded-r-xl" style={{ backgroundColor: 'var(--warning-bg)', borderLeft: '4px solid var(--warning)' }}>
          <span className="text-lg shrink-0">⚠️</span>
          <p className="font-sans font-medium text-sm" style={{ color: '#92400E' }}>
            Your Toyota Camry policy expires in 14 days.{' '}
            <a href="/renewals" className="font-bold underline" style={{ color: 'var(--warning)' }}>Renew now →</a>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-3xl border border-[var(--border-default)] p-6"
            >
              <p className="font-sans font-medium text-xs uppercase tracking-[0.07em] mb-1" style={{ color: 'var(--text-subtle)' }}>
                {stat.label}
              </p>
              <p className="font-display font-bold text-[32px]" style={{ color: 'var(--text-primary)' }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Policies table */}
        <div className="bg-white rounded-4xl border border-[var(--border-default)] overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-[var(--border-subtle)]" style={{ backgroundColor: 'var(--surface-raised)' }}>
            <div className="grid grid-cols-5 gap-4">
              {['Policy', 'Cover', 'Sum Insured', 'Expiry', 'Status'].map((h) => (
                <p key={h} className="font-sans font-bold text-[11px] uppercase tracking-[0.07em]" style={{ color: 'var(--text-subtle)' }}>{h}</p>
              ))}
            </div>
          </div>
          {policies.map((p, i) => {
            const typeColors: Record<string, string> = { motor: 'var(--motor-600)', medical: 'var(--medical-600)', business: 'var(--business-600)' }
            const isExpiring = p.expiry && new Date(p.expiry) < new Date(Date.now() + 30 * 86400000)
            return (
              <div key={p.ref} className="grid grid-cols-5 gap-4 px-6 py-5 border-b border-[var(--border-subtle)] items-center hover:bg-[var(--surface-raised)] transition-colors last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: typeColors[p.type] }}>
                    {p.name[0]}
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                    <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{p.ref}</p>
                  </div>
                </div>
                <Badge variant={p.type as 'motor' | 'medical' | 'business'}>{p.cover}</Badge>
                <p className="font-sans font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>{p.sumInsured}</p>
                <p className="font-sans text-sm" style={{ color: isExpiring ? 'var(--error)' : 'var(--text-secondary)' }}>{new Date(p.expiry).toLocaleDateString('en-NG')}</p>
                <Badge variant={p.status}>
                  {p.status === 'status-active' ? 'Active' : p.status === 'status-expiring' ? 'Expiring' : 'Expired'}
                </Badge>
              </div>
            )
          })}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {quickActions.map((action, i) => (
            <motion.a
              key={action.label}
              href={action.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              whileHover={{ y: -2 }}
              className="bg-white rounded-3xl border border-[var(--border-default)] p-6 flex items-center gap-4 cursor-pointer transition-all hover:border-[var(--green-100)]"
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: action.bg }}>
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <div className="flex-1">
                <p className="font-display font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>{action.label}</p>
              </div>
              <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  )
}
