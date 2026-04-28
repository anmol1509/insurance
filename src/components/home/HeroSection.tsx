'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import WavyUnderline from '@/components/ui/WavyUnderline'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const, delay: i * 0.08 },
  }),
}

const miniCards = [
  {
    label: 'Motor',
    price: '₦65K',
    period: 'from / year',
    bg: 'var(--motor-50)',
    color: 'var(--motor-600)',
    href: '/motor',
    illustration: (
      <svg viewBox="0 0 80 40" width="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="18" width="72" height="16" rx="5" fill="#BFDBFE" />
        <rect x="14" y="8" width="42" height="16" rx="4" fill="#93C5FD" />
        <circle cx="18" cy="34" r="6" fill="#1D4ED8" />
        <circle cx="62" cy="34" r="6" fill="#1D4ED8" />
        <circle cx="18" cy="34" r="3" fill="#EFF6FF" />
        <circle cx="62" cy="34" r="3" fill="#EFF6FF" />
        <rect x="30" y="10" width="20" height="10" rx="2" fill="#DBEAFE" />
      </svg>
    ),
  },
  {
    label: 'Medical',
    price: '₦45K',
    period: 'from / year',
    bg: 'var(--medical-50)',
    color: 'var(--medical-600)',
    href: '/medical',
    illustration: (
      <svg viewBox="0 0 80 60" width="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="4" width="20" height="52" rx="4" fill="#6EE7B7" />
        <rect x="4" y="22" width="72" height="20" rx="4" fill="#6EE7B7" />
        <rect x="36" y="10" width="8" height="40" rx="2" fill="#059669" />
        <rect x="10" y="28" width="60" height="8" rx="2" fill="#059669" />
      </svg>
    ),
  },
  {
    label: 'Travel',
    price: '₦8K',
    period: 'from / trip',
    bg: 'var(--travel-50)',
    color: 'var(--travel-600)',
    href: '/travel',
    illustration: (
      <svg viewBox="0 0 80 40" width="80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 28 L40 8 L72 28" stroke="#FCD34D" strokeWidth="4" strokeLinecap="round" />
        <path d="M40 8 L40 32" stroke="#D97706" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="40" cy="10" rx="14" ry="5" fill="#FDE68A" />
        <path d="M26 20 L54 20" stroke="#D97706" strokeWidth="2" />
        <circle cx="40" cy="34" r="4" fill="#FCD34D" />
      </svg>
    ),
  },
  {
    label: 'Business',
    price: '₦50K',
    period: 'from / year',
    bg: 'var(--business-50)',
    color: 'var(--business-600)',
    href: '/business',
    illustration: (
      <svg viewBox="0 0 70 60" width="70" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="50" height="38" rx="4" fill="#C4B5FD" />
        <rect x="18" y="4" width="34" height="20" rx="4" fill="#A78BFA" />
        <rect x="24" y="30" width="10" height="14" rx="2" fill="#7C3AED" />
        <rect x="36" y="30" width="10" height="14" rx="2" fill="#7C3AED" />
        <rect x="16" y="28" width="38" height="4" rx="1" fill="#6D28D9" />
      </svg>
    ),
  },
]

export default function HeroSection() {
  return (
    <section className="pt-20 pb-12" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-20">
        <div className="grid lg:grid-cols-[55fr_45fr] gap-12 items-center">
          {/* Left */}
          <div>
            {/* Award badges */}
            <motion.div
              className="flex flex-wrap gap-2.5 mb-6"
              initial="hidden"
              animate="visible"
            >
              <motion.span
                custom={0}
                variants={fadeUp}
                className="inline-flex items-center gap-1.5 bg-white border border-[var(--border-default)] text-[var(--text-secondary)] font-sans font-semibold text-xs px-3.5 py-1.5 rounded-full"
              >
                🏆 Nigeria's #1 Insurance Platform
              </motion.span>
              <motion.span
                custom={1}
                variants={fadeUp}
                className="inline-flex items-center gap-1.5 border font-sans font-semibold text-xs px-3.5 py-1.5 rounded-full"
                style={{
                  backgroundColor: 'var(--green-50)',
                  borderColor: 'var(--green-100)',
                  color: 'var(--green-700)',
                }}
              >
                ✦ Best Insurtech 2025
              </motion.span>
            </motion.div>

            {/* H1 */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="mb-5">
              <h1
                className="font-display font-extrabold leading-[1.08] tracking-tight"
                style={{ fontSize: 'clamp(38px, 5vw, 56px)', color: 'var(--text-primary)' }}
              >
                Have Nigeria&apos;s smartest
                <br />
                insurer by your{' '}
                <span className="relative inline-block">
                  <em
                    className="not-italic font-serif italic"
                    style={{ fontSize: 'clamp(42px, 5.5vw, 62px)' }}
                  >
                    side
                  </em>
                  <span className="absolute -bottom-3 left-0 w-full">
                    <WavyUnderline width={100} />
                  </span>
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-sans text-[17px] leading-relaxed mb-8 max-w-[480px]"
              style={{ color: 'var(--text-muted)' }}
            >
              Instant quotes. Digital certificates. Real claims support.
              <br />
              Trusted by 50,000+ Nigerians.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3 mb-6"
            >
              <Link
                href="/quote/motor"
                className="inline-flex items-center gap-2 h-14 px-8 bg-orange-500 hover:bg-orange-600 text-white rounded-[var(--radius-xl)] font-sans font-semibold text-base transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
              >
                Get a free quote <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#products"
                className="inline-flex items-center h-14 px-8 bg-white border-[1.5px] border-[var(--border-medium)] text-[var(--text-secondary)] rounded-[var(--radius-xl)] font-sans font-semibold text-base hover:bg-[var(--surface-raised)] hover:border-[var(--border-strong)] transition-all duration-200"
              >
                View all products
              </Link>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-5"
            >
              {[
                'Instant NIID certificate',
                'Claims in 24 hours',
                'NAICOM regulated',
              ].map((pill) => (
                <div key={pill} className="flex items-center gap-1.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--green-50)' }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                    >
                      <path
                        d="M2 5 L4 7 L8 3"
                        stroke="var(--green-700)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    {pill}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: mini bento */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-3 max-w-[420px]">
              {miniCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  custom={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                >
                  <Link
                    href={card.href}
                    className="block relative overflow-visible bg-white rounded-4xl border border-[var(--border-default)] p-5 cursor-pointer"
                    style={{ backgroundColor: card.bg }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-sans font-semibold text-xs uppercase tracking-wider"
                        style={{ color: card.color }}
                      >
                        {card.label}
                      </span>
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center border"
                        style={{ borderColor: card.color }}
                      >
                        <ArrowRight className="w-3.5 h-3.5" style={{ color: card.color }} />
                      </div>
                    </div>
                    <p
                      className="font-display font-bold text-3xl leading-none"
                      style={{ color: card.color }}
                    >
                      {card.price}
                    </p>
                    <p className="font-sans text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {card.period}
                    </p>
                    <div className="absolute bottom-0 right-0 pointer-events-none opacity-80">
                      {card.illustration}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Live policy badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-4 mx-auto w-fit bg-white rounded-full shadow-md px-4 py-2.5 flex items-center gap-2.5"
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse shrink-0"
                style={{ backgroundColor: 'var(--green-500)' }}
              />
              <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Policy issued · Motor · Lagos · 2 min ago
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
