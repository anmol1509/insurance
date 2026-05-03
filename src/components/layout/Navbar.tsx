'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ChevronDown, Car, Heart, Plane, Building2, X, FileText, Search, HelpCircle, ArrowRight, Globe, Check } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const LANGUAGES = [
  { code: 'EN', label: 'English' },
  { code: 'HA', label: 'Hausa' },
  { code: 'YO', label: 'Yorùbá' },
  { code: 'IG', label: 'Igbo' },
]

const products = [
  { name: 'Motor',    href: '/motor',    quoteHref: '/quote/motor',    color: '#1D4ED8', icon: Car,       from: '₦15,000/yr', desc: 'Car, SUV, truck cover' },
  { name: 'Medical',  href: '/medical',  quoteHref: '/quote/medical',  color: '#059669', icon: Heart,     from: '₦45,000/yr', desc: 'HMO & health plans' },
  { name: 'Travel',   href: '/travel',   quoteHref: '/quote/travel',   color: '#D97706', icon: Plane,     from: '₦12,000/yr', desc: 'Single & multi-trip' },
  { name: 'Business', href: '/business', quoteHref: '/quote/business', color: '#7C3AED', icon: Building2, from: '₦60,000/yr', desc: 'Property & liability' },
]

const renewalLinks = [
  { icon: Car,       label: 'Renew Motor Policy',   href: '/renewals/motor',   desc: 'Quick plate-number renewal' },
  { icon: Heart,     label: 'Renew Medical Policy', href: '/renewals/medical', desc: 'Upgrade or renew your HMO' },
  { icon: Search,    label: 'Check Policy Status',  href: '/renewals/status',  desc: 'Lookup by policy reference' },
]

const claimLinks = [
  { icon: FileText,    label: 'File a New Claim',    href: '/claims/new',    desc: 'Start a claim in 2 minutes' },
  { icon: Search,      label: 'Track Existing Claim', href: '/claims/track',  desc: 'Get live status updates' },
  { icon: HelpCircle,  label: 'Claims Guide',         href: '/claims/guide',  desc: 'What to do after an incident' },
]

function MegaDropdown({ items, wide }: { items: { icon: React.ElementType; label: string; href: string; desc: string }[]; wide?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className={cn('absolute top-full mt-2 bg-white rounded-2xl shadow-lg border border-[var(--border-default)] p-1.5 z-50', wide ? 'w-64' : 'w-56')}
      style={{ left: 0 }}
    >
      {items.map(({ icon: Icon, label, href, desc }) => (
        <Link key={label} href={href}
          className="flex items-start gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[var(--surface-raised)] transition-colors group"
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--surface-raised)' }}>
            <Icon className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div>
            <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{label}</p>
            <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{desc}</p>
          </div>
        </Link>
      ))}
    </motion.div>
  )
}

function QuoteDropdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-lg border border-[var(--border-default)] p-2 z-50"
    >
      <p className="font-sans font-bold text-[10px] uppercase tracking-[0.08em] px-3 pt-1 pb-2" style={{ color: 'var(--text-subtle)' }}>
        Choose what to insure
      </p>
      {products.map(({ name, quoteHref, color, icon: Icon, from, desc }) => (
        <Link key={name} href={quoteHref}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--surface-raised)] transition-colors group"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{name} Insurance</p>
            <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{desc} · from {from}</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: 'var(--text-muted)' }} />
        </Link>
      ))}
    </motion.div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [selectedLang, setSelectedLang] = useState('EN')
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggle = (key: string) => setOpenMenu((prev) => (prev === key ? null : key))

  return (
    <>
      <div
        className="sticky top-0 z-50 px-4 pt-2 md:pt-3 pb-0 transition-all"
        style={{ backgroundColor: 'var(--page-bg)', paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
      >
        <div className="max-w-[1280px] mx-auto">
          <nav className={cn(
            'bg-white rounded-full border border-[var(--border-default)] px-5 h-[52px] md:h-[58px] flex items-center justify-between transition-shadow duration-200',
            scrolled ? 'shadow-[0_4px_24px_rgba(0,0,0,0.10)]' : 'shadow-[0_1px_6px_rgba(0,0,0,0.06)]'
          )}>
            <Logo size={34} />

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {/* Products */}
              <div className="relative" onMouseEnter={() => setOpenMenu('products')} onMouseLeave={() => setOpenMenu(null)}>
                <button type="button"
                  className="flex items-center gap-1 px-3.5 py-2 rounded-full font-sans font-medium text-[13.5px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
                >
                  Products <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', openMenu === 'products' && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {openMenu === 'products' && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-[var(--border-default)] p-1.5 z-50">
                      {products.map(({ name, href, color, icon: Icon }) => (
                        <Link key={name} href={href}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-[var(--surface-raised)] transition-colors">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}18` }}>
                            <Icon className="w-3.5 h-3.5" style={{ color }} />
                          </div>
                          <span className="font-sans text-sm" style={{ color: 'var(--text-primary)' }}>{name} Insurance</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Renewals */}
              <div className="relative" onMouseEnter={() => setOpenMenu('renewals')} onMouseLeave={() => setOpenMenu(null)}>
                <button type="button"
                  className={cn('flex items-center gap-1 px-3.5 py-2 rounded-full font-sans font-medium text-[13.5px] transition-colors',
                    pathname.startsWith('/renewals') ? 'text-[var(--green-700)] bg-[var(--green-50)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'
                  )}
                >
                  Renewals <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', openMenu === 'renewals' && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {openMenu === 'renewals' && <MegaDropdown items={renewalLinks} />}
                </AnimatePresence>
              </div>

              {/* Claims */}
              <div className="relative" onMouseEnter={() => setOpenMenu('claims')} onMouseLeave={() => setOpenMenu(null)}>
                <button type="button"
                  className={cn('flex items-center gap-1 px-3.5 py-2 rounded-full font-sans font-medium text-[13.5px] transition-colors',
                    pathname.startsWith('/claims') ? 'text-[var(--green-700)] bg-[var(--green-50)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'
                  )}
                >
                  Claims <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', openMenu === 'claims' && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {openMenu === 'claims' && <MegaDropdown items={claimLinks} />}
                </AnimatePresence>
              </div>

              <Link href="/blog"
                className={cn('px-3.5 py-2 rounded-full font-sans font-medium text-[13.5px] transition-colors',
                  pathname === '/blog' ? 'text-[var(--green-700)] bg-[var(--green-50)]' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'
                )}
              >
                Blog
              </Link>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <div className="relative hidden md:block" onMouseEnter={() => setOpenMenu('lang')} onMouseLeave={() => setOpenMenu(null)}>
                <button type="button"
                  className="flex items-center gap-1.5 h-9 px-3 rounded-full font-sans font-medium text-[13px] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {selectedLang}
                  <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', openMenu === 'lang' && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {openMenu === 'lang' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-40 bg-white rounded-2xl shadow-lg border border-[var(--border-default)] p-1.5 z-50"
                    >
                      {LANGUAGES.map(({ code, label }) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => { setSelectedLang(code); setOpenMenu(null) }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[var(--surface-raised)] transition-colors"
                        >
                          <span className="font-sans text-[13px]" style={{ color: 'var(--text-primary)' }}>{label}</span>
                          {selectedLang === code && <Check className="w-3.5 h-3.5 text-orange-500" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/login"
                className="hidden md:flex h-9 px-4 items-center bg-orange-500 hover:bg-orange-600 rounded-full font-sans font-semibold text-[13.5px] text-white transition-all hover:shadow-md"
              >
                Login
              </Link>

              {/* Get a Quote → dropdown (desktop only — mobile uses bottom nav) */}
              <div className="relative hidden md:block" onMouseEnter={() => setOpenMenu('quote')} onMouseLeave={() => setOpenMenu(null)}>
                <button type="button"
                  className="h-9 px-4 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-[13.5px] transition-all hover:shadow-md"
                >
                  Get a Quote
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', openMenu === 'quote' && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {openMenu === 'quote' && <QuoteDropdown />}
                </AnimatePresence>
              </div>

              <button type="button" className="md:hidden p-2 rounded-full hover:bg-[var(--surface-raised)] text-[var(--text-primary)] transition-colors" onClick={() => setDrawerOpen(true)}>
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </nav>
        </div>
        <div className="h-2" />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50" onClick={() => setDrawerOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="fixed right-0 top-0 bottom-0 w-[85vw] max-w-[340px] bg-white z-[60] shadow-2xl overflow-y-auto"
              style={{ paddingTop: 'max(1.5rem, env(safe-area-inset-top))', paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom,0px))' }}
            >
              <div className="flex items-center justify-between px-5 mb-6">
                <Logo size={30} />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--surface-raised)' }}
                >
                  <X className="w-4 h-4 text-[var(--text-muted)]" />
                </button>
              </div>

              <div className="px-5">
                <p className="font-sans font-bold text-[10px] text-[var(--text-subtle)] uppercase tracking-wider mb-2">Get a Quote</p>
                {products.map(({ name, quoteHref, color, icon: Icon }) => (
                  <Link key={name} href={quoteHref} onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between py-3.5 border-b"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
                        <Icon className="w-4 h-4" style={{ color }} />
                      </div>
                      <span className="font-sans font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{name} Insurance</span>
                    </div>
                    <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} />
                  </Link>
                ))}

                <div className="mt-6 space-y-0.5">
                  <p className="font-sans font-bold text-[10px] text-[var(--text-subtle)] uppercase tracking-wider mb-2">Renewals</p>
                  {renewalLinks.map(({ icon: Icon, label, href }) => (
                    <Link key={label} href={href} onClick={() => setDrawerOpen(false)}
                      className="flex items-center gap-3 py-3 rounded-xl px-2 transition-colors hover:bg-[var(--surface-raised)]"
                    >
                      <Icon className="w-4 h-4" style={{ color: 'var(--text-subtle)' }} />
                      <span className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    </Link>
                  ))}

                  <p className="font-sans font-bold text-[10px] text-[var(--text-subtle)] uppercase tracking-wider mb-2 mt-4">More</p>
                  <Link href="/blog" onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 py-3 rounded-xl px-2 transition-colors hover:bg-[var(--surface-raised)]"
                  >
                    <span className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>Blog</span>
                  </Link>
                </div>

                {/* Language selector */}
                <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="font-sans font-bold text-[10px] text-[var(--text-subtle)] uppercase tracking-wider mb-3">Language</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {LANGUAGES.map(({ code, label }) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedLang(code)}
                        className={cn(
                          'px-3 py-1.5 rounded-full font-sans text-xs font-medium border transition-all',
                          selectedLang === code
                            ? 'bg-orange-50 border-orange-400 text-orange-600'
                            : 'border-[var(--border-medium)] text-[var(--text-muted)]'
                        )}
                      >
                        {code} · {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 px-5 flex flex-col gap-2.5">
                <Link href="/login" onClick={() => setDrawerOpen(false)}
                  className="h-12 flex items-center justify-center bg-orange-500 hover:bg-orange-600 rounded-2xl font-sans font-semibold text-sm text-white transition-all active:scale-[0.98]">
                  Login / Sign up
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
