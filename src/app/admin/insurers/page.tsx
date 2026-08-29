'use client'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, ChevronDown, ChevronUp, Building2, Check, Search } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatNaira } from '@/lib/formatters'
import Drawer from '@/components/admin/Drawer'

type ProductType = 'motor' | 'medical' | 'travel' | 'business'
type PlanStatus = 'active' | 'pending' | 'inactive'
type InsurerStatus = 'active' | 'inactive'

interface Plan {
  id: string
  name: string
  type: ProductType
  premiumFrom: number
  premiumTo: number
  features: string[]
  status: PlanStatus
  addedAt: string
}

interface Insurer {
  id: string
  name: string
  rcNumber: string
  contact: string
  email: string
  status: InsurerStatus
  plans: Plan[]
  color: string
  activeSince: string
  policiesSold: number
  premiumGenerated: number
  claimApprovalRate: number
  avgPayoutDays: number
}

const PRODUCT_TYPES: { value: ProductType; label: string; emoji: string }[] = [
  { value: 'motor',    label: 'Motor Insurance',    emoji: '🚗' },
  { value: 'medical',  label: 'Medical Insurance',  emoji: '🏥' },
  { value: 'travel',   label: 'Travel Insurance',   emoji: '✈️' },
  { value: 'business', label: 'Business Insurance', emoji: '🏢' },
]

const PLAN_STATUS_VARIANT: Record<PlanStatus, 'status-active' | 'status-expiring' | 'status-expired'> = {
  active: 'status-active', pending: 'status-expiring', inactive: 'status-expired',
}

const INITIAL_INSURERS: Insurer[] = [
  {
    id: 'ins_001', name: 'Leadway Assurance', rcNumber: 'RC 7588', contact: '+234 800 5329 329', email: 'info@leadway.com', status: 'active', color: '#DC2626',
    activeSince: '2024-06-01', policiesSold: 312, premiumGenerated: 28_400_000, claimApprovalRate: 91, avgPayoutDays: 6,
    plans: [
      { id: 'p1', name: 'Motor Comprehensive Gold', type: 'motor', premiumFrom: 75000, premiumTo: 150000, features: ['Accidental damage', 'Theft cover', 'Third party liability', '24/7 roadside assist'], status: 'active', addedAt: '2025-01-10' },
      { id: 'p2', name: 'Motor Third Party', type: 'motor', premiumFrom: 15000, premiumTo: 25000, features: ['Third party liability', 'NIID certificate included'], status: 'active', addedAt: '2025-01-10' },
    ],
  },
  {
    id: 'ins_002', name: 'AXA Mansard', rcNumber: 'RC 61311', contact: '+234 700 AXAMANSARD', email: 'hello@axamansard.com', status: 'active', color: '#1D4ED8',
    activeSince: '2024-08-15', policiesSold: 187, premiumGenerated: 14_200_000, claimApprovalRate: 87, avgPayoutDays: 8,
    plans: [
      { id: 'p3', name: 'Family Health Protect', type: 'medical', premiumFrom: 120000, premiumTo: 350000, features: ['Inpatient & outpatient', 'Maternity cover', 'Dental & optical', 'Emergency evacuation'], status: 'active', addedAt: '2025-02-14' },
      { id: 'p4', name: 'Schengen Travel Plus', type: 'travel', premiumFrom: 12000, premiumTo: 40000, features: ['Medical expenses abroad', 'Trip cancellation', 'Lost luggage', 'Visa rejection cover'], status: 'active', addedAt: '2025-03-01' },
    ],
  },
  {
    id: 'ins_003', name: 'Hygeia HMO', rcNumber: 'RC 394603', contact: '+234 1 271 4800', email: 'info@hygeiahmo.com', status: 'active', color: '#059669',
    activeSince: '2024-05-20', policiesSold: 218, premiumGenerated: 19_800_000, claimApprovalRate: 94, avgPayoutDays: 4,
    plans: [
      { id: 'p5', name: 'Individual Health Select', type: 'medical', premiumFrom: 45000, premiumTo: 95000, features: ['GP consultations', 'Specialist referrals', 'Lab tests', 'Prescribed drugs'], status: 'active', addedAt: '2025-01-20' },
      { id: 'p6', name: 'SME Corporate Health', type: 'medical', premiumFrom: 200000, premiumTo: 800000, features: ['Group cover up to 50 staff', 'Inpatient & outpatient', 'Wellness programs'], status: 'pending', addedAt: '2025-04-05' },
    ],
  },
  {
    id: 'ins_004', name: 'AIICO Insurance', rcNumber: 'RC 6784', contact: '+234 1 460 3900', email: 'info@aiicoplc.com', status: 'active', color: '#7C3AED',
    activeSince: '2024-09-10', policiesSold: 143, premiumGenerated: 11_600_000, claimApprovalRate: 83, avgPayoutDays: 10,
    plans: [
      { id: 'p7', name: 'Office Shield', type: 'business', premiumFrom: 50000, premiumTo: 200000, features: ['Fire & special perils', 'Burglary', 'Public liability', 'Employers liability'], status: 'active', addedAt: '2025-02-28' },
    ],
  },
  {
    id: 'ins_005', name: 'Cornerstone Insurance', rcNumber: 'RC 52392', contact: '+234 1 280 4670', email: 'info@cornerstone-ng.com', status: 'inactive', color: '#D97706',
    activeSince: '2025-01-05', policiesSold: 98, premiumGenerated: 7_800_000, claimApprovalRate: 76, avgPayoutDays: 14,
    plans: [],
  },
]

