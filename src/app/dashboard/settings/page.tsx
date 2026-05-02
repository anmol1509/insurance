'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Shield, User, Lock } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [saved, setSaved] = useState(false)
  const [curPw, setCurPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwSaved, setPwSaved] = useState(false)

  const handleProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPwSaved(true)
    setCurPw('')
    setNewPw('')
    setTimeout(() => setPwSaved(false), 3000)
  }

  const kycColor = user?.kycStatus === 'verified' ? 'var(--success)' : user?.kycStatus === 'pending' ? 'var(--warning)' : 'var(--error)'
  const kycBg = user?.kycStatus === 'verified' ? '#DCFCE7' : user?.kycStatus === 'pending' ? '#FEF9C3' : '#FEE2E2'
  const kycLabel = user?.kycStatus === 'verified' ? 'Identity verified' : user?.kycStatus === 'pending' ? 'Verification pending' : 'Identity not verified'

  const inputCls = "w-full h-11 rounded-xl border px-3.5 font-sans text-[14px] outline-none transition-all"

  return (
    <div className="px-4 lg:px-8 py-6 max-w-[700px] mx-auto">
      <h1 className="font-display font-extrabold text-[24px] tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>
        Settings
      </h1>
      <p className="font-sans text-[14px] mb-6" style={{ color: 'var(--text-muted)' }}>
        Manage your account details and security.
      </p>

      {/* KYC banner */}
      <div
        className="flex items-center gap-3 p-4 rounded-2xl border mb-6"
        style={{ backgroundColor: kycBg, borderColor: 'transparent' }}
      >
        <Shield className="w-5 h-5 shrink-0" style={{ color: kycColor }} />
        <div className="flex-1">
          <p className="font-sans font-semibold text-[13px]" style={{ color: kycColor }}>{kycLabel}</p>
          {user?.kycStatus !== 'verified' && (
            <p className="font-sans text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Verify your identity to unlock faster claims processing and higher coverage limits.
            </p>
          )}
        </div>
        {user?.kycStatus !== 'verified' && (
          <button
            type="button"
            className="shrink-0 px-4 py-2 rounded-xl font-sans font-semibold text-[12px] text-white"
            style={{ backgroundColor: 'var(--green-700)' }}
          >
            Verify now
          </button>
        )}
      </div>

      {/* Profile form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border overflow-hidden mb-4"
        style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
          <User className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>
            Personal Information
          </p>
        </div>
        <form onSubmit={handleProfile} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--green-700)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,92,54,0.08)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>

          <div>
            <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Email address
            </label>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className={inputCls}
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)', backgroundColor: 'var(--surface-raised)', cursor: 'not-allowed' }}
            />
            <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--text-subtle)' }}>
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          <div>
            <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Phone number
            </label>
            <div className="flex">
              <div
                className="flex items-center px-3 border border-r-0 rounded-l-xl font-sans text-[13px] shrink-0"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-raised)' }}
              >
                +234
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 h-11 rounded-r-xl border px-3.5 font-sans text-[14px] outline-none transition-all"
                style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--green-700)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,92,54,0.08)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-sans font-semibold text-[13px] text-white transition-opacity"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              Save changes
            </button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 font-sans text-[13px]"
                style={{ color: 'var(--success)' }}
              >
                <Check className="w-4 h-4" /> Saved
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>

      {/* Password form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border overflow-hidden"
        style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
          <Lock className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
          <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>
            Change Password
          </p>
        </div>
        <form onSubmit={handlePassword} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Current password
            </label>
            <input
              type="password"
              value={curPw}
              onChange={(e) => setCurPw(e.target.value)}
              required
              placeholder="Enter current password"
              className={inputCls}
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--green-700)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,92,54,0.08)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
          <div>
            <label className="block font-sans font-semibold text-[12px] mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              New password
            </label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              required
              placeholder="At least 8 characters"
              className={inputCls}
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--green-700)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,92,54,0.08)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-sans font-semibold text-[13px] text-white"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              Update password
            </button>
            {pwSaved && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 font-sans text-[13px]"
                style={{ color: 'var(--success)' }}
              >
                <Check className="w-4 h-4" /> Updated
              </motion.span>
            )}
          </div>
        </form>
      </motion.div>

      <p className="font-sans text-[11px] text-center mt-5" style={{ color: 'var(--text-subtle)' }}>
        Account since {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }) : '—'} · ID: {user?.id}
      </p>
    </div>
  )
}
