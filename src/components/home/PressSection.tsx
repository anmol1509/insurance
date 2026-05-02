'use client'
import { motion } from 'framer-motion'

const pressItems = [
  {
    outlet: 'TechCabal',
    quote: '"ShopInsurance is solving one of Nigeria\'s biggest fintech gaps — accessible, transparent motor cover."',
    color: '#0066FF',
  },
  {
    outlet: 'BusinessDay',
    quote: '"The PolicyBazaar of Nigeria: compare, buy, and claim — all in one place."',
    color: '#E31837',
  },
  {
    outlet: 'Nairametrics',
    quote: '"ShopInsurance cuts the time to get a NIID-registered certificate from days to 3 minutes."',
    color: '#1A7F37',
  },
  {
    outlet: 'Techpoint.africa',
    quote: '"A clean, trustworthy interface that makes buying insurance feel like buying a product — not a policy."',
    color: '#FF4B00',
  },
  {
    outlet: 'The Cable',
    quote: '"Real claims data, real insurer ratings, and zero broker mark-up. This is what insurance needed."',
    color: '#222222',
  },
]

export default function PressSection() {
  return (
    <section className="py-14 px-5 lg:px-20 bg-white border-y border-[var(--border-default)]">
      <div className="max-w-[1280px] mx-auto">
        <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.12em] text-center mb-8" style={{ color: 'var(--text-subtle)' }}>
          As featured in
        </p>

        {/* Logo row */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
          {pressItems.map((item, i) => (
            <motion.div
              key={item.outlet}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <span
                className="font-display font-extrabold text-[18px] tracking-tight"
                style={{ color: item.color, opacity: 0.75 }}
              >
                {item.outlet}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Scrolling quote strip */}
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, white, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, white, transparent)' }} />
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            {[...pressItems, ...pressItems].map((item, i) => (
              <div
                key={i}
                className="w-[320px] shrink-0 rounded-2xl border border-[var(--border-default)] px-6 py-4"
                style={{ backgroundColor: 'var(--surface-raised)' }}
              >
                <p className="font-display font-bold text-sm mb-2" style={{ color: item.color }}>{item.outlet}</p>
                <p className="font-sans text-[13px] leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
                  {item.quote}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
