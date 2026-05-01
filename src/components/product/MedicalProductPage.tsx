'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Tag from '@/components/ui/Tag'

const coverageItems = [
  { title: 'Inpatient care', desc: 'Full hospitalisation cover including surgery, ward, and specialist fees.' },
  { title: 'Outpatient & consultations', desc: 'GP visits, specialist referrals, and diagnostic tests covered.' },
  { title: 'Maternity cover', desc: 'Antenatal, delivery, and postnatal care for mother and newborn.' },
  { title: 'Dental & vision', desc: 'Optional dental treatment and optical cover for the whole family.' },
  { title: 'Emergency evacuation', desc: 'Air ambulance and emergency evacuation to the nearest facility.' },
  { title: '500+ partner hospitals', desc: 'Cashless treatment nationwide across our accredited hospital network.' },
]

const steps = [
  { title: 'Fill in your details',   icon: '⌨' },
  { title: 'Compare health plans',   icon: '📋' },
  { title: 'Pay & get covered',      icon: '❤️' },
]

export default function MedicalProductPage() {
  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[55fr_45fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Tag variant="medical">Medical Insurance</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight" style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              Health cover for<br />every family.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-5" style={{ color: 'var(--text-muted)' }}>
              Cashless treatment at 500+ partner hospitals. Compare plans from Nigeria's leading HMOs.
            </p>
            <div className="flex flex-col gap-1.5">
              <Link href="/quote/medical" className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-[var(--radius-xl)] font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg" style={{ backgroundColor: 'var(--medical-600)' }}>
                Get health quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Compare plans from multiple insurers — free</p>
            </div>
          </motion.div>
          <div className="hidden lg:flex justify-center">
            <div className="w-64 h-64 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--medical-50)' }}>
              <svg viewBox="0 0 160 160" width="140" fill="none">
                <rect x="60" y="20" width="40" height="120" rx="8" fill="var(--medical-100)" />
                <rect x="20" y="60" width="120" height="40" rx="8" fill="var(--medical-100)" />
                <rect x="68" y="28" width="24" height="104" rx="4" fill="var(--medical-600)" />
                <rect x="28" y="68" width="104" height="24" rx="4" fill="var(--medical-600)" />
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
                className="bg-white rounded-3xl border border-[var(--border-default)] p-6 hover:border-[var(--medical-600)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--medical-50)' }}>
                  <Check className="w-5 h-5" style={{ color: 'var(--medical-600)' }} strokeWidth={2.5} />
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
            <Link href="/quote/medical" className="inline-flex items-center h-[54px] px-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-base transition-all hover:-translate-y-px hover:shadow-lg">
              Compare health plans →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--medical-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Protect your family's health</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>Join 50,000+ Nigerians covered by ShopInsurance.</p>
          <Link href="/quote/medical" className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px]" style={{ color: 'var(--medical-600)' }}>
            Get your health quote now →
          </Link>
        </div>
      </section>
    </div>
  )
}
