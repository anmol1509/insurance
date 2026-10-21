'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Car, Heart, Plane, Building2 } from 'lucide-react'

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
    icon: Car, image: '/home/motor-hero.svg',
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
    icon: Heart, image: '/home/medical-hero.svg',
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
    icon: Plane, image: '/home/travel-hero.svg',
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
    icon: Building2, image: '/home/business-hero.svg',
    large: false,
  },
  // Marine and Personal Accident are built (NSIA-backed, full quote flows at
  // /marine and /personal-accident) but hidden from discovery for now — not
  // currently offered. Re-add here to bring them back.
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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
              className="min-h-[270px]"
            >
              <Link
                href={p.href}
                className="block h-full group rounded-2xl border border-[var(--border-default)] overflow-hidden cursor-pointer bg-white"
                style={{ borderLeft: `3px solid ${p.borderColor}` }}
              >
                <div className="relative flex flex-col h-full min-h-[310px] overflow-hidden" style={{background:`linear-gradient(145deg, white 40%, ${p.tag==='motor'?'#e9f9ee':p.tag==='medical'?'#eaf5ff':p.tag==='travel'?'#fff5e6':'#f4efff'} 100%)`}}>
                  <div className="relative h-40 overflow-hidden bg-slate-50"><img src={p.image} alt={`${p.title} illustration`} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                  <div className="p-5 relative flex flex-col flex-1"><div className="absolute -top-6 left-5 bg-white rounded-2xl shadow-md border border-slate-100 w-12 h-12 flex items-center justify-center"><Icon className="w-6 h-6" style={{color:p.color}}/></div><div className="flex items-center justify-end mb-4"><ArrowRight className="w-4 h-4 text-emerald-700"/></div><h3 className="font-display font-bold text-xl text-slate-900">{p.title}</h3><p className="font-sans text-sm mt-1 text-slate-600">{p.valueProp}</p><span className="inline-flex items-center gap-1.5 text-xs font-semibold mt-4" style={{color:p.color}}>{p.featureLabel}</span></div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
