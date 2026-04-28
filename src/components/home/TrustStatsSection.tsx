'use client'
import { motion } from 'framer-motion'
import PhoneFrame from '@/components/ui/PhoneFrame'
import CountUpNumber from '@/components/ui/CountUpNumber'

const stats = [
  { value: '< 3 mins', label: 'Fastest quote to certificate', isText: true },
  { value: 98.6, label: 'Claims settled in 1 week', suffix: '%', isText: false },
  { value: '24×7', label: 'Instant claims support', isText: true },
]

function ClaimsPhoneContent() {
  return (
    <div className="flex flex-col h-full p-4 bg-white">
      {/* Mini header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="w-5 h-5 rounded bg-[var(--green-700)] flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">S</span>
        </div>
        <span className="font-sans font-semibold text-[11px] text-gray-700">ShopInsurance</span>
      </div>

      {/* Policy card */}
      <div className="rounded-xl overflow-hidden mb-3 shadow-sm">
        <div className="bg-[var(--green-700)] px-4 py-3">
          <p className="text-white font-sans font-semibold text-[11px]">Motor Insurance</p>
          <p className="text-white/70 font-sans text-[10px] mt-0.5">SI-2025-0042983</p>
        </div>
        <div className="bg-white px-4 py-2 border border-t-0 border-gray-100 rounded-b-xl">
          <p className="font-sans text-[10px] text-gray-500">Toyota Camry · Lagos</p>
          <p className="font-sans font-semibold text-[11px] text-gray-800 mt-0.5">
            Active · Expires Dec 2025
          </p>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* File claim button */}
      <button
        type="button"
        className="w-full py-3 rounded-xl font-sans font-semibold text-[13px] text-white"
        style={{ backgroundColor: 'var(--green-700)' }}
      >
        File a claim
      </button>
    </div>
  )
}

const testimonials = [
  {
    quote:
      "I recently switched to ShopInsurance and I'm thoroughly impressed! The claims process was seamless and instant.",
    name: 'Adaeze Okonkwo',
    product: 'Motor Insurance',
  },
  {
    quote:
      'The fastest insurance certificate I have ever gotten. Paid and received my document in under 3 minutes!',
    name: 'Emeka Chukwu',
    product: 'Medical Insurance',
  },
  {
    quote:
      'ShopInsurance has the most transparent pricing. No hidden fees, just honest insurance.',
    name: 'Bola Adeleke',
    product: 'Travel Insurance',
  },
]

export default function TrustStatsSection() {
  return (
    <section style={{ backgroundColor: 'var(--surface)' }} className="py-20 px-5 lg:px-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="font-display font-extrabold text-center text-4xl lg:text-[42px] tracking-tight mb-12"
          style={{ color: 'var(--text-primary)' }}
        >
          Your trust isn&apos;t assumed, it&apos;s earned.
        </motion.h2>

        {/* Stats */}
        <div className="flex flex-col md:flex-row justify-center mb-16 border border-[var(--border-default)] rounded-3xl overflow-hidden bg-white divide-y md:divide-y-0 md:divide-x divide-[var(--border-default)]">
          {stats.map(({ value, label, suffix, isText }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex-1 py-10 px-16 text-center"
            >
              <p
                className="font-display font-bold leading-none"
                style={{ fontSize: '68px', color: 'var(--stat-purple)' }}
              >
                {isText ? (
                  value
                ) : (
                  <CountUpNumber
                    target={Number(value)}
                    suffix={suffix}
                    format={(n) => n.toFixed(1)}
                  />
                )}
              </p>
              <p className="font-sans text-base mt-2" style={{ color: 'var(--text-muted)' }}>
                {label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Two cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Claims card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-4xl border border-[var(--border-default)] p-9 overflow-hidden"
          >
            <h3
              className="font-display font-bold text-2xl mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Claims shouldn&apos;t be hard.
            </h3>
            <div className="flex justify-center mb-6">
              <PhoneFrame>
                <ClaimsPhoneContent />
              </PhoneFrame>
            </div>
            <button
              type="button"
              className="w-full h-11 rounded-[var(--radius-xl)] font-sans font-medium text-sm border-[1.5px] border-[var(--border-medium)] hover:bg-[var(--surface-raised)] transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              File a claim →
            </button>
          </motion.div>

          {/* Testimonial card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-4xl border border-[var(--border-default)] p-9"
          >
            <h3
              className="font-display font-bold text-2xl mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Promises made. Promises kept.
            </h3>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-[22px]" style={{ color: '#FBBF24' }}>
                  ★
                </span>
              ))}
            </div>
            <p
              className="font-sans text-[15px] italic text-center max-w-[340px] mx-auto leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              &ldquo;{testimonials[0].quote}&rdquo;
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center font-sans font-semibold text-base"
                style={{ backgroundColor: 'var(--surface-sunken)', color: 'var(--text-primary)' }}
              >
                AO
              </div>
              <div>
                <p className="font-display font-semibold text-[15px]" style={{ color: 'var(--text-primary)' }}>
                  {testimonials[0].name}
                </p>
                <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>
                  ShopInsurance customer
                </p>
              </div>
            </div>

            <div className="flex justify-center gap-2.5 mt-5">
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-[var(--border-default)] flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors"
              >
                ←
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full border border-[var(--border-default)] flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors"
              >
                →
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="font-sans font-medium text-sm px-5 py-2.5 rounded-full text-white"
                style={{ backgroundColor: 'var(--text-primary)' }}
              >
                View more reviews
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
