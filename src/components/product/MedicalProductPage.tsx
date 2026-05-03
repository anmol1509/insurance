'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Heart, Stethoscope, Baby, Eye, Ambulance, Building2, PhoneCall } from 'lucide-react'
import Tag from '@/components/ui/Tag'

const coverageItems = [
  { icon: Building2,    color: '#059669', bg: '#ECFDF5', title: 'Inpatient care',            desc: 'Full hospitalisation cover including surgery, ward, specialist, and ICU fees.' },
  { icon: Stethoscope,  color: '#0284C7', bg: '#F0F9FF', title: 'Outpatient & consultations', desc: 'GP visits, specialist referrals, diagnostics, and pharmacy — cashless.' },
  { icon: Baby,         color: '#7C3AED', bg: '#F5F3FF', title: 'Maternity cover',            desc: 'Antenatal, delivery, postnatal care, and newborn cover up to 30 days.' },
  { icon: Eye,          color: '#D97706', bg: '#FFFBEB', title: 'Dental & vision',            desc: 'Optional dental treatment, scaling, optical tests, and prescription glasses.' },
  { icon: Ambulance,    color: '#DC2626', bg: '#FEF2F2', title: 'Emergency evacuation',       desc: 'Air ambulance and emergency evacuation to the nearest accredited facility.' },
  { icon: Heart,        color: '#EC4899', bg: '#FDF2F8', title: '700+ partner hospitals',     desc: 'Cashless treatment nationwide — accredited by HMO authorities.' },
]

const hmoVsIndemnity = [
  { feature: 'How you pay',            hmo: 'Cashless — no upfront payment at hospital',  indemnity: 'Pay upfront, then claim reimbursement' },
  { feature: 'Network restriction',   hmo: 'Must use accredited network hospitals',       indemnity: 'Any hospital of your choice' },
  { feature: 'Premium cost',          hmo: 'Generally lower',                             indemnity: 'Generally higher' },
  { feature: 'Claims process',        hmo: 'No claims — pre-authorised treatment',        indemnity: 'Submit bills for reimbursement (7–30 days)' },
  { feature: 'Best for',              hmo: 'Routine care, chronic conditions, families',  indemnity: 'International travel, specialists outside network' },
]

const waitingPeriods = [
  { benefit: 'Outpatient consultation', period: 'Day 1',   note: 'Immediate access on plan activation' },
  { benefit: 'Inpatient surgery',       period: '30 days', note: 'Except emergencies — no waiting' },
  { benefit: 'Maternity',              period: '10 months', note: 'Pre-existing pregnancy not covered' },
  { benefit: 'Dental',                 period: '60 days', note: 'Orthodontic work: 12 months' },
  { benefit: 'Pre-existing conditions', period: '12 months', note: 'Some plans waive after health assessment' },
]

const steps = [
  { n: '01', icon: '👤', title: 'Tell us about you', desc: 'Number of lives, age brackets, and any pre-existing conditions.' },
  { n: '02', icon: '📊', title: 'Compare HMO plans', desc: 'Side-by-side premiums, network sizes, and benefit limits from top providers.' },
  { n: '03', icon: '💳', title: 'Pay online',         desc: 'Paystack or bank transfer. Instant confirmation.' },
  { n: '04', icon: '❤️', title: 'Get your HMO card',  desc: 'E-card issued immediately. Physical card within 5 business days.' },
]

const whyUs = [
  { icon: '🏥', title: '700+ hospitals',           desc: 'Largest accredited network in Nigeria — urban and rural.' },
  { icon: '📱', title: 'App-based claims',          desc: 'Pre-auth, claims, and card all in one app — zero paperwork.' },
  { icon: '👨‍👩‍👧‍👦', title: 'Family & group plans',    desc: 'Cover your whole household or employee group in one policy.' },
  { icon: '🔒', title: 'NDPR & NHIA compliant',    desc: 'Your health data is protected under Nigerian data privacy law.' },
]