function AddPlanModal({ insurer, onClose, onAdd }: { insurer: Insurer; onClose: () => void; onAdd: (plan: Plan) => void }) {
  const [name, setName] = useState('')
  const [type, setType] = useState<ProductType>('motor')
  const [premiumFrom, setPremiumFrom] = useState('')
  const [premiumTo, setPremiumTo] = useState('')
  const [feature, setFeature] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [status, setStatus] = useState<PlanStatus>('pending')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function addFeature() {
    if (feature.trim() && !features.includes(feature.trim())) {
      setFeatures((f) => [...f, feature.trim()])
      setFeature('')
    }
  }

  function submit() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Required'
    if (!premiumFrom || isNaN(Number(premiumFrom))) e.premiumFrom = 'Enter a number'
    if (!premiumTo || isNaN(Number(premiumTo))) e.premiumTo = 'Enter a number'
    setErrors(e)
    if (Object.keys(e).length) return
    onAdd({
      id: `p_${Date.now()}`,
      name: name.trim(),
      type,
      premiumFrom: Number(premiumFrom),
      premiumTo: Number(premiumTo),
      features,
      status,
      addedAt: new Date().toISOString().slice(0, 10),
    })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b sticky top-0 bg-white z-10" style={{ borderColor: 'var(--border-default)' }}>
          <div>
            <h2 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>Add Plan</h2>
            <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{insurer.name}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Plan name */}
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Plan name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Motor Comprehensive Gold"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
              style={{ borderColor: errors.name ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? '#DC2626' : 'var(--border-medium)' }} />
            {errors.name && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.name}</p>}
          </div>

          {/* Product type */}
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Product type *</label>
            <div className="grid grid-cols-2 gap-2">
              {PRODUCT_TYPES.map((t) => (
                <button key={t.value} type="button" onClick={() => setType(t.value)}
                  className="h-10 rounded-xl font-sans font-medium text-[13px] border transition-colors flex items-center justify-center gap-2"
                  style={{ backgroundColor: type === t.value ? '#DC2626' : 'white', borderColor: type === t.value ? '#DC2626' : 'var(--border-default)', color: type === t.value ? 'white' : 'var(--text-secondary)' }}>
                  <span>{t.emoji}</span> {t.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Premium range */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Premium from (₦/yr) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px]" style={{ color: 'var(--text-muted)' }}>₦</span>
                <input type="text" inputMode="numeric"
                  value={premiumFrom ? Number(premiumFrom).toLocaleString('en-NG') : ''}
                  onChange={(e) => setPremiumFrom(e.target.value.replace(/,/g, '').replace(/\D/g, ''))}
                  placeholder="15,000"
                  className="w-full h-11 pl-8 pr-4 rounded-xl border-[1.5px] font-sans text-[14px] outline-none transition-colors"
                  style={{ borderColor: errors.premiumFrom ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.premiumFrom ? '#DC2626' : 'var(--border-medium)' }} />
              </div>
              {errors.premiumFrom && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.premiumFrom}</p>}
            </div>
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Premium to (₦/yr) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px]" style={{ color: 'var(--text-muted)' }}>₦</span>
                <input type="text" inputMode="numeric"
                  value={premiumTo ? Number(premiumTo).toLocaleString('en-NG') : ''}
                  onChange={(e) => setPremiumTo(e.target.value.replace(/,/g, '').replace(/\D/g, ''))}
                  placeholder="150,000"
                  className="w-full h-11 pl-8 pr-4 rounded-xl border-[1.5px] font-sans text-[14px] outline-none transition-colors"
                  style={{ borderColor: errors.premiumTo ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.premiumTo ? '#DC2626' : 'var(--border-medium)' }} />
              </div>
              {errors.premiumTo && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.premiumTo}</p>}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Coverage features</label>
            <div className="flex gap-2">
              <input type="text" value={feature} onChange={(e) => setFeature(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature() } }}
                placeholder="e.g. Accidental damage"
                className="flex-1 h-10 rounded-xl border-[1.5px] px-3.5 font-sans text-[13px] outline-none transition-colors"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }} />
              <button type="button" onClick={addFeature}
                className="h-10 px-4 rounded-xl font-sans font-semibold text-[13px] text-white shrink-0"
                style={{ backgroundColor: '#DC2626' }}>
                Add
              </button>
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {features.map((f) => (
                  <span key={f} className="flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full font-sans text-[12px] border"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-raised)' }}>
                    {f}
                    <button type="button" onClick={() => setFeatures((prev) => prev.filter((x) => x !== f))}
                      className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-red-100" style={{ color: 'var(--text-muted)' }}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
            <div className="flex gap-2">
              {(['active', 'pending', 'inactive'] as PlanStatus[]).map((s) => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className="flex-1 h-10 rounded-xl font-sans font-medium text-[12px] border transition-colors capitalize"
                  style={{ backgroundColor: status === s ? '#DC2626' : 'white', borderColor: status === s ? '#DC2626' : 'var(--border-default)', color: status === s ? 'white' : 'var(--text-secondary)' }}>
                  {s}
                </button>
              ))}
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
            Add plan
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function AddInsurerModal({ onClose, onAdd }: { onClose: () => void; onAdd: (ins: Insurer) => void }) {
  const [name, setName] = useState('')
  const [rcNumber, setRcNumber] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const COLORS = ['#DC2626', '#1D4ED8', '#059669', '#7C3AED', '#D97706', '#DB2777', '#0891B2']
  const [color, setColor] = useState(COLORS[0])

  function submit() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Required'
    if (!rcNumber.trim()) e.rcNumber = 'Required'
    if (!email.includes('@')) e.email = 'Valid email required'
    setErrors(e)
    if (Object.keys(e).length) return
    onAdd({
      id: `ins_${Date.now()}`,
      name: name.trim(),
      rcNumber: rcNumber.trim(),
      contact: contact.trim(),
      email: email.trim(),
      status: 'active',
      plans: [],
      color,
      activeSince: new Date().toISOString().slice(0, 10),
      policiesSold: 0,
      premiumGenerated: 0,
      claimApprovalRate: 0,
      avgPayoutDays: 0,
    })
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <h2 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>Add Insurer</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Company name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. NSIA Insurance"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
              style={{ borderColor: errors.name ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? '#DC2626' : 'var(--border-medium)' }} />
            {errors.name && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>RC Number *</label>
            <input type="text" value={rcNumber} onChange={(e) => setRcNumber(e.target.value)} placeholder="e.g. RC 12345"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
              style={{ borderColor: errors.rcNumber ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.rcNumber ? '#DC2626' : 'var(--border-medium)' }} />
            {errors.rcNumber && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.rcNumber}</p>}
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Phone</label>
              <input type="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+234 800 000 0000"
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }} />
            </div>
            <div>
              <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@insurer.com"
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none"
                style={{ borderColor: errors.email ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? '#DC2626' : 'var(--border-medium)' }} />
              {errors.email && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label className="font-sans font-medium text-[12px] block mb-2" style={{ color: 'var(--text-secondary)' }}>Brand colour</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110"
                  style={{ backgroundColor: c, borderColor: color === c ? 'var(--text-primary)' : 'transparent' }}>
                  {color === c && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                </button>
              ))}
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
            <Building2 className="w-4 h-4" />
            Add insurer
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function InsurerRow({ insurer, onAddPlan, onToggleStatus, onOpenScorecard }: { insurer: Insurer; onAddPlan: (ins: Insurer) => void; onToggleStatus: (id: string) => void; onOpenScorecard: (ins: Insurer) => void }) {
  const [expanded, setExpanded] = useState(false)
  const initials = insurer.name.split(' ').map((w) => w[0]).join('').slice(0, 2)

  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
      {/* Header row */}
      <div className="flex items-center gap-4 px-5 py-4 flex-wrap">
        <button type="button" onClick={() => onOpenScorecard(insurer)}
          className="w-10 h-10 rounded-2xl flex items-center justify-center font-sans font-bold text-[14px] shrink-0 transition-transform hover:scale-105"
          style={{ backgroundColor: insurer.color + '18', color: insurer.color }}>
          {initials}
        </button>

        <button type="button" onClick={() => onOpenScorecard(insurer)} className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-sans font-semibold text-[14px] hover:underline" style={{ color: 'var(--text-primary)' }}>{insurer.name}</p>
            <span className="font-sans text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-muted)' }}>{insurer.rcNumber}</span>
            <Badge variant={insurer.status === 'active' ? 'status-active' : 'status-expired'}>
              {insurer.status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{insurer.email} · {insurer.contact || 'No phone'}</p>
        </button>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="font-sans text-[12px] font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-secondary)' }}>
            {insurer.plans.length} plan{insurer.plans.length !== 1 ? 's' : ''}
          </span>
          <button type="button" onClick={() => onAddPlan(insurer)}
            className="h-9 px-4 rounded-xl font-sans font-semibold text-[12px] text-white flex items-center gap-1.5 transition-all hover:-translate-y-px"
            style={{ backgroundColor: '#DC2626' }}>
            <Plus className="w-3.5 h-3.5" /> Add plan
          </button>
          <button type="button" onClick={() => onToggleStatus(insurer.id)}
            className="h-9 px-4 rounded-xl font-sans font-medium text-[12px] border transition-colors"
            style={{ borderColor: insurer.status === 'active' ? 'var(--border-default)' : '#DC2626', color: insurer.status === 'active' ? 'var(--text-secondary)' : '#DC2626', backgroundColor: insurer.status === 'active' ? 'white' : '#FEF2F2' }}>
            {insurer.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
          {insurer.plans.length > 0 && (
            <button type="button" onClick={() => setExpanded((v) => !v)}
              className="h-9 w-9 rounded-xl flex items-center justify-center border transition-colors hover:bg-[var(--surface-raised)]"
              style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Plans accordion */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div key="plans" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
            <div className="border-t divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {/* Plans table header */}
              <div className="hidden lg:grid grid-cols-[2fr_100px_1fr_100px_80px] gap-4 px-5 py-2" style={{ backgroundColor: 'var(--surface-raised)' }}>
                {['Plan name', 'Type', 'Premium range', 'Status', 'Added'].map((h) => (
                  <p key={h} className="font-sans font-bold text-[10px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>{h}</p>
                ))}
              </div>
              {insurer.plans.map((plan) => {
                const pt = PRODUCT_TYPES.find((t) => t.value === plan.type)
                return (
                  <div key={plan.id} className="grid grid-cols-1 lg:grid-cols-[2fr_100px_1fr_100px_80px] gap-3 lg:gap-4 px-5 py-3.5 items-start hover:bg-[var(--surface-raised)] transition-colors">
                    <div>
                      <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{plan.name}</p>
                      {plan.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {plan.features.slice(0, 3).map((f) => (
                            <span key={f} className="font-sans text-[11px] px-2 py-0.5 rounded-full border"
                              style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)', backgroundColor: 'var(--surface-raised)' }}>
                              {f}
                            </span>
                          ))}
                          {plan.features.length > 3 && (
                            <span className="font-sans text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)', backgroundColor: 'var(--surface-raised)' }}>
                              +{plan.features.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>{pt?.emoji}</span>
                      <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{pt?.label.split(' ')[0]}</span>
                    </div>
                    <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      {formatNaira(plan.premiumFrom)} – {formatNaira(plan.premiumTo)}
                    </p>
                    <Badge variant={PLAN_STATUS_VARIANT[plan.status]}>{plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}</Badge>
                    <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{new Date(plan.addedAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ScorecardDrawerContent({ insurer }: { insurer: Insurer }) {
  const metrics = [
    { label: 'Policies Sold', value: insurer.policiesSold.toLocaleString() },
    { label: 'Premium Generated', value: formatNaira(insurer.premiumGenerated) },
    { label: 'Claim Approval Rate', value: `${insurer.claimApprovalRate}%` },
    { label: 'Avg. Payout Time', value: `${insurer.avgPayoutDays} days` },
  ]
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{insurer.rcNumber} · {insurer.email}</p>
        <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{insurer.contact || 'No phone on file'}</p>
        <p className="font-sans text-[12px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
          Partner since {new Date(insurer.activeSince).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl p-3" style={{ backgroundColor: 'var(--surface-raised)' }}>
            <p className="font-sans font-bold text-[10px] uppercase tracking-[0.06em] mb-1" style={{ color: 'var(--text-subtle)' }}>{m.label}</p>
            <p className="font-display font-bold text-[17px]" style={{ color: 'var(--text-primary)' }}>{m.value}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text-subtle)' }}>
          Plans listed ({insurer.plans.length})
        </p>
        {insurer.plans.length === 0 ? (
          <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>No plans listed yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {insurer.plans.map((p) => (
              <div key={p.id} className="px-3 py-2.5 rounded-xl border" style={{ borderColor: 'var(--border-default)' }}>
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{p.name}</p>
                <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {formatNaira(p.premiumFrom)} – {formatNaira(p.premiumTo)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminInsurersPage() {
  const [insurers, setInsurers] = useState<Insurer[]>(INITIAL_INSURERS)
  const [showAddInsurer, setShowAddInsurer] = useState(false)
  const [addPlanFor, setAddPlanFor] = useState<Insurer | null>(null)
  const [search, setSearch] = useState('')
  const [scorecardFor, setScorecardFor] = useState<Insurer | null>(null)

  const shownInsurers = useMemo(() => insurers.filter((ins) =>
    !search || ins.name.toLowerCase().includes(search.toLowerCase()) || ins.rcNumber.toLowerCase().includes(search.toLowerCase())
  ), [insurers, search])

  function handleAddInsurer(ins: Insurer) {
    setInsurers((prev) => [ins, ...prev])
    setShowAddInsurer(false)
  }

  function handleAddPlan(insurerId: string, plan: Plan) {
    setInsurers((prev) => prev.map((ins) => ins.id === insurerId ? { ...ins, plans: [...ins.plans, plan] } : ins))
    setAddPlanFor(null)
  }

  function toggleStatus(id: string) {
    setInsurers((prev) => prev.map((ins) => ins.id === id ? { ...ins, status: ins.status === 'active' ? 'inactive' : 'active' } : ins))
  }

  const totalPlans = insurers.reduce((sum, ins) => sum + ins.plans.length, 0)
  const activeInsurers = insurers.filter((i) => i.status === 'active').length

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Insurers</h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {activeInsurers} active · {totalPlans} plans listed
          </p>
        </div>
        <button type="button" onClick={() => setShowAddInsurer(true)}
          className="h-10 px-5 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
          style={{ backgroundColor: '#DC2626' }}>
          <Plus className="w-4 h-4" />
          Add insurer
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total insurers', value: insurers.length },
          { label: 'Active', value: activeInsurers },
          { label: 'Total plans', value: totalPlans },
          { label: 'Pending review', value: insurers.reduce((s, ins) => s + ins.plans.filter((p) => p.status === 'pending').length, 0) },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border p-4" style={{ borderColor: 'var(--border-default)' }}>
            <p className="font-sans text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search insurer or RC number…"
          className="w-full h-10 pl-9 pr-4 rounded-xl border font-sans text-[13px] outline-none"
          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.08)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
        />
      </div>

      {/* Insurer list */}
      <div className="space-y-3">
        {shownInsurers.map((insurer, i) => (
          <motion.div key={insurer.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            style={{ opacity: insurer.status === 'inactive' ? 0.65 : 1 }}>
            <InsurerRow
              insurer={insurer}
              onAddPlan={setAddPlanFor}
              onToggleStatus={toggleStatus}
              onOpenScorecard={setScorecardFor}
            />
          </motion.div>
        ))}
        {shownInsurers.length === 0 && (
          <div className="px-5 py-10 text-center font-sans text-[13px] rounded-2xl border" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-default)', backgroundColor: 'white' }}>
            No insurers match your search.
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddInsurer && <AddInsurerModal onClose={() => setShowAddInsurer(false)} onAdd={handleAddInsurer} />}
        {addPlanFor && (
          <AddPlanModal
            insurer={addPlanFor}
            onClose={() => setAddPlanFor(null)}
            onAdd={(plan) => handleAddPlan(addPlanFor.id, plan)}
          />
        )}
      </AnimatePresence>

      <Drawer
        open={!!scorecardFor}
        onClose={() => setScorecardFor(null)}
        title={scorecardFor?.name ?? ''}
        subtitle="Insurer scorecard"
        accent={scorecardFor?.color}
      >
        {scorecardFor && <ScorecardDrawerContent insurer={scorecardFor} />}
      </Drawer>
    </div>
  )
}
