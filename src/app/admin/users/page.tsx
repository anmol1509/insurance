'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Shield, UserPlus, X, ChevronDown, Check } from 'lucide-react'
import Badge from '@/components/ui/Badge'

const ALL_USERS = [
  { id: 'usr_001', name: 'Emeka Okonkwo',    email: 'customer@demo.com',  phone: '+234 801 234 5678', policies: 3, joinedAt: '2024-03-15', kyc: 'verified' as const },
  { id: 'usr_002', name: 'Ngozi Adeyemi',     email: 'ngozi@example.com',  phone: '+234 802 345 6789', policies: 1, joinedAt: '2024-05-20', kyc: 'verified' as const },
  { id: 'usr_003', name: 'Chukwuemeka Ibe',   email: 'cibe@example.com',   phone: '+234 803 456 7890', policies: 2, joinedAt: '2024-07-10', kyc: 'pending' as const },
  { id: 'usr_004', name: 'Fatima Bello',      email: 'fatima@example.com', phone: '+234 804 567 8901', policies: 1, joinedAt: '2024-09-03', kyc: 'verified' as const },
  { id: 'usr_005', name: 'Tunde Fashola',     email: 'tunde@example.com',  phone: '+234 805 678 9012', policies: 2, joinedAt: '2024-10-18', kyc: 'unverified' as const },
  { id: 'usr_006', name: 'Amara Osei',        email: 'amara@example.com',  phone: '+234 806 789 0123', policies: 1, joinedAt: '2024-12-01', kyc: 'verified' as const },
]

const KYC_VARIANT: Record<string, 'status-active' | 'status-expiring' | 'status-expired'> = {
  verified: 'status-active', pending: 'status-expiring', unverified: 'status-expired',
}

type AdminRole = 'super_admin' | 'manager' | 'claims_officer' | 'support'

const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  manager: 'Manager',
  claims_officer: 'Claims Officer',
  support: 'Support',
}

type Permission =
  | 'view_policies' | 'add_policies' | 'edit_policies' | 'delete_policies'
  | 'view_claims' | 'process_claims' | 'approve_claims' | 'reject_claims'
  | 'view_users' | 'edit_users' | 'verify_kyc'
  | 'view_finance' | 'export_reports'
  | 'manage_admins' | 'manage_permissions' | 'system_settings'

const PERMISSION_GROUPS: { label: string; perms: { key: Permission; label: string }[] }[] = [
  {
    label: 'Policies',
    perms: [
      { key: 'view_policies', label: 'View policies' },
      { key: 'add_policies', label: 'Add policies' },
      { key: 'edit_policies', label: 'Edit policies' },
      { key: 'delete_policies', label: 'Delete policies' },
    ],
  },
  {
    label: 'Claims',
    perms: [
      { key: 'view_claims', label: 'View claims' },
      { key: 'process_claims', label: 'Process claims' },
      { key: 'approve_claims', label: 'Approve claims' },
      { key: 'reject_claims', label: 'Reject claims' },
    ],
  },
  {
    label: 'Users',
    perms: [
      { key: 'view_users', label: 'View users' },
      { key: 'edit_users', label: 'Edit users' },
      { key: 'verify_kyc', label: 'Verify KYC' },
    ],
  },
  {
    label: 'Finance',
    perms: [
      { key: 'view_finance', label: 'View finance data' },
      { key: 'export_reports', label: 'Export reports' },
    ],
  },
  {
    label: 'Administration',
    perms: [
      { key: 'manage_admins', label: 'Manage team members' },
      { key: 'manage_permissions', label: 'Manage permissions' },
      { key: 'system_settings', label: 'System settings' },
    ],
  },
]

const ROLE_DEFAULTS: Record<AdminRole, Permission[]> = {
  super_admin: [
    'view_policies', 'add_policies', 'edit_policies', 'delete_policies',
    'view_claims', 'process_claims', 'approve_claims', 'reject_claims',
    'view_users', 'edit_users', 'verify_kyc',
    'view_finance', 'export_reports',
    'manage_admins', 'manage_permissions', 'system_settings',
  ],
  manager: [
    'view_policies', 'add_policies', 'edit_policies',
    'view_claims', 'process_claims', 'approve_claims',
    'view_users', 'edit_users', 'verify_kyc',
    'view_finance', 'export_reports',
  ],
  claims_officer: [
    'view_policies',
    'view_claims', 'process_claims',
    'view_users',
  ],
  support: [
    'view_policies',
    'view_claims',
    'view_users',
  ],
}

interface AdminMember {
  id: string
  name: string
  email: string
  role: AdminRole
  permissions: Permission[]
  active: boolean
  joinedAt: string
}

