'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X, ChevronDown } from 'lucide-react'
import { formatNaira } from '@/lib/formatters'
import Badge from '@/components/ui/Badge'
import { PRODUCT_COLORS } from '@/lib/mockData'

interface Policy {
  id: string
  user: string
  type: string
  name: string
  insurer: string
  premium: number
  status: 'active' | 'expiring' | 'expired'
}

const INITIAL_POLICIES: Policy[] = [
  { id: 'SI-2025-042983', user: 'Emeka Okonkwo',     type: 'motor',    name: 'Toyota Camry 2020',        insurer: 'Leadway Assurance', premium: 87500,  status: 'active' },
  { id: 'SI-2025-012456', user: 'Emeka Okonkwo',     type: 'medical',  name: 'Family Health Plan',       insurer: 'Hygeia HMO',        premium: 210000, status: 'expiring' },
  { id: 'SI-2025-033218', user: 'Emeka Okonkwo',     type: 'business', name: 'Okonkwo & Sons Office',   insurer: 'NSIA Insurance',    premium: 95000,  status: 'active' },
  { id: 'SI-2025-071122', user: 'Chukwuemeka Ibe',   type: 'travel',   name: 'Paris Trip – 14 days',    insurer: 'AXA Mansard',       premium: 42000,  status: 'expired' },
  { id: 'SI-2025-051009', user: 'Tunde Fashola',     type: 'motor',    name: 'Mercedes-Benz C300',      insurer: 'Cornerstone Ins',   premium: 125000, status: 'active' },
  { id: 'SI-2025-029341', user: 'Amara Osei',        type: 'medical',  name: 'Individual Health Plan',  insurer: 'Hygeia HMO',        premium: 95000,  status: 'active' },
]

const INSURERS = [
  'Leadway Assurance', 'AXA Mansard', 'Hygeia HMO', 'AIICO Insurance',
  'Coronation Insurance', 'NSIA Insurance', 'Cornerstone Insurance', 'Custodian Investment',
]

const CUSTOMERS = ['Emeka Okonkwo', 'Ngozi Adeyemi', 'Chukwuemeka Ibe', 'Fatima Bello', 'Tunde Fashola', 'Amara Osei']

type Filter = 'all' | 'motor' | 'medical' | 'travel' | 'business'

function AddPolicyModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Policy) => void }) {
  const [customer, setCustomer] = useState('')
  const [type, setType] = useState('motor')
  const [name, setName] = useState('')
  const [insurer, setInsurer] = useState('')
  const [premium, setPremium] = useState('')
  const [status, setStatus] = useState<'active' | 'expiring' | 'expired'>('active')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function submit() {
    const e: Record<string, string> = {}
    if (!customer) e.customer = 'Required'
    if (!name.trim()) e.name = 'Required'
    if (!insurer) e.insurer = 'Required'
    if (!premium || isNaN(Number(premium.replace(/,/g, '')))) e.premium = 'Enter a valid amount'
    setErrors(e)
    if (Object.keys(e).length) return

    const id = `SI-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`
    onAdd({ id, user: customer, type, name: name.trim(), insurer, premium: Number(premium.replace(/,/g, '')), status })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10" style={{ borderColor: 'var(--border-default)' }}>
          <h2 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>Add Policy</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Customer *</label>
            <div className="relative">
              <select value={customer} onChange={(e) => setCustomer(e.target.value)}
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 pr-10 font-sans text-[14px] outline-none appearance-none"
                style={{ borderColor: errors.customer ? '#DC2626' : 'var(--border-medium)', color: customer ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                <option value="">Select customer</option>
                {CUSTOMERS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            </div>
            {errors.customer && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.customer}</p>}
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Policy type *</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['motor', 'medical', 'travel', 'business'] as const).map((t) => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className="h-10 rounded-xl font-sans font-semibold text-[12px] border transition-colors"
                  style={{ backgroundColor: type === t ? '#DC2626' : 'white', borderColor: type === t ? '#DC2626' : 'var(--border-default)', color: type === t ? 'white' : 'var(--text-secondary)' }}>
                  {PRODUCT_COLORS[t].emoji} {PRODUCT_COLORS[t].label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Policy / Vehicle name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Toyota Corolla 2019"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
              style={{ borderColor: errors.name ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? '#DC2626' : 'var(--border-medium)' }} />
            {errors.name && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Insurer *</label>
            <div className="relative">
              <select value={insurer} onChange={(e) => setInsurer(e.target.value)}
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 pr-10 font-sans text-[14px] outline-none appearance-none"
                style={{ borderColor: errors.insurer ? '#DC2626' : 'var(--border-medium)', color: insurer ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                <option value="">Select insurer</option>
                {INSURERS.map((ins) => <option key={ins} value={ins}>{ins}</option>)}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            </div>
            {errors.insurer && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.insurer}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Annual premium (₦) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>₦</span>
                <input type="text" inputMode="numeric"
                  value={premium ? Number(premium.replace(/,/g, '')).toLocaleString('en-NG') : ''}
                  onChange={(e) => setPremium(e.target.value.replace(/,/g, '').replace(/\D/g, ''))}
                  placeholder="e.g. 87,500"
                  className="w-full h-11 pl-8 pr-4 rounded-xl border-[1.5px] font-sans text-[14px] outline-none transition-colors"
                  style={{ borderColor: errors.premium ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.premium ? '#DC2626' : 'var(--border-medium)' }} />
              </div>
              {errors.premium && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.premium}</p>}
            </div>
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <div className="relative">
                <select value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'expiring' | 'expired')}
                  className="w-full h-11 rounded-xl border-[1.5px] px-3.5 pr-10 font-sans text-[14px] outline-none appearance-none"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}>
                  <option value="active">Active</option>
                  <option value="expiring">Expiring</option>
                  <option value="expired">Expired</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-default)' }}>
          <button type="button" onClick={onClose}
            className="h-10 px-5 rounded-xl font-sans font-medium text-[13px] border transition-colors hover:bg-[var(--surface-raised)]"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
          <button type="button" onClick={submit}
            className="h-10 px-6 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
            style={{ backgroundColor: '#DC2626' }}>
            <Plus className="w-4 h-4" />
            Add policy
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const shown = policies
    .filter((p) => filter === 'all' || p.type === filter)
    .filter((p) => !search || p.user.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase()))

  const statusVariant = (s: string): 'status-active' | 'status-expiring' | 'status-expired' =>
    s === 'active' ? 'status-active' : s === 'expiring' ? 'status-expiring' : 'status-expired'

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>All Policies</h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{policies.length} policies across all customers</p>
        </div>
        <button type="button" onClick={() => setShowAdd(true)}
          className="h-10 px-5 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
          style={{ backgroundColor: '#DC2626' }}>
          <Plus className="w-4 h-4" />
          Add policy
        </button>
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

      <AnimatePresence>
        {showAdd && <AddPolicyModal onClose={() => setShowAdd(false)} onAdd={(p) => { setPolicies((prev) => [p, ...prev]); setShowAdd(false) }} />}
      </AnimatePresence>
    </div>
  )
}
