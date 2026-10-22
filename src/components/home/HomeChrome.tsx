'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Menu, X, Shield } from 'lucide-react'
import AccountMenu from '@/components/layout/AccountMenu'
import { useAuthStore } from '@/store/authStore'
import { useHydrated } from '@/lib/useHydrated'
import s from './homepage.module.css'

export function HomeBrand() {
  return (
    <Link href="/" className={s.brand} aria-label="Shapinsurance home">
      <span className={s.brandMark}>
        <Shield aria-hidden="true" />
        <b>S</b>
      </span>
      <span>Shapinsurance</span>
    </Link>
  )
}

const menus = [
  {
    label: 'Products',
    links: [
      ['Motor insurance', '/motor'],
      ['Medical insurance', '/medical'],
      ['Travel insurance', '/travel'],
      ['Business insurance', '/business'],
    ],
  },
  {
    label: 'Claims',
    links: [
      ['Start a claim', '/claims'],
      ['My claims', '/dashboard/claims'],
    ],
  },
  {
    label: 'Renew',
    links: [
      ['Renew a policy', '/renewals'],
      ['My policies', '/dashboard/policies'],
    ],
  },
  {
    label: 'Learn',
    links: [
      ['Insurance guides', '/blog'],
      ['Frequently asked questions', '/#faqs'],
    ],
  },
]

export function HomeHeader() {
  const [open, setOpen] = useState(false)
  const hydrated = useHydrated()
  const user = useAuthStore((state) => state.user)
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <HomeBrand />
        <nav aria-label="Main navigation" className={s.desktopNav}>
          {menus.map((menu) => (
            <details key={menu.label} className={s.navMenu}>
              <summary>
                {menu.label}
                <ChevronDown size={13} />
              </summary>
              <div>
                {menu.links.map(([label, href]) => (
                  <Link key={href} href={href}>
                    {label}
                  </Link>
                ))}
              </div>
            </details>
          ))}
          <Link href="/contact">Support</Link>
        </nav>
        <div className={s.headerActions}>
          <AccountMenu className={s.login} />
          <Link href="/#get-quote" className={s.button}>
            Get a Quote <ArrowRight size={16} />
          </Link>
          <button
            className={s.menuButton}
            aria-label={open ? 'Close navigation' : 'Open navigation'}
            aria-expanded={open}
            aria-controls="home-mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="home-mobile-nav"
          aria-label="Mobile navigation"
          className={s.mobileNav}
        >
          {menus.map((menu) => (
            <div key={menu.label}>
              <strong>{menu.label}</strong>
              {menu.links.map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)}>
            Contact support
          </Link>
          <Link
            href={hydrated && user ? '/dashboard' : '/login'}
            onClick={() => setOpen(false)}
          >
            {hydrated && user ? 'My account' : 'Log in / Sign up'}
          </Link>
        </nav>
      )}
    </header>
  )
}

export function HomeFooter() {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.footerGrid}>
          <div>
            <HomeBrand />
            <p>Buy. Manage. Claim. Stress free.</p>
          </div>
          <div>
            <h3>Products</h3>
            {menus[0].links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </div>
          <div>
            <h3>Discover</h3>
            <Link href="/#about">About us</Link>
            <Link href="/blog">Insurance guides</Link>
            <Link href="/#partners">Our partners</Link>
          </div>
          <div>
            <h3>Support</h3>
            <Link href="/contact">Help centre</Link>
            <Link href="/claims">Claims</Link>
            <Link href="/renewals">Policy renewal</Link>
            <Link href="/#faqs">FAQs</Link>
          </div>
          <div>
            <h3>Follow us</h3>
            <div className={s.socials}>
              {[
                ['f', 'Facebook', 'https://facebook.com/shopinsurance.ng'],
                ['◎', 'Instagram', 'https://instagram.com/shopinsurance_ng'],
                [
                  'in',
                  'LinkedIn',
                  'https://linkedin.com/company/shopinsurance-ng',
                ],
              ].map(([mark, label, href]) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <b>{mark}</b>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className={s.footerBottom}>
          <p>
            © {new Date().getFullYear()} Shapinsurance. All rights reserved.
          </p>
          <Link href="/contact">Contact us</Link>
        </div>
      </div>
    </footer>
  )
}