const INITIAL_ADMINS: AdminMember[] = [
  { id: 'adm_001', name: 'Adaeze Nwosu', email: 'adaeze@shopinsurance.ng', role: 'super_admin', permissions: ROLE_DEFAULTS.super_admin, active: true, joinedAt: '2023-11-01' },
  { id: 'adm_002', name: 'Seun Okafor',  email: 'seun@shopinsurance.ng',   role: 'manager',     permissions: ROLE_DEFAULTS.manager,     active: true, joinedAt: '2024-01-15' },
  { id: 'adm_003', name: 'Kemi Adeyemi', email: 'kemi@shopinsurance.ng',   role: 'claims_officer', permissions: ROLE_DEFAULTS.claims_officer, active: true, joinedAt: '2024-06-10' },
  { id: 'adm_004', name: 'Bayo Ibrahim', email: 'bayo@shopinsurance.ng',   role: 'support',     permissions: ROLE_DEFAULTS.support,     active: false, joinedAt: '2024-09-22' },
]

function PermissionsModal({ member, onClose, onSave }: { member: AdminMember; onClose: () => void; onSave: (m: AdminMember) => void }) {
  const [perms, setPerms] = useState<Permission[]>(member.permissions)
  const [role, setRole] = useState<AdminRole>(member.role)

  function applyPreset(r: AdminRole) {
    setRole(r)
    setPerms(ROLE_DEFAULTS[r])
  }

  function toggle(p: Permission) {
    setPerms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <div>
            <h2 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>Permissions</h2>
            <p className="font-sans text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{member.name}</p>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div>
            <p className="font-sans font-semibold text-[12px] mb-2" style={{ color: 'var(--text-subtle)' }}>ROLE PRESET</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                <button key={r} type="button" onClick={() => applyPreset(r)}
                  className="px-3 py-1.5 rounded-full font-sans font-semibold text-[12px] border transition-colors"
                  style={{ backgroundColor: role === r ? '#DC2626' : 'white', borderColor: role === r ? '#DC2626' : 'var(--border-default)', color: role === r ? 'white' : 'var(--text-secondary)' }}>
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          {PERMISSION_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="font-sans font-semibold text-[12px] mb-2" style={{ color: 'var(--text-subtle)' }}>{group.label.toUpperCase()}</p>
              <div className="space-y-1.5">
                {group.perms.map((p) => {
                  const checked = perms.includes(p.key)
                  return (
                    <button key={p.key} type="button" onClick={() => toggle(p.key)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors text-left"
                      style={{ borderColor: checked ? '#DC2626' : 'var(--border-default)', backgroundColor: checked ? '#FEF2F2' : 'white' }}>
                      <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 border"
                        style={{ borderColor: checked ? '#DC2626' : 'var(--border-medium)', backgroundColor: checked ? '#DC2626' : 'white' }}>
                        {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                      </div>
                      <span className="font-sans text-[13px]" style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-default)' }}>
          <button type="button" onClick={onClose}
            className="h-10 px-5 rounded-xl font-sans font-medium text-[13px] border transition-colors hover:bg-[var(--surface-raised)]"
            style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
            Cancel
          </button>
          <button type="button" onClick={() => onSave({ ...member, role, permissions: perms })}
            className="h-10 px-6 rounded-xl font-sans font-semibold text-[13px] text-white transition-all hover:-translate-y-px"
            style={{ backgroundColor: '#DC2626' }}>
            Save permissions
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (m: AdminMember) => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<AdminRole>('support')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function submit() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Required'
    if (!email.includes('@')) e.email = 'Valid email required'
    setErrors(e)
    if (Object.keys(e).length) return
    onInvite({
      id: `adm_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      permissions: ROLE_DEFAULTS[role],
      active: true,
      joinedAt: new Date().toISOString().slice(0, 10),
    })
  }

  const permCount = ROLE_DEFAULTS[role].length

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <h2 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>Invite Team Member</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]" style={{ color: 'var(--text-muted)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Full name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chioma Eze"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
              style={{ borderColor: errors.name ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? '#DC2626' : 'var(--border-medium)' }} />
            {errors.name && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Email address *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="chioma@shopinsurance.ng"
              className="w-full h-11 rounded-xl border-[1.5px] px-3.5 font-sans text-[14px] outline-none transition-colors"
              style={{ borderColor: errors.email ? '#DC2626' : 'var(--border-medium)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? '#DC2626' : 'var(--border-medium)' }} />
            {errors.email && <p className="font-sans text-[11px] mt-1 text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="font-sans font-medium text-[12px] block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Role</label>
            <div className="relative">
              <select value={role} onChange={(e) => setRole(e.target.value as AdminRole)}
                className="w-full h-11 rounded-xl border-[1.5px] px-3.5 pr-10 font-sans text-[14px] outline-none appearance-none cursor-pointer transition-colors"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)' }}>
                {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
              {ROLE_LABELS[role]} has {permCount} permission{permCount !== 1 ? 's' : ''} by default. You can customise after inviting.
            </p>
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
            <UserPlus className="w-4 h-4" />
            Send invite
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminUsersPage() {
  const [tab, setTab] = useState<'customers' | 'team'>('customers')
  const [search, setSearch] = useState('')
  const [admins, setAdmins] = useState<AdminMember[]>(INITIAL_ADMINS)
  const [showInvite, setShowInvite] = useState(false)
  const [editPerms, setEditPerms] = useState<AdminMember | null>(null)

  const shownUsers = ALL_USERS.filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  function handleInvite(m: AdminMember) {
    setAdmins((prev) => [m, ...prev])
    setShowInvite(false)
  }

  function handleSavePerms(m: AdminMember) {
    setAdmins((prev) => prev.map((a) => a.id === m.id ? m : a))
    setEditPerms(null)
  }

  function toggleActive(id: string) {
    setAdmins((prev) => prev.map((a) => a.id === id ? { ...a, active: !a.active } : a))
  }

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Users</h1>
          <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {tab === 'customers' ? `${ALL_USERS.length} registered customers` : `${admins.length} team members`}
          </p>
        </div>
        {tab === 'team' && (
          <button type="button" onClick={() => setShowInvite(true)}
            className="h-10 px-5 rounded-xl font-sans font-semibold text-[13px] text-white flex items-center gap-2 transition-all hover:-translate-y-px"
            style={{ backgroundColor: '#DC2626' }}>
            <UserPlus className="w-4 h-4" />
            Invite member
          </button>
        )}
      </div>

      <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: 'var(--surface-raised)' }}>
        {(['customers', 'team'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className="px-5 py-2 rounded-lg font-sans font-semibold text-[13px] transition-colors"
            style={{ backgroundColor: tab === t ? 'white' : 'transparent', color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
            {t === 'customers' ? 'Customers' : 'Team & Permissions'}
          </button>
        ))}
      </div>

      {tab === 'customers' ? (
        <>
          <div className="relative max-w-sm mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…"
              className="w-full h-10 pl-9 pr-4 rounded-xl border font-sans text-[13px] outline-none"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#DC2626'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220,38,38,0.08)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
            <div className="hidden lg:grid grid-cols-[2fr_1.5fr_100px_100px_100px] gap-4 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
              {['Customer', 'Contact', 'Policies', 'Joined', 'KYC'].map((h) => (
                <p key={h} className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>{h}</p>
              ))}
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {shownUsers.map((user, i) => (
                <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_100px_100px_100px] gap-3 lg:gap-4 px-5 py-4 hover:bg-[var(--surface-raised)] transition-colors items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-sans font-bold text-[13px] shrink-0"
                      style={{ backgroundColor: 'var(--green-50)', color: 'var(--green-700)' }}>
                      {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                      <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{user.id}</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                    <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{user.phone}</p>
                  </div>
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{user.policies}</p>
                  <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{new Date(user.joinedAt).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' })}</p>
                  <div className="flex items-center gap-1.5">
                    {user.kyc === 'verified' && <Shield className="w-3 h-3" style={{ color: '#16A34A' }} />}
                    <Badge variant={KYC_VARIANT[user.kyc]}>{user.kyc.charAt(0).toUpperCase() + user.kyc.slice(1)}</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {admins.map((member, i) => (
            <motion.div key={member.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border p-5" style={{ borderColor: 'var(--border-default)', opacity: member.active ? 1 : 0.6 }}>
              <div className="flex items-start gap-4 flex-wrap">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-[14px] shrink-0"
                  style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                  {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-sans font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>{member.name}</p>
                    <span className="px-2 py-0.5 rounded-full font-sans font-semibold text-[10px] uppercase tracking-wide"
                      style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
                      {ROLE_LABELS[member.role]}
                    </span>
                    {!member.active && (
                      <span className="px-2 py-0.5 rounded-full font-sans font-semibold text-[10px] uppercase tracking-wide"
                        style={{ backgroundColor: 'var(--surface-raised)', color: 'var(--text-muted)' }}>
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{member.email}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {member.permissions.slice(0, 6).map((p) => {
                      const label = PERMISSION_GROUPS.flatMap((g) => g.perms).find((x) => x.key === p)?.label ?? p
                      return (
                        <span key={p} className="px-2 py-0.5 rounded-full font-sans text-[11px] border"
                          style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-raised)' }}>
                          {label}
                        </span>
                      )
                    })}
                    {member.permissions.length > 6 && (
                      <span className="px-2 py-0.5 rounded-full font-sans text-[11px] border"
                        style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)', backgroundColor: 'var(--surface-raised)' }}>
                        +{member.permissions.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 flex-wrap">
                  <button type="button" onClick={() => setEditPerms(member)}
                    className="h-9 px-4 rounded-xl font-sans font-medium text-[12px] border transition-colors hover:bg-[var(--surface-raised)]"
                    style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}>
                    Edit permissions
                  </button>
                  <button type="button" onClick={() => toggleActive(member.id)}
                    className="h-9 px-4 rounded-xl font-sans font-medium text-[12px] border transition-colors"
                    style={{ borderColor: member.active ? '#DC2626' : 'var(--border-default)', color: member.active ? '#DC2626' : 'var(--text-secondary)', backgroundColor: member.active ? '#FEF2F2' : 'transparent' }}>
                    {member.active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
        {editPerms && <PermissionsModal member={editPerms} onClose={() => setEditPerms(null)} onSave={handleSavePerms} />}
      </AnimatePresence>
    </div>
  )
}
