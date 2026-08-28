'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Car, Heart, Plane, Building2, Ship, HeartPulse } from 'lucide-react'
import Tag from '@/components/ui/Tag'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const, delay: i * 0.1 },
  }),
}

const products = [
  {
    id: 'A', tag: 'motor' as const, tagLabel: 'Motor Insurance',
    title: 'Car insurance',
    valueProp: 'Simple prices. Super fast claims.',
    sub: "That's our promise.",
    featureLabel: 'NAICOM Approved',
    color: 'var(--motor-600)', borderColor: '#25D366',
    href: '/motor',
    icon: Car,
    large: true,
  },
  {
    id: 'B', tag: 'medical' as const, tagLabel: 'Medical Insurance',
    title: 'Health insurance',
    valueProp: '100% hospital bill payments',
    sub: 'from syringes to surgeries.',
    featureLabel: '700+ Hospitals',
    color: 'var(--medical-600)', borderColor: '#059669',
    href: '/medical',
    icon: Heart,
    large: true,
  },
  {
    id: 'C', tag: 'travel' as const, tagLabel: 'Travel Insurance',
    title: 'Travel insurance',
    valueProp: 'With visa certificate included',
    sub: '',
    featureLabel: 'Worldwide Coverage',
    color: 'var(--travel-600)', borderColor: '#D97706',
    href: '/travel',
    icon: Plane,
    large: false,
  },
  {
    id: 'D', tag: 'business' as const, tagLabel: 'Business Insurance',
    title: 'Business insurance',
    valueProp: 'Protect your premises & staff',
    sub: '',
    featureLabel: 'Flexible Cover',
    color: 'var(--business-600)', borderColor: '#7C3AED',
    href: '/business',
    icon: Building2,
    large: false,
  },
  {
    id: 'E', tag: 'marine' as const, tagLabel: 'Marine Insurance',
    title: 'Marine cargo insurance',
    valueProp: 'Cover for goods in transit',
    sub: '',
    featureLabel: 'NSIA Insurance',
    color: 'var(--marine-600)', borderColor: '#2563EB',
    href: '/marine',
    icon: Ship,
    large: false,
  },
  {
    id: 'F', tag: 'pa' as const, tagLabel: 'Personal Accident',
    title: 'Personal accident cover',
    valueProp: 'Protection against injury & disability',
    sub: '',
    featureLabel: 'NSIA Insurance',
    color: 'var(--pa-600)', borderColor: '#E11D48',
    href: '/personal-accident',
    icon: HeartPulse,
    large: false,
  },
]

export default function ProductBentoGrid() {
  return (
    <section id="products" style={{ backgroundColor: 'var(--page-bg)' }} className="px-5 lg:px-20 pt-16 lg:pt-24 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--green-700)' }}>
          Our Products
        </p>
        <h2 className="font-display font-extrabold text-4xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
          What would you like to insure?
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {products.map((p, i) => {
          const Icon = p.icon
          return (
            <motion.div
              key={p.id}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              whileHover={{ scale: 1.01, boxShadow: '0 12px 40px rgba(0,0,0,0.07)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={p.large ? 'min-h-[260px]' : 'min-h-[140px]'}
            >
              <Link
                href={p.href}
                className="block h-full rounded-2xl border border-[var(--border-default)] overflow-hidden cursor-pointer bg-white"
                style={{ borderLeft: `3px solid ${p.borderColor}` }}
              >
                {p.large ? (
                  <div className="flex flex-col h-full p-7">
                    <Tag variant={p.tag}>{p.tagLabel}</Tag>
                    <h3 className="font-display font-bold text-2xl mt-3" style={{ color: 'var(--text-primary)' }}>
                      {p.title}
                    </h3>
                    <p className="font-sans font-medium text-[15px] mt-1" style={{ color: p.color }}>
                      {p.valueProp}
                    </p>
                    {p.sub && (
                      <p className="font-sans text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.sub}</p>
                    )}
                    <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full border w-fit"
                      style={{ borderColor: 'var(--border-default)' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7 L6 10 L11 4" stroke={p.borderColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-sans font-medium text-xs" style={{ color: p.color }}>{p.featureLabel}</span>
                    </div>

                    <div className="flex items-end justify-between mt-auto pt-5">
                      <div
                        className="w-11 h-11 rounded-full border-[1.5px] flex items-center justify-center shrink-0"
                        style={{ borderColor: 'var(--border-medium)' }}
                      >
                        <ArrowRight className="w-[18px] h-[18px]" style={{ color: 'var(--text-muted)' }} />
                      </div>
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center opacity-10">
                        <Icon className="w-10 h-10" style={{ color: p.borderColor }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center h-full px-7 py-6 gap-4">
                    <div className="flex-1 min-w-0">
                      <Tag variant={p.tag}>{p.tagLabel}</Tag>
                      <h3 className="font-display font-bold text-xl mt-2 leading-tight" style={{ color: 'var(--text-primary)' }}>
                        {p.title}
                      </h3>
                      <p className="font-sans font-medium text-[13px] mt-1" style={{ color: p.color }}>
                        {p.valueProp}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <div
                          className="w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center shrink-0"
                          style={{ borderColor: 'var(--border-medium)' }}
                        >
                          <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                          style={{ borderColor: 'var(--border-default)' }}>
                          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                            <path d="M3 7 L6 10 L11 4" stroke={p.borderColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="font-sans font-medium text-[11px]" style={{ color: p.color }}>{p.featureLabel}</span>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 opacity-10">
                      <Icon className="w-12 h-12" style={{ color: p.borderColor }} />
                    </div>
                  </div>
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
