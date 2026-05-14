'use client'
import { motion } from 'framer-motion'
import { Shield, Award, TrendingUp } from 'lucide-react'

const stats = [
  {
    icon: Award,
    value: '45+',
    label: 'Years of Experience',
    sub: 'Founded 1979 · Trusted since',
  },
  {
    icon: Shield,
    value: '$2M',
    label: 'Professional Indemnity',
    sub: 'Cover protecting every policy',
  },
  {
    icon: TrendingUp,
    value: '97%',
    label: 'Client Retention Rate',
    sub: 'Clients who stay, year on year',
  },
]

export default function SICLTrustSection() {
  return (
    <section
      className="px-5 lg:px-20 py-10 border-y"
      style={{ backgroundColor: 'var(--green-50)', borderColor: '#c8e6d4' }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Powered-by header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8"
        >
          <div className="flex items-center gap-2.5">
            {/* SICL badge */}
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
              style={{ backgroundColor: 'var(--green-700)' }}
            >
              <span className="font-display font-black text-[11px] text-white tracking-tight">SICL</span>
            </div>
            <div>
              <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--green-700)' }}>
                Powered by
              </p>
              <p className="font-display font-bold text-[15px] leading-tight" style={{ color: 'var(--text-primary)' }}>
                Standard Insurance Consultants Limited
              </p>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px mx-4" style={{ backgroundColor: '#a8d5b8' }} />

          <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)', maxWidth: '420px' }}>
            One of Nigeria's leading insurance brokerage firms — and a trusted partner across Africa and the Globe.
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map(({ icon: Icon, value, label, sub }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="flex items-start gap-4 px-5 py-4 rounded-2xl border bg-white"
              style={{ borderColor: '#d4eade' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: 'var(--green-50)', border: '1.5px solid #c8e6d4' }}
              >
                <Icon className="w-5 h-5" style={{ color: 'var(--green-700)' }} />
              </div>
              <div>
                <p className="font-display font-black text-2xl leading-none" style={{ color: 'var(--green-700)' }}>
                  {value}
                </p>
                <p className="font-sans font-semibold text-[13px] mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {label}
                </p>
                <p className="font-sans text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
