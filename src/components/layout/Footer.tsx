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
    { label: 'Careers', href: '/careers' },
    { label: 'Media kit', href: '/media' },
    { label: 'Partnerships', href: '/partners' },
    { label: 'Blog', href: '/blog' },
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

const socialLabels = ['Instagram', 'LinkedIn', 'Twitter', 'YouTube', 'Facebook']

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#000000', color: 'white' }}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-20 pt-16 pb-10">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <Logo size={36} variant="white" wordmarkColor="white" />
            </div>
            <div className="space-y-0.5">
              <p className="font-sans font-medium text-[13px]" style={{ color: '#9CA3AF' }}>
                ShopInsurance Nigeria Ltd
              </p>
              <p className="font-sans text-[13px]" style={{ color: '#6B7280' }}>
                14 Adeola Odeku Street, Victoria Island
              </p>
              <p className="font-sans text-[13px]" style={{ color: '#6B7280' }}>
                Lagos, Nigeria 101241
              </p>
            </div>

            <div className="flex gap-3 mt-4 flex-wrap">
              {['🛡 NAICOM Regulated', '✓ NIID Registered'].map((badge) => (
                <span
                  key={badge}
                  className="font-sans font-medium text-[11px] px-3 py-1 rounded-full border"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#9CA3AF',
                    borderColor: '#374151',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Social icons */}
          <div className="flex gap-2.5">
            {socialLabels.map((label) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200"
                style={{ borderColor: '#374151' }}
              >
                <span className="text-[10px] font-bold" style={{ color: '#9CA3AF' }}>
                  {label[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #1F2937' }} />

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10">
          {Object.entries(footerLinks).map(([col, links]) => (
            <div key={col}>
              <p
                className="font-sans font-bold text-xs uppercase tracking-[0.1em] mb-4"
                style={{ color: 'white' }}
              >
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
          style={{ borderTop: '1px solid #1F2937' }}
        >
          <p className="font-sans text-xs" style={{ color: '#4B5563' }}>
            © 2025 ShopInsurance Nigeria Ltd. NAICOM Licensed. RC 1234567
          </p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-sans text-[11px] mr-2" style={{ color: '#4B5563' }}>
              Accepted payments:
            </span>
            {['Paystack', 'Flutterwave', 'Visa', 'Mastercard'].map((p) => (
              <span
                key={p}
                className="font-sans font-medium text-[11px] px-2.5 py-1 rounded-lg"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid #374151',
                  color: '#9CA3AF',
                }}
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
