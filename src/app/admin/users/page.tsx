'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Shield } from 'lucide-react'
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

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const shown = ALL_USERS.filter((u) =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-[24px] tracking-tight" style={{ color: 'var(--text-primary)' }}>Users</h1>
        <p className="font-sans text-[14px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{ALL_USERS.length} registered customers</p>
      </div>

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
          {shown.map((user, i) => (
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
    </div>
  )
}
