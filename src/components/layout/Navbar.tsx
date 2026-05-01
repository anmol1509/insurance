'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ChevronDown, Car, Heart, Plane, Building2, X } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const products = [
  { name: 'Motor',    href: '/motor',    color: '#1D4ED8', icon: Car },
  { name: 'Medical',  href: '/medical',  color: '#059669', icon: Heart },
  { name: 'Travel',   href: '/travel',   color: '#D97706', icon: Plane },
  { name: 'Business', href: '/business', color: '#7C3AED', icon: Building2 },
]

export default function Navbar() {
  const [scrolled, setScrolled]       = useState(false)
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Floating pill navbar */}
      <div
        className="sticky top-0 z-50 px-4 pt-3 pb-0 transition-all"
        style={{ backgroundColor: 'var(--page-bg)' }}
      >
        <div className="max-w-[1280px] mx-auto">
          <nav
            className={cn(
              'bg-white rounded-full border border-[var(--border-default)] px-5 h-[58px] flex items-center justify-between transition-shadow duration-200',
              scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.10)]' : 'shadow-[0_1px_6px_rgba(0,0,0,0.06)]'
            )}
          >
            {/* Logo */}
            <Logo size={34} />

            {/* Desktop centre nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {/* Products dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-3.5 py-2 rounded-full font-sans font-medium text-[13.5px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
                >
                  Products
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', productsOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-[var(--border-default)] p-1.5 z-50"
                    >
                      {products.map(({ name, href, color, icon: Icon }) => (
                        <Link
                          key={name}
                          href={href}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[var(--surface-raised)] transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
                            <Icon className="w-3.5 h-3.5" style={{ color }} />
                          </div>
                          <span className="font-sans text-sm text-[var(--text-primary)]">{name} Insurance</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[
                { label: 'Renewals', href: '/renewals' },
                { label: 'Claims',   href: '/claims' },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className={cn(
                    'px-3.5 py-2 rounded-full font-sans font-medium text-[13.5px] transition-colors',
                    pathname === href
                      ? 'text-[var(--green-700)] bg-[var(--green-50)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden md:flex h-9 px-4 items-center border-[1.5px] border-[var(--border-medium)] rounded-full font-sans font-medium text-[13.5px] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)] transition-all"
              >
                Login
              </Link>
              <Link
                href="/quote/motor"
                className="h-9 px-4 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-[13.5px] transition-all hover:shadow-md"
              >
                Get a Quote →
              </Link>
              {/* Mobile hamburger */}
              <button
                type="button"
                className="md:hidden p-1.5 text-[var(--text-primary)]"
                onClick={() => setDrawerOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
        {/* Spacer so content isn't hidden under pill */}
        <div className="h-2" />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <Logo size={30} />
                <button type="button" onClick={() => setDrawerOpen(false)}>
                  <X className="w-5 h-5 text-[var(--text-muted)]" />
                </button>
              </div>

              <p className="font-sans font-semibold text-[10px] text-[var(--text-subtle)] uppercase tracking-wider mb-2">Products</p>
              {products.map(({ name, href, color, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="font-sans font-medium text-sm text-[var(--text-primary)]">{name} Insurance</span>
                  </div>
                  <span className="text-[var(--text-muted)]">→</span>
                </Link>
              ))}

              <div className="mt-4 space-y-1">
                {[{ label: 'Renewals', href: '/renewals' }, { label: 'Claims', href: '/claims' }].map(({ label, href }) => (
                  <Link key={label} href={href} onClick={() => setDrawerOpen(false)}
                    className="block py-2.5 font-sans text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <Link href="/login" onClick={() => setDrawerOpen(false)}
                  className="h-11 flex items-center justify-center border-[1.5px] border-[var(--border-medium)] rounded-full font-sans font-medium text-sm text-[var(--text-secondary)]"
                >
                  Login
                </Link>
                <Link href="/quote/motor" onClick={() => setDrawerOpen(false)}
                  className="h-11 flex items-center justify-center bg-orange-500 text-white rounded-full font-sans font-semibold text-sm"
                >
                  Get a Quote →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
