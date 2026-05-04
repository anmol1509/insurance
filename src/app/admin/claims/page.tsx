'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ChevronDown } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'

type Status = 'all' | 'submitted' | 'under_review' | 'approved' | 'settled' | 'rejected'

interface Claim {
  id: string
  user: string
  policy: string
  type: string
  amount: number
  date: string
  status: 'submitted' | 'under_review' | 'approved' | 'settled' | 'rejected'
  assignedTo: string | null
}

const DEPARTMENTS = [
  'Motor Claims Team',
  'Medical Claims Team',
  'Travel Claims Team',
  'Business Claims Team',
  'Legal Department',
  'Claims Manager',
  'Finance & Settlements',
]

const INITIAL_CLAIMS: Claim[] = [
  { id: 'CLM-2025-0921', user: 'Emeka Okonkwo',     policy: 'SI-2025-042983', type: 'Motor – Accidental Damage',    amount: 320000,  date: '2025-03-10', status: 'under_review', assignedTo: 'Motor Claims Team' },
  { id: 'CLM-2025-0908', user: 'Ngozi Adeyemi',      policy: 'SI-2025-012456', type: 'Medical – Hospitalisation',    amount: 145000,  date: '2025-04-20', status: 'submitted',    assignedTo: null },
  { id: 'CLM-2025-0887', user: 'Chukwuemeka Ibe',    policy: 'SI-2025-071122', type: 'Travel – Trip Cancellation',   amount: 85000,   date: '2025-04-15', status: 'approved',     assignedTo: 'Travel Claims Team' },
  { id: 'CLM-2025-0871', user: 'Fatima Bello',       policy: 'SI-2025-033218', type: 'Business – Fire Damage',       amount: 550000,  date: '2025-03-28', status: 'settled',      assignedTo: 'Finance & Settlements' },
  { id: 'CLM-2025-0853', user: 'Tunde Fashola',      policy: 'SI-2025-051009', type: 'Motor – Theft',                amount: 1200000, date: '2025-03-15', status: 'rejected',     assignedTo: 'Legal Department' },
  { id: 'CLM-2025-0844', user: 'Amara Osei',         policy: 'SI-2025-029341', type: 'Medical – Surgery',            amount: 430000,  date: '2025-03-01', status: 'settled',      assignedTo: 'Medical Claims Team' },
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

function AssignDropdown({ claim, onAssign }: { claim: Claim; onAssign: (dept: string | null) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 h-8 px-3 rounded-lg border font-sans text-[12px] font-medium transition-colors hover:bg-[var(--surface-raised)]"
        style={{ borderColor: claim.assignedTo ? '#2563EB' : 'var(--border-default)', color: claim.assignedTo ? '#2563EB' : 'var(--text-muted)', backgroundColor: claim.assignedTo ? '#EFF6FF' : 'white' }}>
        <span className="max-w-[100px] truncate">{claim.assignedTo ?? 'Assign to…'}</span>
        <ChevronDown className="w-3 h-3 shrink-0" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              className="absolute right-0 top-full mt-1.5 z-[70] bg-white rounded-xl border shadow-lg py-1 w-52"
              style={{ borderColor: 'var(--border-default)' }}>
              {claim.assignedTo && (
                <button type="button" onClick={() => { onAssign(null); setOpen(false) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left font-sans text-[13px] hover:bg-[var(--surface-raised)] transition-colors"
                  style={{ color: 'var(--text-muted)' }}>
                  <X className="w-3.5 h-3.5" />
                  Unassign
                </button>
              )}
              {DEPARTMENTS.map((dept) => (
                <button key={dept} type="button" onClick={() => { onAssign(dept); setOpen(false) }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left font-sans text-[13px] hover:bg-[var(--surface-raised)] transition-colors"
                  style={{ color: claim.assignedTo === dept ? '#2563EB' : 'var(--text-primary)' }}>
                  <span>{dept}</span>
                  {claim.assignedTo === dept && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS)
  const [filter, setFilter] = useState<Status>('all')

  const shown = filter === 'all' ? claims : claims.filter((c) => c.status === filter)

  function updateStatus(id: string, status: Claim['status']) {
    setClaims((prev) => prev.map((c) => c.id === id ? { ...c, status } : c))
  }

  function updateAssignment(id: string, dept: string | null) {
    setClaims((prev) => prev.map((c) => c.id === id ? { ...c, assignedTo: dept } : c))
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Claims Queue</h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{claims.length} claims total</p>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => {
          const count = f.key === 'all' ? claims.length : claims.filter((c) => c.status === f.key).length
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
        <div className="hidden lg:grid grid-cols-[1fr_1fr_110px_100px_160px_80px] gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
          {['Claimant', 'Type', 'Amount', 'Status', 'Assigned to', 'Actions'].map((h) => (
            <p key={h} className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>{h}</p>
          ))}
        </div>

        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {shown.map((claim, i) => (
            <motion.div key={claim.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_110px_100px_160px_80px] gap-3 lg:gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors items-center">
              <div>
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{claim.user}</p>
                <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{claim.id} · {new Date(claim.date).toLocaleDateString('en-NG')}</p>
              </div>
              <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{claim.type}</p>
              <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{formatNaira(claim.amount)}</p>
              <Badge variant={STATUS_VARIANT[claim.status]}>{STATUS_LABEL[claim.status]}</Badge>
              <AssignDropdown claim={claim} onAssign={(dept) => updateAssignment(claim.id, dept)} />
              <div className="flex gap-2">
                {(claim.status === 'submitted' || claim.status === 'under_review') && (
                  <>
                    <button type="button" title="Approve" onClick={() => updateStatus(claim.id, 'approved')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-[#DCFCE7]"
                      style={{ borderColor: 'var(--border-default)', color: '#16A34A' }}>
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" title="Reject" onClick={() => updateStatus(claim.id, 'rejected')}
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
