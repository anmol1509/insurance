'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Tag from '@/components/ui/Tag'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const, delay: i * 0.1 },
  }),
}

const CarIllustration = () => (
  <svg viewBox="0 0 200 100" width="190" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="100" cy="91" rx="80" ry="7" fill="#BFDBFE" opacity="0.5"/>
    <rect x="14" y="52" width="172" height="32" rx="12" fill="#93C5FD"/>
    <path d="M46 52 Q54 22 88 18 L126 18 Q158 18 164 52 Z" fill="#BFDBFE"/>
    <path d="M58 50 Q63 28 86 25 L126 25 Q148 25 152 50 Z" fill="#DBEAFE" opacity="0.85"/>
    <rect x="156" y="58" width="16" height="10" rx="5" fill="#FEF08A"/>
    <path d="M 96 50 L 96 66" stroke="#7CB9F4" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="52" cy="84" r="14" fill="#1D4ED8"/>
    <circle cx="52" cy="84" r="7" fill="#EFF6FF"/>
    <circle cx="148" cy="84" r="14" fill="#1D4ED8"/>
    <circle cx="148" cy="84" r="7" fill="#EFF6FF"/>
  </svg>
)

const MedicalIllustration = () => (
  <svg viewBox="0 0 160 100" width="150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="80" cy="50" r="46" fill="#A7F3D0" opacity="0.4"/>
    <rect x="60" y="10" width="40" height="80" rx="12" fill="#6EE7B7"/>
    <rect x="20" y="38" width="120" height="24" rx="12" fill="#6EE7B7"/>
    <rect x="68" y="18" width="24" height="64" rx="8" fill="#059669"/>
    <rect x="28" y="44" width="104" height="12" rx="5" fill="#059669"/>
    <circle cx="80" cy="50" r="9" fill="#D1FAE5"/>
  </svg>
)

const PlaneIllustration = () => (
  <svg viewBox="0 0 130 80" width="120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="62" cy="44" rx="52" ry="10" fill="#FCD34D" transform="rotate(-18 62 44)"/>
    <ellipse cx="106" cy="32" rx="12" ry="7" fill="#FDE68A" transform="rotate(-18 106 32)"/>
    <path d="M50 42 L20 68 L72 52 Z" fill="#FCD34D"/>
    <path d="M50 42 L20 68 L72 52 Z" fill="#F59E0B" opacity="0.5"/>
    <path d="M24 38 L8 24 L38 34 Z" fill="#FDE68A"/>
    <ellipse cx="56" cy="54" rx="8" ry="4" fill="#F59E0B" transform="rotate(-18 56 54)"/>
    <circle cx="22" cy="18" r="8" fill="white" opacity="0.7"/>
    <circle cx="32" cy="14" r="10" fill="white" opacity="0.7"/>
    <circle cx="44" cy="17" r="7" fill="white" opacity="0.7"/>
    <circle cx="104" cy="60" r="6" fill="white" opacity="0.5"/>
    <circle cx="114" cy="57" r="8" fill="white" opacity="0.5"/>
  </svg>
)

const BuildingIllustration = () => (
  <svg viewBox="0 0 140 100" width="130" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="40" width="30" height="58" rx="4" fill="#DDD6FE"/>
    {[0,1,2].map(r => [0,1].map(c => (
      <rect key={`bl${r}${c}`} x={11+c*14} y={46+r*16} width="9" height="10" rx="2" fill="#A78BFA" opacity="0.6"/>
    )))}
    <rect x="44" y="10" width="52" height="88" rx="6" fill="#C4B5FD"/>
    {[0,1,2,3,4,5].map(r => (
      <rect key={`mw${r}`} x="48" y={16+r*13} width="44" height="9" rx="2" fill="#A78BFA" opacity="0.55"/>
    ))}
    <rect x="58" y="4" width="24" height="8" rx="3" fill="#A78BFA"/>
    <rect x="67" y="0" width="6" height="6" rx="1" fill="#7C3AED"/>
    <rect x="104" y="32" width="30" height="66" rx="4" fill="#EDE9FE"/>
    {[0,1,2].map(r => [0,1].map(c => (
      <rect key={`br${r}${c}`} x={109+c*13} y={38+r*16} width="9" height="10" rx="2" fill="#C4B5FD" opacity="0.7"/>
    )))}
    <rect x="0" y="96" width="140" height="4" rx="2" fill="#C4B5FD" opacity="0.4"/>
  </svg>
)

const products = [
  {
    id: 'A', tag: 'motor' as const, tagLabel: 'Motor Insurance',
    title: 'Car insurance',
    valueProp: 'Simple prices. Super fast claims.',
    sub: "That's our promise.",
    featureLabel: 'NAICOM Approved',
    color: 'var(--motor-600)', colorBg: 'var(--motor-50)', colorCheck: 'var(--motor-100)',
    href: '/motor',
    illustration: <CarIllustration />,
    large: true,
  },
  {
    id: 'B', tag: 'medical' as const, tagLabel: 'Medical Insurance',
    title: 'Health insurance',
    valueProp: '100% hospital bill payments',
    sub: 'from syringes to surgeries. No surprises.',
    featureLabel: '700+ Hospitals',
    color: 'var(--medical-600)', colorBg: 'var(--medical-50)', colorCheck: 'var(--medical-100)',
    href: '/medical',
    illustration: <MedicalIllustration />,
    large: true,
  },
  {
    id: 'C', tag: 'travel' as const, tagLabel: 'Travel Insurance',
    title: 'Travel insurance',
    valueProp: 'With visa certificate included',
    sub: '',
    featureLabel: 'Worldwide Coverage',
    color: 'var(--travel-600)', colorBg: 'var(--travel-50)', colorCheck: 'var(--travel-100)',
    href: '/travel',
    illustration: <PlaneIllustration />,
    large: false,
  },
  {
    id: 'D', tag: 'business' as const, tagLabel: 'Business Insurance',
    title: 'Business insurance',
    valueProp: 'Protect your premises & staff',
    sub: '',
    featureLabel: 'Flexible Cover',
    color: 'var(--business-600)', colorBg: 'var(--business-50)', colorCheck: 'var(--business-100)',
    href: '/business',
    illustration: <BuildingIllustration />,
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
            className={p.large ? 'min-h-[300px]' : 'min-h-[160px]'}
          >
            <Link
              href={p.href}
              className="block h-full rounded-4xl border border-[var(--border-default)] overflow-hidden cursor-pointer"
              style={{ backgroundColor: p.colorBg }}
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
                    style={{ backgroundColor: p.colorBg, borderColor: p.colorCheck }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7 L6 10 L11 4" stroke={p.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-sans font-medium text-xs" style={{ color: p.color }}>{p.featureLabel}</span>
                  </div>
                  <div className="flex items-end justify-between mt-auto pt-5">
                    <div
                      className="w-11 h-11 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-200 hover:bg-[var(--green-700)] hover:border-[var(--green-700)] group"
                      style={{ borderColor: 'var(--border-medium)' }}
                    >
                      <ArrowRight className="w-[18px] h-[18px] group-hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <div className="shrink-0 -mb-1 -mr-1">{p.illustration}</div>
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
                        className="w-9 h-9 rounded-full border-[1.5px] flex items-center justify-center shrink-0 group"
                        style={{ borderColor: 'var(--border-medium)' }}
                      >
                        <ArrowRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                        style={{ backgroundColor: p.colorBg, borderColor: p.colorCheck }}>
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7 L6 10 L11 4" stroke={p.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-sans font-medium text-[11px]" style={{ color: p.color }}>{p.featureLabel}</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center justify-center">{p.illustration}</div>
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