export default function MedicalProductPage() {
  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>

      {/* ── Hero ── */}
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Tag variant="medical">Medical Insurance</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              Health cover for<br />every family.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-5" style={{ color: 'var(--text-muted)' }}>
              Cashless treatment at 700+ partner hospitals. Compare plans from Nigeria's leading HMOs and health insurers.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {[{ icon: Heart, label: 'NHIA Accredited' }, { icon: Building2, label: '700+ hospitals' }, { icon: Check, label: 'Cashless treatment' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: 'var(--medical-600)' }} />
                  <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--medical-600)' }}>{label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <Link href="/quote/medical"
                className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-2xl font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg"
                style={{ backgroundColor: 'var(--medical-600)' }}>
                Get health quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Starting from ₦45,000/yr · Individual & family plans</p>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div className="hidden lg:block relative"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', minHeight: 320 }}>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-64 h-64 rounded-full border-[2px]" style={{ borderColor: 'var(--medical-600)' }} />
              </div>
              {/* Cross + pulse */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full py-12 gap-6">
                <div className="w-28 h-28 rounded-3xl flex items-center justify-center" style={{ backgroundColor: 'var(--medical-600)' }}>
                  <svg viewBox="0 0 64 64" width="56" fill="none">
                    <rect x="22" y="8" width="20" height="48" rx="6" fill="white" />
                    <rect x="8" y="22" width="48" height="20" rx="6" fill="white" />
                  </svg>
                </div>
                <div className="flex gap-4">
                  {[{ label: 'Individual', price: '₦45K/yr', color: 'var(--medical-600)' }, { label: 'Family (4)', price: '₦180K/yr', color: '#7C3AED' }].map((p) => (
                    <div key={p.label} className="bg-white rounded-2xl shadow-md px-4 py-3 text-center">
                      <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{p.label}</p>
                      <p className="font-display font-bold text-[15px]" style={{ color: p.color }}>{p.price}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl shadow-md px-4 py-2.5 flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {['#059669', '#0284C7', '#7C3AED', '#D97706'].map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                  <p className="font-sans font-medium text-[12px]" style={{ color: 'var(--text-primary)' }}>6 HMOs compared</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What's Covered ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--medical-600)' }}>Coverage</p>
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>What's covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverageItems.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl border border-[var(--border-default)] p-6 hover:border-[var(--medical-600)] hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: item.bg }}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} strokeWidth={2} />
                </div>
                <h3 className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is medical insurance ── */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--medical-600)' }}>Basics</p>
            <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              What is health insurance in Nigeria?
            </h2>
            <p className="font-sans text-[15px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              Health insurance (or HMO cover) pays for your medical bills when you fall sick or need surgery. Instead of paying out-of-pocket — which can run into millions for serious conditions — your insurer covers the cost.
            </p>
            <p className="font-sans text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              Under Nigeria's <strong style={{ color: 'var(--text-primary)' }}>National Health Insurance Authority (NHIA) Act 2022</strong>, formal-sector employers are required to provide health cover for all employees. Self-employed individuals and families can buy private plans directly.
            </p>
            {['Avoid catastrophic out-of-pocket expenses from hospitalisation', 'Access specialist care without long referral delays', 'Maternity support from antenatal through to delivery', 'Mental health and chronic disease management included in top plans'].map((pt) => (
              <div key={pt} className="flex items-start gap-3 mb-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--medical-50)' }}>
                  <Check className="w-3 h-3" style={{ color: 'var(--medical-600)' }} strokeWidth={3} />
                </div>
                <p className="font-sans text-[14px]" style={{ color: 'var(--text-secondary)' }}>{pt}</p>
              </div>
            ))}
          </div>

          {/* HMO vs Indemnity table */}
          <div>
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--medical-600)' }}>HMO vs Indemnity</p>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
              <div className="grid grid-cols-3 px-4 py-3" style={{ backgroundColor: 'var(--medical-600)' }}>
                <p className="font-sans font-bold text-[11px] text-white/70 uppercase tracking-[0.06em]">Feature</p>
                <p className="font-sans font-bold text-[11px] text-white uppercase tracking-[0.06em]">HMO Plan</p>
                <p className="font-sans font-bold text-[11px] text-white/70 uppercase tracking-[0.06em]">Indemnity</p>
              </div>
              {hmoVsIndemnity.map((row, i) => (
                <div key={row.feature} className="grid grid-cols-3 px-4 py-3 border-t gap-2" style={{ borderColor: 'var(--border-subtle)', backgroundColor: i % 2 === 0 ? 'white' : 'var(--surface-raised)' }}>
                  <p className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-secondary)' }}>{row.feature}</p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--medical-600)' }}>{row.hmo}</p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{row.indemnity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Waiting periods ── */}
      <section className="py-14 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[900px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--medical-600)' }}>Know before you buy</p>
          <h2 className="font-display font-extrabold text-[28px] tracking-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Typical waiting periods
          </h2>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'white', borderColor: 'var(--border-default)' }}>
            <div className="grid grid-cols-3 px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
              {['Benefit', 'Waiting Period', 'Note'].map((h) => (
                <p key={h} className="font-sans font-bold text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>{h}</p>
              ))}
            </div>
            {waitingPeriods.map((row, i) => (
              <div key={row.benefit} className="grid grid-cols-3 px-5 py-3.5 border-b last:border-0 gap-3 items-center" style={{ borderColor: 'var(--border-subtle)' }}>
                <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{row.benefit}</p>
                <span className="font-sans font-bold text-[12px] px-2.5 py-1 rounded-full w-fit" style={{ backgroundColor: row.period === 'Day 1' ? '#DCFCE7' : '#FEF9C3', color: row.period === 'Day 1' ? '#16A34A' : '#854D0E' }}>
                  {row.period}
                </span>
                <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{row.note}</p>
              </div>
            ))}
          </div>
          <p className="font-sans text-[12px] mt-3" style={{ color: 'var(--text-subtle)' }}>
            * Waiting periods vary by insurer. Exact terms shown during checkout.
          </p>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2 text-center" style={{ color: 'var(--medical-600)' }}>Process</p>
          <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-10 text-center" style={{ color: 'var(--text-primary)' }}>
            Covered in 4 steps
          </h2>
          <div className="relative grid md:grid-cols-4 gap-6">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px" style={{ backgroundColor: 'var(--border-default)' }} />
            {steps.map((step, i) => (
              <motion.div key={step.n}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 relative z-10"
                  style={{ backgroundColor: i === 3 ? 'var(--medical-600)' : 'var(--medical-50)', border: '2px solid', borderColor: i === 3 ? 'var(--medical-600)' : '#A7F3D0' }}>
                  {step.icon}
                </div>
                <span className="font-sans font-bold text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--medical-600)' }}>Step {step.n}</span>
                <h3 className="font-display font-bold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/quote/medical"
              className="inline-flex items-center h-[54px] px-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-base transition-all hover:-translate-y-px hover:shadow-lg">
              Compare health plans →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why ShopInsurance ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--medical-600)' }}>Why us</p>
          <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
            Why ShopInsurance for health cover?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyUs.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl border border-[var(--border-default)] p-6">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--medical-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Protect your family's health</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Join 50,000+ Nigerians covered by ShopInsurance health plans.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/quote/medical"
              className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px] transition-all hover:bg-white/90"
              style={{ color: 'var(--medical-600)' }}>
              Get your health quote →
            </Link>
            <a href="https://wa.me/2348001234567"
              className="inline-flex items-center gap-2 h-12 px-7 border-2 border-white/40 rounded-xl font-sans font-semibold text-[15px] text-white/90 hover:border-white">
              <PhoneCall className="w-4 h-4" /> Speak to an advisor
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
