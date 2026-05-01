'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Tag from '@/components/ui/Tag'

const coverageItems = [
  { title: 'Medical emergencies', desc: 'Hospital treatment, surgery, and emergency evacuation abroad.' },
  { title: 'Trip cancellation', desc: 'Refund if your trip is cancelled for covered reasons before departure.' },
  { title: 'Baggage & belongings', desc: 'Lost, stolen, or damaged luggage and personal effects.' },
  { title: 'Flight delay', desc: 'Compensation for delays over 4 hours, including meals and accommodation.' },
  { title: 'Schengen compliant', desc: '€30,000+ medical cover meeting EU Schengen visa requirements.' },
  { title: 'Adventure sports', desc: 'Optional cover for skiing, diving, bungee, and extreme activities.' },
]

const steps = [
  { title: 'Enter traveller details', icon: '⌨' },
  { title: 'Compare travel plans', icon: '📋' },
  { title: 'Pay & get certificate', icon: '✈️' },
]

export default function TravelProductPage() {
  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[55fr_45fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Tag variant="travel">Travel Insurance</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight" style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              Travel the world,<br />worry-free.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-5" style={{ color: 'var(--text-muted)' }}>
              Schengen-compliant plans, medical emergencies, baggage protection. Compare plans from Nigeria's top insurers.
            </p>
            <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-6 border" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}>
              <Check className="w-5 h-5 shrink-0" style={{ color: 'var(--green-700)' }} />
              <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--green-700)' }}>
                Schengen EU-compliant · Meets €30,000 minimum medical coverage
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Link href="/quote/travel" className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-[var(--radius-xl)] font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg" style={{ backgroundColor: 'var(--travel-600)' }}>
                Get travel quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Compare plans from multiple insurers — free</p>
            </div>
          </motion.div>
          <div className="hidden lg:flex justify-center">
            <div className="w-64 h-64 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--travel-50)' }}>
              <svg viewBox="0 0 160 160" width="140" fill="none">
                <circle cx="80" cy="80" r="65" stroke="var(--travel-100)" strokeWidth="4" />
                <path d="M20 80 Q80 20 140 80 Q80 140 20 80" fill="var(--travel-100)" />
                <path d="M40 60 L120 60" stroke="var(--travel-600)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M60 40 L130 80 L80 100 Z" fill="var(--travel-600)" />
                <circle cx="60" cy="40" r="5" fill="var(--travel-700)" />
                <circle cx="130" cy="80" r="5" fill="var(--travel-700)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>What's covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverageItems.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl border border-[var(--border-default)] p-6 hover:border-[var(--travel-600)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--travel-50)' }}>
                  <Check className="w-5 h-5" style={{ color: 'var(--travel-600)' }} strokeWidth={2.5} />
                </div>
                <h3 className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-10 text-center" style={{ color: 'var(--text-primary)' }}>How it works</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <div key={step.title} className="bg-white rounded-3xl border border-[var(--border-default)] p-7">
                <div className="text-4xl mb-4 h-16 flex items-center">{step.icon}</div>
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mb-4">
                  <span className="font-display font-bold text-sm text-white">{i + 1}</span>
                </div>
                <h3 className="font-display font-bold text-[19px] mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/quote/travel" className="inline-flex items-center h-[54px] px-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-base transition-all hover:-translate-y-px hover:shadow-lg">
              Compare travel plans →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--travel-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Ready to travel with confidence?</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>Get your Schengen-compliant certificate in minutes.</p>
          <Link href="/quote/travel" className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px]" style={{ color: 'var(--travel-600)' }}>
            Get travel quote now →
          </Link>
        </div>
      </section>
    </div>
  )
}
