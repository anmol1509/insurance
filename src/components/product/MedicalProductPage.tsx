'use client'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Tag from '@/components/ui/Tag'
import PlanCard from '@/components/ui/PlanCard'

const planTypes = ['Individual', 'Family', 'Group/Corporate']

const allPlans = {
  Individual: [
    { tier: 'Basic', price: '₦45,000', description: 'Inpatient care, emergency treatment, 200+ hospitals.', features: ['Inpatient care', 'Emergency treatment', '200+ partner hospitals', 'NAICOM compliant'], featured: false },
    { tier: 'Standard', price: '₦120,000', description: 'Full inpatient + maternity, specialist, 400+ hospitals.', features: ['All Basic benefits', 'Maternity care', 'Specialist consultations', '400+ hospitals', 'Annual check-up'], featured: true },
    { tier: 'Premium', price: '₦280,000', description: 'Complete cover including dental, vision, and international care.', features: ['All Standard benefits', 'Dental cover', 'Vision/eye care', 'International coverage', 'VIP hospitals'], featured: false },
  ],
  Family: [
    { tier: 'Family Basic', price: '₦180,000', description: 'Family inpatient cover for up to 4 members.', features: ['Inpatient care', 'Emergency treatment', 'Up to 4 members', '200+ hospitals'], featured: false },
    { tier: 'Family Standard', price: '₦420,000', description: 'Comprehensive family cover with maternity.', features: ['All Basic benefits', 'Maternity for spouse', 'Specialist referrals', '400+ hospitals'], featured: true },
    { tier: 'Family Premium', price: '₦850,000', description: 'Premium family cover with dental and vision.', features: ['All Standard benefits', 'Dental for all', 'Vision for all', 'International option'], featured: false },
  ],
  'Group/Corporate': [
    { tier: 'SME Plan', price: '₦45,000', period: '/life/yr', description: 'Per-life pricing for small teams.', features: ['Inpatient care', 'Emergency', '5-50 employees', 'Group rate'], featured: false },
    { tier: 'Corporate', price: '₦38,000', period: '/life/yr', description: 'Volume discounts for larger companies.', features: ['All SME benefits', 'Dental optional', '50+ employees', 'HR dashboard'], featured: true },
    { tier: 'Enterprise', price: 'Custom', description: 'Bespoke plan for large organisations.', features: ['Custom benefits', 'International option', 'Dedicated account manager', 'Any size'], featured: false },
  ],
}

export default function MedicalProductPage() {
  const [activeTab, setActiveTab] = useState('Individual')

  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[55fr_45fr] gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Tag variant="medical">Medical Insurance</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight" style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              Health cover for<br />every family.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-8" style={{ color: 'var(--text-muted)' }}>
              Cashless treatment at 500+ partner hospitals. Individual, family, and group plans.
            </p>
            <Link href="/quote/medical" className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-[var(--radius-xl)] font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg" style={{ backgroundColor: 'var(--medical-600)' }}>
              Get health quote <ArrowRight className="w-4 h-4" />
            </Link>
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

      {/* Plan toggle */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex justify-center mb-10">
            <div className="flex p-1.5 rounded-2xl border border-[var(--border-default)]" style={{ backgroundColor: 'var(--surface-raised)' }}>
              {planTypes.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className="px-5 py-2.5 rounded-xl font-sans font-medium text-sm transition-all duration-200"
                  style={activeTab === tab ? { backgroundColor: 'var(--medical-600)', color: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' } : { color: 'var(--text-muted)' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-3 gap-5"
            >
              {allPlans[activeTab as keyof typeof allPlans].map((plan) => (
                <PlanCard
                  key={plan.tier}
                  tier={plan.tier}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  featured={plan.featured}
                  productColor="var(--medical-600)"
                  productColorBg="var(--medical-50)"
                  onSelect={() => { window.location.href = '/quote/medical' }}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--medical-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Protect your family&apos;s health</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>Join 50,000+ Nigerians covered by ShopInsurance.</p>
          <Link href="/quote/medical" className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px]" style={{ color: 'var(--medical-600)' }}>
            Get your health quote now →
          </Link>
        </div>
      </section>
    </div>
  )
}
