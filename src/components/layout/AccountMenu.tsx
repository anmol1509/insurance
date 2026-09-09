'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, LayoutDashboard, FileText, LogOut, BadgeCheck, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useHydrated } from '@/lib/useHydrated'

/**
 * Signed-in chip for the site header. Falls back to the Login button until
 * the persisted session has rehydrated, so the first paint always matches
 * the server-rendered markup.
 */
export default function AccountMenu({ className }: { className?: string }) {
  const router = useRouter()
  const hydrated = useHydrated()
  const { user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)

  if (!hydrated || !user) {
    return (
      <Link
        href="/login"
        className={className ?? 'hidden md:flex h-9 px-4 items-center rounded-full font-sans font-semibold text-[13.5px] transition-all hover:shadow-md bg-[var(--green-700)] hover:bg-[var(--green-600)] text-white'}
      >
        Login
      </Link>
    )
  }

  return (
    <div className="relative hidden md:block" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-9 pl-1 pr-2.5 flex items-center gap-2 rounded-full border-[1.5px] transition-all hover:shadow-sm"
        style={{ borderColor: 'var(--border-default)', backgroundColor: 'white' }}
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center font-sans font-bold text-[11px] text-white"
          style={{ backgroundColor: 'var(--green-700)' }}
        >
          {user.initials || <User className="w-3.5 h-3.5" />}
        </span>
        <span className="font-sans font-semibold text-[13px] max-w-[110px] truncate" style={{ color: 'var(--text-primary)' }}>
          {user.name || user.phone || user.email}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-11 w-[248px] bg-white rounded-2xl border shadow-lg p-2 z-50"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <div className="px-3 py-2.5 border-b mb-1" style={{ borderColor: 'var(--border-subtle)' }}>
              <p className="font-sans font-semibold text-[13px] flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                Signed in <BadgeCheck className="w-3.5 h-3.5" style={{ color: 'var(--green-700)' }} />
              </p>
              <p className="font-sans text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>
                {user.phone || user.email}
              </p>
            </div>

            {[
              { icon: LayoutDashboard, label: 'My dashboard', href: '/dashboard' },
              { icon: FileText, label: 'My policies', href: '/dashboard/policies' },
            ].map(({ icon: Icon, label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[var(--surface-raised)] transition-colors font-sans text-[13px]"
                style={{ color: 'var(--text-primary)' }}
              >
                <Icon className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> {label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => { logout(); setOpen(false); router.push('/') }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[var(--surface-raised)] transition-colors font-sans text-[13px]"
              style={{ color: 'var(--error)' }}
            >
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
