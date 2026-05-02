'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Shield, FileText, Clock, FolderOpen, Settings,
  LogOut, Menu, X, Bell, ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Logo from '@/components/ui/Logo'

const NAV = [
  { label: 'Overview',      href: '/dashboard',            icon: LayoutDashboard },
  { label: 'My Policies',   href: '/dashboard/policies',   icon: Shield },
  { label: 'Claims',        href: '/dashboard/claims',     icon: FileText },
  { label: 'Quote History', href: '/dashboard/quotes',     icon: Clock },
  { label: 'Documents',     href: '/dashboard/documents',  icon: FolderOpen },
  { label: 'Settings',      href: '/dashboard/settings',   icon: Settings },
]

function NavItem({ href, icon: Icon, label, onClick }: { href: string; icon: React.ElementType; label: string; onClick?: () => void }) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans font-medium text-[14px] transition-all"
      style={{
        backgroundColor: active ? 'var(--green-50)' : 'transparent',
        color: active ? 'var(--green-700)' : 'var(--text-muted)',
      }}
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {label}
      {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
    </Link>
  )
}

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-5 border-b border-[var(--border-subtle)]">
        <Logo size={30} />
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map((item) => (
          <NavItem key={item.href} {...item} onClick={onNav} />
        ))}
      </nav>

      <div className="px-4 pb-5 border-t border-[var(--border-subtle)] pt-4">
        {user && (
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-sans font-bold text-[13px] shrink-0"
              style={{ backgroundColor: 'var(--green-50)', color: 'var(--green-700)' }}
            >
              {user.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-[13px] truncate" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
              <p className="font-sans text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{user.email}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-sans font-medium text-[13px] transition-colors hover:bg-[#FEF2F2]"
          style={{ color: 'var(--error)' }}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-[240px] shrink-0 border-r"
        style={{ backgroundColor: 'white', borderColor: 'var(--border-subtle)', position: 'sticky', top: 0, height: '100vh' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] border-r shadow-xl lg:hidden"
              style={{ backgroundColor: 'white', borderColor: 'var(--border-subtle)' }}
            >
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-raised)]"
                style={{ color: 'var(--text-muted)' }}
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent onNav={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center justify-between px-4 py-3 border-b"
          style={{ backgroundColor: 'white', borderColor: 'var(--border-subtle)' }}
        >
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--surface-raised)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Logo size={26} />
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-sans font-bold text-[12px]"
            style={{ backgroundColor: 'var(--green-50)', color: 'var(--green-700)' }}
          >
            {user?.initials ?? '?'}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
