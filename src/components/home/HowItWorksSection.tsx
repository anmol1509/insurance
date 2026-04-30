'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import PhoneFrame from '@/components/ui/PhoneFrame'
import StepCircle from '@/components/ui/StepCircle'

const steps = [
  {
    number: 1,
    label: 'Step 1',
    title: 'Choose your insurance type',
    desc: 'Select from Motor, Medical, Travel, or Business cover.',
  },
  {
    number: 2,
    label: 'Step 2',
    title: 'Tell us about yourself',
    desc: 'Fill in your details — takes under 2 minutes.',
  },
  {
    number: 3,
    label: 'Step 3',
    title: 'Get your instant quote',
    desc: 'We calculate your premium in real-time, no waiting.',
  },
  {
    number: 4,
    label: 'Step 4',
    title: 'Pay and get insured',
    desc: 'Certificate issued the moment payment clears. NIID registered.',
  },
]

function QuoteMockUI() {
  return (
    <div className="flex flex-col h-full p-3 bg-white text-[var(--text-primary)]">
      {/* Mini navbar */}
      <div className="flex items-center gap-1.5 pb-3 border-b border-gray-100 mb-3">
        <div className="w-4 h-4 rounded bg-[var(--green-700)] flex items-center justify-center">
          <span className="text-white text-[7px] font-bold">S</span>
        </div>
        <span className="font-sans font-semibold text-[10px] text-gray-700">ShopInsurance</span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`w-2 h-2 rounded-full transition-all ${dot === 2 ? 'w-6' : ''}`}
            style={{
              backgroundColor: dot === 2 ? 'var(--green-700)' : 'var(--border-default)',
            }}
          />
        ))}
      </div>

      {/* Question card */}
      <div
        className="rounded-2xl p-4 mx-1"
        style={{ backgroundColor: 'var(--surface-raised)' }}
      >
        <p
          className="font-sans font-semibold text-[9px] uppercase tracking-wider mb-2"
          style={{ color: 'var(--green-700)' }}
        >
          About you
        </p>
        <p className="font-sans font-semibold text-[12px] text-gray-800 mb-3 leading-snug">
          Do you currently have vehicle insurance?
        </p>
        {/* Options */}
        <div
          className="rounded-xl px-3 py-2.5 mb-2 flex items-center gap-2"
          style={{ backgroundColor: 'var(--green-700)' }}
        >
          <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--green-700)' }} />
          </div>
          <span className="font-sans font-medium text-[11px] text-white">Yes</span>
        </div>
        <div className="rounded-xl px-3 py-2.5 flex items-center gap-2 border border-gray-200 bg-white">
          <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />
          <span className="font-sans text-[11px] text-gray-600">No</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Next button */}
      <button
        type="button"
        className="w-full py-2.5 rounded-xl font-sans font-semibold text-[12px] text-white mt-3"
        style={{ backgroundColor: 'var(--green-700)' }}
      >
        Next step →
      </button>
    </div>
  )
}

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section style={{ backgroundColor: 'var(--page-bg)' }} className="py-20 px-5 lg:px-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-3"
            style={{ color: 'var(--green-700)' }}
          >
            How ShopInsurance Works
          </p>
          <h2
            className="font-display font-extrabold text-4xl lg:text-[40px] tracking-tight mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            Get a personalised quote in about 3 minutes
          </h2>
          <p
            className="font-sans text-[17px] max-w-[520px] mx-auto leading-relaxed"
            style={{ color: 'var(--text-muted)' }}
          >
            We find you the best cover at the best price. No jargon. No pressure.
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Steps */}
          <div ref={sectionRef} className="relative">
            {/* Track line */}
            <div
              className="absolute left-4 top-4 bottom-4 w-0.5"
              style={{ backgroundColor: 'var(--border-default)' }}
            >
              <motion.div
                className="absolute top-0 left-0 w-full"
                style={{ backgroundColor: 'var(--green-700)' }}
                initial={{ height: '0%' }}
                animate={isInView ? { height: '100%' } : { height: '0%' }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
              />
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.15 }}
                  className="flex gap-5"
                >
                  <StepCircle
                    state={i === 0 ? 'completed' : i === 1 ? 'active' : 'upcoming'}
                    number={step.number}
                  />
                  <div className="pt-0.5">
                    <p
                      className="font-sans font-semibold text-[12px] uppercase tracking-[0.06em] mb-1"
                      style={{ color: 'var(--green-700)' }}
                    >
                      {step.label}
                    </p>
                    <h3
                      className="font-display font-bold text-[22px] mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="font-sans text-sm leading-relaxed max-w-[340px]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div className="flex justify-center">
            <PhoneFrame>
              <QuoteMockUI />
            </PhoneFrame>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <a
            href="/quote/motor"
            className="inline-flex items-center h-[54px] px-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-base transition-all duration-200 hover:-translate-y-px hover:shadow-lg"
          >
            Get Your Free Quote →
          </a>
        </div>
      </div>
    </section>
  )
}
