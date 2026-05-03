'use client'
import { motion } from 'framer-motion'

const INSURERS = [
  { name: 'Leadway Assurance',    tag: 'NAICOM Licensed', color: '#1D4ED8' },
  { name: 'AIICO Insurance',      tag: 'NAICOM Licensed', color: '#059669' },
  { name: 'AXA Mansard',          tag: 'NAICOM Licensed', color: '#DC2626' },
  { name: 'NEM Insurance',        tag: 'NAICOM Licensed', color: '#7C3AED' },
  { name: 'NSIA Insurance',       tag: 'NAICOM Licensed', color: '#0284C7' },
  { name: 'Cornerstone Insurance',tag: 'NAICOM Licensed', color: '#D97706' },
  { name: 'Sovereign Trust',      tag: 'NAICOM Licensed', color: '#059669' },
  { name: 'Zenith General',       tag: 'NAICOM Licensed', color: '#1D4ED8' },
  { name: 'Mutual Benefits',      tag: 'NAICOM Licensed', color: '#7C3AED' },
  { name: 'Old Mutual Nigeria',   tag: 'NAICOM Licensed', color: '#0284C7' },
]

// Duplicate for seamless marquee loop
const DOUBLED = [...INSURERS, ...INSURERS]

export default function InsurerPartnersStrip() {
  return (
    <section className="py-10 overflow-hidden" style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'white' }}>
      <div className="max-w-[1280px] mx-auto px-5 lg:px-20 mb-5">
        <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.12em] text-center" style={{ color: 'var(--text-subtle)' }}>
          Partnered with Nigeria&apos;s leading NAICOM-licensed insurers
        </p>
      </div>

      {/* Marquee wrapper */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, white, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, white, transparent)' }} />

        <motion.div
          className="flex gap-4 w-max"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        >
          {DOUBLED.map(({ name, color }, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl border shrink-0"
              style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--surface-raised)' }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="font-sans font-semibold text-[13px] whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
                {name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
