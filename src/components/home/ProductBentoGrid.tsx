'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Tag from '@/components/ui/Tag'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const, delay: i * 0.1 },
  }),
}

// SVG illustrations
const CarIllustration = () => (
  <svg viewBox="0 0 160 80" width="160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="36" width="144" height="32" rx="8" fill="#BFDBFE" />
    <rect x="24" y="14" width="90" height="30" rx="6" fill="#93C5FD" />
    <circle cx="34" cy="68" r="12" fill="#1D4ED8" /><circle cx="34" cy="68" r="6" fill="#EFF6FF" />
    <circle cx="126" cy="68" r="12" fill="#1D4ED8" /><circle cx="126" cy="68" r="6" fill="#EFF6FF" />
    <rect x="56" y="17" width="50" height="22" rx="3" fill="#DBEAFE" />
    <rect x="8" y="52" width="144" height="4" rx="2" fill="#93C5FD" />
  </svg>
)

const MedicalIllustration = () => (
  <svg viewBox="0 0 180 90" width="180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="90" cy="45" r="42" fill="#A7F3D0" opacity="0.5" />
    <rect x="66" y="12" width="48" height="66" rx="6" fill="#6EE7B7" />
    <rect x="18" y="36" width="144" height="18" rx="6" fill="#6EE7B7" />
    <rect x="78" y="20" width="24" height="50" rx="3" fill="#059669" />
    <rect x="26" y="42" width="128" height="6" rx="2" fill="#059669" />
  </svg>
)

const PlaneIllustration = () => (
  <svg viewBox="0 0 100 60" width="100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 40 L60 10 L90 30 L60 35 Z" fill="#FDE68A" />
    <path d="M30 50 L60 35 L70 45 Z" fill="#FCD34D" />
    <path d="M60 10 L65 40" stroke="#D97706" strokeWidth="2" />
    <circle cx="58" cy="12" r="8" fill="#FCD34D" />
  </svg>
)

const BuildingIllustration = () => (
  <svg viewBox="0 0 120 90" width="120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="30" width="80" height="58" rx="4" fill="#C4B5FD" />
    <rect x="36" y="6" width="48" height="30" rx="4" fill="#A78BFA" />
    <rect x="10" y="54" width="20" height="34" rx="3" fill="#DDD6FE" />
    <rect x="90" y="54" width="20" height="34" rx="3" fill="#DDD6FE" />
    {[0, 1, 2].map((row) =>
      [0, 1, 2, 3].map((col) => (
        <rect
          key={`${row}-${col}`}
          x={28 + col * 18}
          y={36 + row * 16}
          width="10"
          height="10"
          rx="2"
          fill="#7C3AED"
          opacity={0.7}
        />
      ))
    )}
  </svg>
)

const products = [
  {
    id: 'A',
    tag: 'motor' as const,
    tagLabel: 'Motor Insurance',
    title: 'Car insurance',
    valueProp: 'Simple prices. Super fast claims.',
    sub: "That's our promise.",
    priceLabel: 'Starting at ₦65,000/yr',
    color: 'var(--motor-600)',
    colorBg: 'var(--motor-50)',
    colorCheck: 'var(--motor-100)',
    href: '/motor',
    illustration: <CarIllustration />,
    gridClass: 'col-span-1 row-span-2 min-h-[320px]',
  },
  {
    id: 'B',
    tag: 'medical' as const,
    tagLabel: 'Medical Insurance',
    title: 'Health insurance',
    valueProp: '100% hospital bill payments',
    sub: 'from syringes to surgeries. No surprises.',
    priceLabel: 'Starting at ₦45,000/yr',
    color: 'var(--medical-600)',
    colorBg: 'var(--medical-50)',
    colorCheck: 'var(--medical-100)',
    href: '/medical',
    illustration: <MedicalIllustration />,
    gridClass: 'col-span-1 row-span-2 min-h-[320px]',
  },
  {
    id: 'C',
    tag: 'travel' as const,
    tagLabel: 'Travel Insurance',
    title: 'Travel insurance',
    valueProp: 'With visa certificate included',
    sub: '',
    priceLabel: 'Starting at ₦8,000/trip',
    color: 'var(--travel-600)',
    colorBg: 'var(--travel-50)',
    colorCheck: 'var(--travel-100)',
    href: '/travel',
    illustration: <PlaneIllustration />,
    gridClass: 'col-span-1 row-span-1 min-h-[160px]',
  },
  {
    id: 'D',
    tag: 'business' as const,
    tagLabel: 'Business Insurance',
    title: 'Business insurance',
    valueProp: 'Protect your premises & staff',
    sub: '',
    priceLabel: 'Starting at ₦50,000/yr',
    color: 'var(--business-600)',
    colorBg: 'var(--business-50)',
    colorCheck: 'var(--business-100)',
    href: '/business',
    illustration: <BuildingIllustration />,
    gridClass: 'col-span-1 row-span-1 min-h-[160px]',
  },
]

export default function ProductBentoGrid() {
  return (
    <section id="products" style={{ backgroundColor: 'var(--page-bg)' }} className="px-5 lg:px-20 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p
          className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2"
          style={{ color: 'var(--green-700)' }}
        >
          Our Products
        </p>
        <h2
          className="font-display font-extrabold text-4xl tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          What would you like to insure?
        </h2>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-[auto_auto] gap-3.5">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            whileHover={{ scale: 1.01, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={p.gridClass}
          >
            <Link
              href={p.href}
              className="relative block bg-white border border-[var(--border-default)] rounded-4xl p-7 h-full overflow-visible cursor-pointer"
              style={{ backgroundColor: p.colorBg }}
            >
              <Tag variant={p.tag}>{p.tagLabel}</Tag>

              <h3
                className="font-display font-bold text-2xl mt-3"
                style={{ color: 'var(--text-primary)' }}
              >
                {p.title}
              </h3>
              <p className="font-sans font-medium text-[15px] mt-1" style={{ color: p.color }}>
                {p.valueProp}
              </p>
              {p.sub && (
                <p className="font-sans text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {p.sub}
                </p>
              )}

              {/* Price badge */}
              <div
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border"
                style={{ backgroundColor: p.colorBg, borderColor: p.colorCheck }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7 L6 10 L11 4"
                    stroke={p.color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-sans font-medium text-xs" style={{ color: p.color }}>
                  {p.priceLabel}
                </span>
              </div>

              {/* Circle arrow CTA */}
              <div className="absolute bottom-6 left-7">
                <div
                  className="w-11 h-11 rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200 hover:bg-[var(--green-700)] hover:border-[var(--green-700)] group"
                  style={{ borderColor: 'var(--border-medium)' }}
                >
                  <ArrowRight
                    className="w-[18px] h-[18px] group-hover:text-white transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  />
                </div>
              </div>

              {/* Illustration — bleeds out of card */}
              <div className="absolute bottom-0 right-0 pointer-events-none" style={{ overflow: 'visible' }}>
                {p.illustration}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
