'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'
import { PRODUCT_COLORS } from '@/lib/mockData'

const ALL_POLICIES = [
  { id: 'SI-2025-042983', user: 'Emeka Okonkwo',     type: 'motor',    name: 'Toyota Camry 2020',        insurer: 'Leadway Assurance', premium: 87500,  status: 'active' as const },
  { id: 'SI-2025-012456', user: 'Emeka Okonkwo',     type: 'medical',  name: 'Family Health Plan',       insurer: 'Hygeia HMO',        premium: 210000, status: 'expiring' as const },
  { id: 'SI-2025-033218', user: 'Emeka Okonkwo',     type: 'business', name: 'Okonkwo & Sons Office',   insurer: 'NSIA Insurance',    premium: 95000,  status: 'active' as const },
  { id: 'SI-2025-071122', user: 'Chukwuemeka Ibe',   type: 'travel',   name: 'Paris Trip – 14 days',    insurer: 'AXA Mansard',       premium: 42000,  status: 'expired' as const },
  { id: 'SI-2025-051009', user: 'Tunde Fashola',     type: 'motor',    name: 'Mercedes-Benz C300',      insurer: 'Cornerstone Ins',   premium: 125000, status: 'active' as const },
  { id: 'SI-2025-029341', user: 'Amara Osei',        type: 'medical',  name: 'Individual Health Plan',  insurer: 'Hygeia HMO',        premium: 95000,  status: 'active' as const },
]

type Filter = 'all' | 'motor' | 'medical' | 'travel' | 'business'

export default function AdminPoliciesPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')

  const shown = ALL_POLICIES
    .filter((p) => filter === 'all' || p.type === filter)
    .filter((p) => !search || p.user.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase()))

  const statusVariant = (s: string): 'status-active' | 'status-expiring' | 'status-expired' =>
    s === 'active' ? 'status-active' : s === 'expiring' ? 'status-expiring' : 'status-expired'

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>All Policies</h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{ALL_POLICIES.length} policies across all customers</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, user, ref…"
            className="w-full h-10 pl-9 pr-4 rounded-xl border font-sans text-[13px] outline-none transition-all"
            style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.08)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'motor', 'medical', 'travel', 'business'] as Filter[]).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)}
              className="px-3 py-2 rounded-full font-sans font-semibold text-[12px] border transition-colors capitalize"
              style={{ backgroundColor: filter === f ? '#DC2626' : 'white', borderColor: filter === f ? '#DC2626' : 'var(--border-default)', color: filter === f ? 'white' : 'var(--text-secondary)' }}>
              {f === 'all' ? 'All types' : PRODUCT_COLORS[f].emoji + ' ' + PRODUCT_COLORS[f].label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
        <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1fr_100px_100px] gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
          {['Policy', 'Customer', 'Insurer', 'Premium', 'Status'].map((h) => (
            <p key={h} className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>{h}</p>
          ))}
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {shown.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>No policies match your filters.</p>
            </div>
          ) : shown.map((p, i) => {
            const colors = PRODUCT_COLORS[p.type]
            return (
              <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr_100px_100px] gap-3 lg:gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0" style={{ backgroundColor: colors.light }}>{colors.emoji}</div>
                  <div>
                    <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                    <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{p.id}</p>
                  </div>
                </div>
                <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{p.user}</p>
                <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{p.insurer}</p>
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(p.premium)}</p>
                <Badge variant={statusVariant(p.status)}>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</Badge>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
