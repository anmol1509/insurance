'use client'
import { motion } from 'framer-motion'

const stats = [
  { value: '50,000+', label: 'Policies issued' },
  { value: '₦2.4B', label: 'Claims paid out' },
  { value: '4', label: 'Insurance products' },
]

export default function TrustBannerSection() {
  return (
    <section
      className="py-20 px-5 lg:px-20 overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #022c22 0%, #064e3b 55%, #065f46 100%)' }}
    >
      <div className="max-w-[1280px] mx-auto grid md:grid-cols-[40fr_60fr] gap-20 items-center">
        {/* Left: logo card */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div
            className="rounded-3xl overflow-hidden h-[400px] flex items-center justify-center relative"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/degunlqed/image/upload/v1778554881/silogo_bujrpu.png"
              alt="ShopInsurance"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="font-display font-extrabold text-5xl tracking-tight leading-[1.15] mb-4"
            style={{ color: 'white' }}
          >
            A{' '}
            <em className="not-italic font-serif italic" style={{ borderBottom: '2px solid rgba(255,255,255,0.4)', paddingBottom: '2px' }}>trusted</em>{' '}
            name in
            <br />
            Nigerian insurance.
          </h2>

          <p
            className="font-sans text-base leading-relaxed max-w-[460px] mb-10"
            style={{ color: 'rgba(255,255,255,0.75)' }}
          >
            ShopInsurance provides instant quotes backed by NAICOM-licensed underwriters, helping
            you get covered fast so you can get on with life.
          </p>

          {/* Stats */}
          <div className="flex gap-12 flex-wrap">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display font-bold text-[42px] text-white leading-none">{value}</p>
                <p className="font-sans text-sm mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
