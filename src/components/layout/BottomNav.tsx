'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Plus, FileText, User, X, Car, Heart, Plane, Building2, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const HIDDEN_PREFIXES = ['/quote/', '/dashboard', '/admin', '/login', '/register']

const products = [
  { name: 'Motor',    href: '/quote/motor',    color: '#1D4ED8', icon: Car,       from: '₦15,000/yr', desc: 'Car, SUV, truck cover' },
  { name: 'Medical',  href: '/quote/medical',  color: '#059669', icon: Heart,     from: '₦45,000/yr', desc: 'HMO & health plans' },
  { name: 'Travel',   href: '/quote/travel',   color: '#D97706', icon: Plane,     from: '₦12,000/yr', desc: 'Single & multi-trip' },
  { name: 'Business', href: '/quote/business', color: '#7C3AED', icon: Building2, from: '₦60,000/yr', desc: 'Property & liability' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [sheetOpen, setSheetOpen] = useState(false)

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null

  const active = (prefix: string | string[]) =>
    Array.isArray(prefix) ? prefix.some((p) => pathname.startsWith(p)) : pathname === prefix || pathname.startsWith(prefix)

  return (
    <>
      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[70] md:hidden"
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[28px] z-[71] md:hidden overflow-hidden"
              style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom, 16px))' }}
            >
              {/* Drag handle */}
              <div className="w-10 h-1 bg-[var(--border-medium)] rounded-full mx-auto mt-3 mb-4" />

              <div className="px-5 pb-2">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>
                    Get a Quote
                  </p>
                  <button
                    type="button"
                    onClick={() => setSheetOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--surface-raised)' }}
                  >
                    <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {products.map(({ name, href, color, icon: Icon, from, desc }) => (
                    <Link
                      key={name}
                      href={href}
                      onClick={() => setSheetOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl border transition-colors active:scale-[0.98]"
                      style={{ borderColor: 'var(--border-default)' }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${color}15` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
                          {name} Insurance
                        </p>
                        <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
                          {desc} · from {from}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 shrink-0" style={{ color: 'var(--text-subtle)' }} />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom tab bar */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white border-t"
        style={{
          borderColor: 'var(--border-default)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex items-stretch h-16">
          {/* Home */}
          <Link
            href="/"
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
              active('/') && pathname === '/' ? 'text-orange-500' : 'text-[var(--text-subtle)]'
            )}
          >
            <Home className="w-5 h-5" />
            <span className="font-sans text-[10px] font-medium">Home</span>
          </Link>

          {/* Products */}
          <Link
            href="/motor"
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
              active(['/motor', '/medical', '/travel', '/business']) ? 'text-orange-500' : 'text-[var(--text-subtle)]'
            )}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="font-sans text-[10px] font-medium">Products</span>
          </Link>

          {/* Center quote button */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="w-14 h-14 -mt-6 rounded-full bg-orange-500 flex items-center justify-center transition-transform active:scale-95"
              style={{ boxShadow: '0 4px 20px rgba(255,107,53,0.45)' }}
              aria-label="Get a quote"
            >
              <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
            </button>
            <span className="font-sans text-[10px] font-medium text-[var(--text-subtle)] mt-0.5">Quote</span>
          </div>

          {/* Claims */}
          <Link
            href="/claims/new"
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
              active('/claims') ? 'text-orange-500' : 'text-[var(--text-subtle)]'
            )}
          >
            <FileText className="w-5 h-5" />
            <span className="font-sans text-[10px] font-medium">Claims</span>
          </Link>

          {/* Account */}
          <Link
            href="/login"
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors',
              active(['/login', '/register', '/dashboard']) ? 'text-orange-500' : 'text-[var(--text-subtle)]'
            )}
          >
            <User className="w-5 h-5" />
            <span className="font-sans text-[10px] font-medium">Account</span>
          </Link>
        </div>
      </div>
    </>
  )
}
