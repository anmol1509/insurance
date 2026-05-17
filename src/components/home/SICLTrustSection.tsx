'use client'
import { motion } from 'framer-motion'

const SICL_LOGO = 'https://res.cloudinary.com/degunlqed/image/upload/v1778748730/standrd_LOGO_new_pvjxu6.avif'

const stats = [
  {
    value: '45+',
    label: 'Years of Experience',
    sub: 'In operation since 1979',
  },
  {
    value: '$2M',
    label: 'Professional Indemnity',
    sub: 'Every policy is protected',
  },
  {
    value: '97%',
    label: 'Client Retention Rate',
    sub: 'Clients who return, year on year',
  },
]

export default function SICLTrustSection() {
  return (
    <section
      className="px-5 lg:px-20 py-14 lg:py-20"
      style={{ background: 'linear-gradient(135deg, #011a14 0%, #022c22 60%, #063d24 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">

          {/* Left — SICL identity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            {/* SICL logo — on a white pill for contrast */}
            <div className="mb-5 inline-flex">
              <div className="px-4 py-2.5 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={SICL_LOGO}
                  alt="Standard Insurance Consultants Limited"
                  className="h-10 w-auto object-contain"
                />
              </div>
            </div>

            <h2 className="font-display font-extrabold text-[22px] lg:text-[26px] leading-tight tracking-tight text-white mb-4 max-w-[480px]">
              Nigeria&apos;s most trusted insurance brokerage — behind every policy on this platform
            </h2>

            <p className="font-sans text-[15px] leading-relaxed max-w-[480px]" style={{ color: 'rgba(255,255,255,0.75)' }}>
              Standard Insurance Consultants Limited (SICL) is one of Africa&apos;s leading insurance brokerage firms, with a 45-year track record of protecting individuals, families, and businesses across Nigeria and beyond.
            </p>

            {/* Certifications row */}
            <div className="flex flex-wrap gap-3 mt-7">
              {[
                'NAICOM Licensed',
                'NCRIB Member',
                '$2M Professional Indemnity',
                'ISO Certified',
              ].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-sans font-semibold text-[11px]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5 L4 7 L8 3" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-0 lg:gap-0 divide-y lg:divide-y divide-x-0 sm:divide-x lg:divide-x-0"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            {stats.map(({ value, label, sub }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="py-7 sm:px-8 lg:px-0 lg:py-7 first:pt-0 lg:first:pt-0 last:pb-0 lg:last:pb-0"
              >
                <p className="font-display font-black leading-none mb-1.5"
                  style={{ fontSize: 'clamp(40px, 4vw, 52px)', color: 'var(--green-400)' }}>
                  {value}
                </p>
                <p className="font-sans font-bold text-[15px] text-white mb-0.5">{label}</p>
                <p className="font-sans text-[12px]" style={{ color: 'rgba(255,255,255,0.72)' }}>{sub}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
