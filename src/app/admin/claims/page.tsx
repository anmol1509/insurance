'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'

type Status = 'all' | 'submitted' | 'under_review' | 'approved' | 'settled' | 'rejected'

const ALL_CLAIMS = [
  { id: 'CLM-2025-0921', user: 'Emeka Okonkwo',     policy: 'SI-2025-042983', type: 'Motor – Accidental Damage',    amount: 320000, date: '2025-03-10', status: 'under_review' as const },
  { id: 'CLM-2025-0908', user: 'Ngozi Adeyemi',      policy: 'SI-2025-012456', type: 'Medical – Hospitalisation',    amount: 145000, date: '2025-04-20', status: 'submitted' as const },
  { id: 'CLM-2025-0887', user: 'Chukwuemeka Ibe',    policy: 'SI-2025-071122', type: 'Travel – Trip Cancellation',   amount: 85000,  date: '2025-04-15', status: 'approved' as const },
  { id: 'CLM-2025-0871', user: 'Fatima Bello',       policy: 'SI-2025-033218', type: 'Business – Fire Damage',       amount: 550000, date: '2025-03-28', status: 'settled' as const },
  { id: 'CLM-2025-0853', user: 'Tunde Fashola',      policy: 'SI-2025-051009', type: 'Motor – Theft',                amount: 1200000, date: '2025-03-15', status: 'rejected' as const },
  { id: 'CLM-2025-0844', user: 'Amara Osei',         policy: 'SI-2025-029341', type: 'Medical – Surgery',            amount: 430000, date: '2025-03-01', status: 'settled' as const },
]

const STATUS_VARIANT: Record<string, 'status-active' | 'status-expiring' | 'status-expired' | 'status-pending'> = {
  submitted: 'status-pending', under_review: 'status-expiring', approved: 'status-active', settled: 'status-active', rejected: 'status-expired',
}
const STATUS_LABEL: Record<string, string> = {
  submitted: 'Submitted', under_review: 'Under Review', approved: 'Approved', settled: 'Settled', rejected: 'Rejected',
}

const FILTERS: { key: Status; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'submitted', label: 'Submitted' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'approved', label: 'Approved' },
  { key: 'settled', label: 'Settled' },
  { key: 'rejected', label: 'Rejected' },
]

export default function AdminClaimsPage() {
  const [filter, setFilter] = useState<Status>('all')
  const shown = filter === 'all' ? ALL_CLAIMS : ALL_CLAIMS.filter((c) => c.status === filter)

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Claims Queue</h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{ALL_CLAIMS.length} claims total</p>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => {
          const count = f.key === 'all' ? ALL_CLAIMS.length : ALL_CLAIMS.filter((c) => c.status === f.key).length
          return (
            <button key={f.key} type="button" onClick={() => setFilter(f.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans font-semibold text-[12px] border transition-colors"
              style={{ backgroundColor: filter === f.key ? '#DC2626' : 'white', borderColor: filter === f.key ? '#DC2626' : 'var(--border-default)', color: filter === f.key ? 'white' : 'var(--text-secondary)' }}>
              {f.label}
              <span className="min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: filter === f.key ? 'rgba(255,255,255,0.25)' : 'var(--surface-raised)', color: filter === f.key ? 'white' : 'var(--text-muted)' }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
        <div className="hidden lg:grid grid-cols-[1fr_1fr_120px_100px_120px] gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
          {['Claimant', 'Type', 'Amount', 'Status', 'Actions'].map((h) => (
            <p key={h} className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>{h}</p>
          ))}
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {shown.map((claim, i) => (
            <motion.div key={claim.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_120px_100px_120px] gap-3 lg:gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors items-center">
              <div>
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{claim.user}</p>
                <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{claim.id} · {new Date(claim.date).toLocaleDateString('en-NG')}</p>
              </div>
              <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{claim.type}</p>
              <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(claim.amount)}</p>
              <Badge variant={STATUS_VARIANT[claim.status]}>{STATUS_LABEL[claim.status]}</Badge>
              <div className="flex gap-2">
                {(claim.status === 'submitted' || claim.status === 'under_review') && (
                  <>
                    <button type="button" title="Approve"
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-[#DCFCE7]"
                      style={{ borderColor: 'var(--border-default)', color: '#16A34A' }}>
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" title="Reject"
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-[#FEE2E2]"
                      style={{ borderColor: 'var(--border-default)', color: '#DC2626' }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
