'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, Clock, Check, ArrowRight } from 'lucide-react'
import Tag from '@/components/ui/Tag'
import PlanCard from '@/components/ui/PlanCard'

function CarSVG() {
  return (
    <svg viewBox="0 0 300 150" width="300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="60" width="260" height="65" rx="14" fill="#BFDBFE" />
      <rect x="50" y="24" width="170" height="50" rx="10" fill="#93C5FD" />
      <circle cx="70" cy="125" r="22" fill="#1D4ED8" />
      <circle cx="70" cy="125" r="10" fill="#EFF6FF" />
      <circle cx="230" cy="125" r="22" fill="#1D4ED8" />
      <circle cx="230" cy="125" r="10" fill="#EFF6FF" />
      <rect x="90" y="28" width="100" height="38" rx="6" fill="#DBEAFE" opacity="0.8" />
      <rect x="20" y="86" width="260" height="8" rx="4" fill="#93C5FD" opacity="0.5" />
      <rect x="24" y="66" width="18" height="10" rx="3" fill="#FCD34D" />
      <rect x="258" y="66" width="18" height="10" rx="3" fill="#FCD34D" />
    </svg>
  )
}

const coverageItems = [
  { title: 'Accidental damage', desc: 'Cover for your vehicle in case of collision or accident.' },
  { title: 'Theft & fire', desc: 'Full protection against vehicle theft and fire damage.' },
  { title: 'Third party liability', desc: 'Covers legal liability to third parties — persons and property.' },
  { title: 'Flood & natural perils', desc: 'Cover for flood, storms and other natural disasters.' },
  { title: 'Roadside assistance', desc: '24/7 towing, battery jump-start and flat tyre support.' },
  { title: 'NIID auto-registration', desc: 'Instant NIID registration — certificate in under 3 minutes.' },
]

const plans = [
  {
    tier: 'Third Party Only',
    price: '₦15,000',
    period: '/year',
    description: 'Basic mandatory cover for third-party injuries and property damage.',
    features: ['3rd party injury liability', 'Property damage liability', 'NIID certificate', 'NAICOM compliant'],
    featured: false,
  },
  {
    tier: 'Comprehensive',
    price: '₦65,000',
    period: '/year',
    description: 'Complete protection — your car and everyone else on the road.',
    features: ['All TPO benefits', 'Own vehicle damage', 'Theft & fire', 'Flood cover', 'Roadside assistance', 'NIID registration'],
    featured: true,
  },
  {
    tier: 'Third Party F&T',
    price: '₦35,000',
    period: '/year',
    description: 'Third party plus fire and theft protection.',
    features: ['3rd party injury liability', 'Fire damage cover', 'Vehicle theft', 'NIID certificate'],
    featured: false,
  },
]

const steps = [
  { title: 'Enter vehicle details', icon: '⌨' },
  { title: 'Choose your cover', icon: '📋' },
  { title: 'Pay & get certificate', icon: '🛡' },
]

export default function MotorProductPage() {
  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>
      {/* Hero */}
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[55fr_45fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Tag variant="motor">Motor Insurance</Tag>
            <h1
              className="font-display font-extrabold mt-4 mb-4 tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}
            >
              Drive with full
              <br />
              confidence.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-5" style={{ color: 'var(--text-muted)' }}>
              Comprehensive, TPO, or TPF&T cover — get your NIID-registered certificate in under 3 minutes.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { icon: Shield, label: 'NIID Registered' },
                { icon: Clock, label: 'Certificate in 3 mins' },
                { icon: Check, label: 'Claims in 24 hours' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: 'var(--motor-600)' }} />
                  <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--motor-600)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <Link
                href="/quote/motor"
                className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-[var(--radius-xl)] font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg"
                style={{ backgroundColor: 'var(--motor-600)' }}
              >
                Get motor quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>
                Starting from ₦15,000/year
              </p>
            </div>
          </motion.div>

          <motion.div
            className="hidden lg:flex justify-center relative"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <CarSVG />
            {/* Floating price card */}
            <div className="absolute -bottom-4 left-4 bg-white rounded-2xl shadow-lift px-5 py-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--motor-50)' }}>
                <span className="text-base">🚗</span>
              </div>
              <div>
                <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>Comprehensive from</p>
                <p className="font-display font-bold text-base" style={{ color: 'var(--motor-600)' }}>₦65,000/yr</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick quote strip */}
      <section className="bg-white border-y border-[var(--border-default)] py-6 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
            Get an instant quote
          </p>
          <div className="flex flex-wrap gap-3 items-end">
            {["Owner's Name", 'Reg. Number', 'Vehicle Value ₦', 'Cover Type'].map((f) => (
              <div key={f} className="flex flex-col gap-1 flex-1 min-w-[140px]">
                <label className="font-sans font-semibold text-[11px] uppercase tracking-[0.05em]" style={{ color: 'var(--text-muted)' }}>
                  {f}
                </label>
                <input
                  type="text"
                  placeholder={f}
                  className="h-11 rounded-xl border-[1.5px] border-[var(--border-medium)] px-4 font-sans text-sm outline-none"
                  style={{ borderColor: 'var(--border-medium)' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--motor-600)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-medium)'}
                />
              </div>
            ))}
            <Link
              href="/quote/motor"
              className="h-11 px-6 rounded-xl font-sans font-semibold text-sm text-white flex items-center shrink-0 transition-all hover:-translate-y-px"
              style={{ backgroundColor: 'var(--motor-600)' }}
            >
              Calculate →
            </Link>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--green-700)' }}>
            What's Covered
          </p>
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
            Full protection, every road
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverageItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl border border-[var(--border-default)] p-6 hover:border-[var(--motor-600)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--motor-50)' }}>
                  <Check className="w-[22px] h-[22px]" style={{ color: 'var(--motor-600)' }} strokeWidth={2.5} />
                </div>
                <h3 className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-10 text-center" style={{ color: 'var(--text-primary)' }}>
            Choose your plan
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <PlanCard
                key={plan.tier}
                tier={plan.tier}
                price={plan.price}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                featured={plan.featured}
                productColor="var(--motor-600)"
                productColorBg="var(--motor-50)"
                onSelect={() => { window.location.href = '/quote/motor' }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-10 text-center" style={{ color: 'var(--text-primary)' }}>
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((step, i) => (
              <div key={step.title} className="bg-white rounded-3xl border border-[var(--border-default)] p-7">
                <div className="text-4xl mb-4 h-16 flex items-center">{step.icon}</div>
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mb-4">
                  <span className="font-display font-bold text-sm text-white">{i + 1}</span>
                </div>
                <h3 className="font-display font-bold text-[19px] mb-2" style={{ color: 'var(--text-primary)' }}>
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/quote/motor"
              className="inline-flex items-center h-[54px] px-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-base transition-all hover:-translate-y-px hover:shadow-lg"
            >
              Get insured now →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--motor-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">
            Protect your vehicle today
          </h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Join 50,000+ Nigerians who trust ShopInsurance for their motor cover.
          </p>
          <Link
            href="/quote/motor"
            className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px] transition-all hover:bg-white/90"
            style={{ color: 'var(--motor-600)' }}
          >
            Get your quote now →
          </Link>
        </div>
      </section>
    </div>
  )
}
