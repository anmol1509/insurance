import Link from 'next/link'
import Logo from '@/components/ui/Logo'

const footerLinks = {
  PRODUCTS: [
    { label: 'Motor Insurance', href: '/motor' },
    { label: 'Medical Insurance', href: '/medical' },
    { label: 'Travel Insurance', href: '/travel' },
    { label: 'Business Insurance', href: '/business' },
    { label: 'Renew Policy', href: '/renewals' },
  ],
  COMPANY: [
    { label: 'About us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Media kit', href: '/media' },
    { label: 'Partnerships', href: '/partners' },
  ],
  LEGAL: [
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms & conditions', href: '/terms' },
    { label: 'NAICOM disclosure', href: '/naicom' },
    { label: 'NDPR compliance', href: '/ndpr' },
    { label: 'Financials', href: '/financials' },
  ],
  SUPPORT: [
    { label: 'Contact us', href: '/contact' },
    { label: 'File a claim', href: '/claims' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Agent login', href: '/agent' },
  ],
}

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/shopinsurance_ng',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/shopinsurance-ng',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'X (Twitter)',
    href: 'https://x.com/shopinsurance_ng',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.264 5.633 5.9-5.633zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@shopinsurance_ng',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/shopinsurance.ng',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#011a14', color: 'white' }} className="pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0">
      {/* NAICOM regulatory bar */}
      <div className="border-b" style={{ borderColor: '#1a3329', backgroundColor: '#010f0c' }}>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-20 py-3 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            <span className="font-sans font-semibold text-[12px]" style={{ color: '#9CA3AF' }}>
              NAICOM Licensed · Licence No. LIC/INS/NIA/2024/0042
            </span>
          </div>
          <div className="h-3 w-px hidden md:block" style={{ backgroundColor: '#1e3d2e' }} />
          <span className="font-sans text-[12px]" style={{ color: '#6B7280' }}>
            RC 1234567 · All underwriters on this platform are NAICOM-regulated
          </span>
          <div className="h-3 w-px hidden md:block" style={{ backgroundColor: '#1e3d2e' }} />
          <span className="font-sans text-[12px]" style={{ color: '#6B7280' }}>NDPR Compliant</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 lg:px-20 pt-14 pb-10">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          {/* Brand */}
          <div className="max-w-[280px]">
            <div className="mb-4">
              <Logo size={36} variant="white" wordmarkColor="white" />
            </div>
            <p className="font-sans text-[13px] leading-relaxed mb-4" style={{ color: '#6B7280' }}>
              Nigeria's smartest insurance platform. Compare motor, health, travel and business cover from multiple NAICOM-licensed insurers — free, in minutes.
            </p>
            <div className="space-y-1">
              <p className="font-sans text-[13px]" style={{ color: '#6B7280' }}>
                14 Adeola Odeku Street, Victoria Island
              </p>
              <p className="font-sans text-[13px]" style={{ color: '#6B7280' }}>Lagos, Nigeria · 101241</p>
              <a href="tel:+2348001234567" className="font-sans text-[13px] hover:text-white transition-colors" style={{ color: '#9CA3AF' }}>
                +234 800 123 4567
              </a>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex flex-col gap-3">
            <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.1em]" style={{ color: '#4B5563' }}>Follow us</p>
            <div className="flex gap-2.5 flex-wrap">
              {socials.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 hover:border-white/40 hover:bg-white/10"
                  style={{ borderColor: '#1e3d2e', color: '#9CA3AF' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1a3329' }} />

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10">
          {Object.entries(footerLinks).map(([col, links]) => (
            <div key={col}>
              <p className="font-sans font-bold text-xs uppercase tracking-[0.1em] mb-4" style={{ color: 'white' }}>
                {col}
              </p>
              <div className="flex flex-col gap-0.5">
                {links.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="block font-sans text-sm py-1.5 transition-colors duration-150 hover:text-white"
                    style={{ color: '#6B7280' }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 mt-10"
          style={{ borderTop: '1px solid #1a3329' }}
        >
          <p className="font-sans text-xs" style={{ color: '#4B5563' }}>
            © {new Date().getFullYear()} ShopInsurance Nigeria Ltd. NAICOM Licensed · RC 1234567
          </p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-sans text-[11px] mr-1" style={{ color: '#4B5563' }}>Accepted payments:</span>
            {['Paystack', 'Flutterwave', 'Visa', 'Mastercard'].map((p) => (
              <span
                key={p}
                className="font-sans font-medium text-[11px] px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid #1e3d2e', color: '#9CA3AF' }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
