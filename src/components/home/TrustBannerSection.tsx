'use client'
import { motion } from 'framer-motion'
import WavyUnderline from '@/components/ui/WavyUnderline'

const stats = [
  { value: '50,000+', label: 'Policies issued' },
  { value: '₦2.4B', label: 'Claims paid out' },
  { value: '4', label: 'Insurance products' },
]

export default function TrustBannerSection() {
  return (
    <section
      className="py-20 px-5 lg:px-20 overflow-hidden relative"
      style={{ backgroundColor: 'var(--green-700)' }}
    >
      <div className="max-w-[1280px] mx-auto grid md:grid-cols-[40fr_60fr] gap-20 items-center">
        {/* Left: image placeholder */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden bg-[var(--green-800)] h-[400px] flex items-center justify-center">
            {/* Abstract placeholder with pattern */}
            <svg
              viewBox="0 0 380 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <rect width="380" height="400" fill="var(--green-800)" />
              <circle cx="190" cy="200" r="160" fill="var(--green-700)" opacity="0.5" />
              <circle cx="190" cy="200" r="100" fill="var(--green-600)" opacity="0.4" />
              {/* Stylized person silhouette */}
              <circle cx="190" cy="140" r="45" fill="var(--green-500)" opacity="0.6" />
              <path
                d="M110 280 Q110 230 190 230 Q270 230 270 280 L270 340 Q270 360 190 360 Q110 360 110 340 Z"
                fill="var(--green-500)"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Orange decorative SVG */}
          <svg
            className="absolute -top-6 -right-6"
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
          >
            <motion.path
              d="M10 60 C30 10, 90 10, 110 60 S90 110, 10 60"
              stroke="var(--orange-500)"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
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
            <span className="relative inline-block">
              <em className="not-italic font-serif italic">trusted</em>
              <span className="absolute -bottom-2 left-0 w-full">
                <WavyUnderline color="rgba(255,255,255,0.7)" width={120} />
              </span>
            </span>{' '}
            name in
            <br />
            Nigerian insurance.
          </h2>

          <p
            className="font-sans text-base leading-relaxed max-w-[460px] mb-10"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            ShopInsurance provides instant quotes backed by NAICOM-licensed underwriters, helping
            you get covered fast so you can get on with life.
          </p>

          {/* Stats */}
          <div className="flex gap-12 flex-wrap">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display font-bold text-[42px] text-white leading-none">{value}</p>
                <p className="font-sans text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
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
