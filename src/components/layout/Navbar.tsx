'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Shield, ChevronDown, Car, Heart, Plane, Building2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const products = [
  { name: 'Motor', href: '/motor', color: '#1D4ED8', icon: Car },
  { name: 'Medical', href: '/medical', color: '#059669', icon: Heart },
  { name: 'Travel', href: '/travel', color: '#D97706', icon: Plane },
  { name: 'Business', href: '/business', color: '#7C3AED', icon: Building2 },
]

const navLinks = [
  { label: 'Renewals', href: '/renewals' },
  { label: 'Claims', href: '/claims' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-50 bg-white border-b border-[var(--border-default)] transition-shadow duration-200',
          scrolled && 'shadow-md'
        )}
      >
        <div className="max-w-[1280px] mx-auto px-5 lg:px-20 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] bg-[var(--green-700)] flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-[18px] text-[var(--text-primary)]">
              ShopInsurance
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Products dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-3.5 py-2 rounded-[var(--radius-sm)] font-sans font-medium text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
                type="button"
              >
                Products
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {productsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-white rounded-[var(--radius-xl)] shadow-lg border border-[var(--border-default)] p-2 z-50"
                  >
                    {products.map(({ name, href, color, icon: Icon }) => (
                      <Link
                        key={name}
                        href={href}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-[var(--radius-md)] hover:bg-[var(--surface-raised)] transition-colors"
                      >
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-sans text-sm text-[var(--text-primary)]">
                          {name} Insurance
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  'px-3.5 py-2 rounded-[var(--radius-sm)] font-sans font-medium text-sm transition-colors',
                  pathname === href
                    ? 'text-[var(--green-700)] border-b-2 border-[var(--green-700)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden md:flex h-10 px-[18px] items-center border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-xl)] font-sans font-medium text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:border-[var(--border-strong)] transition-all"
            >
              Login
            </Link>

            <Link
              href="/quote/motor"
              className="h-10 px-5 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-[var(--radius-xl)] font-sans font-semibold text-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md"
            >
              Get a Quote →
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-1.5 text-[var(--text-primary)]"
              onClick={() => setDrawerOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

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
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[9px] bg-[var(--green-700)] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" fill="white" />
                  </div>
                  <span className="font-display font-bold text-base">ShopInsurance</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <p className="font-sans font-semibold text-xs text-[var(--text-subtle)] uppercase tracking-wider mb-3">
                Products
              </p>
              {products.map(({ name, href, color, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)] group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${color}15` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <span className="font-sans font-medium text-sm text-[var(--text-primary)]">
                      {name} Insurance
                    </span>
                  </div>
                  <span className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)]">→</span>
                </Link>
              ))}

              <div className="mt-4 space-y-1">
                {navLinks.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className="block py-2.5 font-sans text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setDrawerOpen(false)}
                  className="h-11 flex items-center justify-center border-[1.5px] border-[var(--border-medium)] rounded-[var(--radius-xl)] font-sans font-medium text-sm text-[var(--text-secondary)] hover:bg-[var(--surface-raised)]"
                >
                  Login
                </Link>
                <Link
                  href="/quote/motor"
                  onClick={() => setDrawerOpen(false)}
                  className="h-11 flex items-center justify-center bg-orange-500 text-white rounded-[var(--radius-xl)] font-sans font-semibold text-sm"
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
