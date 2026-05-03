'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Flame, Lock, Users, Briefcase, HeartHandshake, FileCheck, PhoneCall } from 'lucide-react'
import { useState } from 'react'
import FAQAccordion from '@/components/product/FAQAccordion'

const BUSINESS_FAQS = [
  { q: 'Is business insurance compulsory in Nigeria?', a: 'Certain types of business insurance are mandatory under Nigerian law. The Insurance Act 2003 requires buildings in public use to have fire insurance, and employers must carry group life and workmen\'s compensation (NSITF) cover. Professional indemnity is required for legal and medical practitioners. Other covers like property, burglary, and liability are strongly recommended but not legally mandated.' },
  { q: 'Can I deduct business insurance premiums from my company tax?', a: 'Yes. Under Section 24 of the Companies Income Tax Act (CITA), insurance premiums paid wholly and exclusively for business purposes are deductible from assessable profits. This means a ₦500,000 premium effectively costs your company significantly less after the tax deduction. We recommend consulting your tax adviser for your specific entity type.' },
  { q: 'What is the difference between fire insurance and fire & special perils?', a: 'Basic fire insurance covers losses from fire alone. Fire & Special Perils (F&SP) is a broader cover that includes lightning, explosion, aircraft impact, riot and civil commotion, storm, flood, burst pipes, and impact by vehicles. For most businesses, F&SP is significantly better value and costs only marginally more than basic fire cover.' },
  { q: 'How is the insured value (sum insured) determined for my property?', a: 'Buildings should be insured at full reinstatement value — the cost to rebuild from scratch, not the market value. Contents, stock, and equipment should be insured at replacement cost. Under-insuring (under-declaration) means claims will be paid on a proportional (pro-rata) basis — if you insure at 50% of true value, you will only receive 50% of any valid claim.' },
  { q: 'Does my business policy cover employees working remotely or off-site?', a: 'Standard property cover applies to items at your declared business premises. Many policies extend to cover stock in transit or at a named third-party location. Remote workers are typically covered under Group Personal Accident and Employers\' Liability policies, which follow the employee regardless of location. Check your policy schedule for territorial limits.' },
  { q: 'How long does it take to issue a business insurance certificate?', a: 'Simple covers (fire, burglary, householder) are issued within 4 business hours. More complex covers (group personal accident, professional indemnity, engineering) may require up to 24 hours for underwriting review. The certificate is emailed, available in your dashboard, and can be presented to clients, banks, or regulators.' },
]
import Tag from '@/components/ui/Tag'
import CheckboxCard from '@/components/ui/CheckboxCard'
import { formatNaira } from '@/lib/formatters'

const coverageItems = [
  { icon: Flame,         color: '#DC2626', bg: '#FEF2F2', title: 'Fire & Special Perils',     desc: 'Cover for fire, lightning, explosion, flood, and allied perils to your property.' },
  { icon: Lock,          color: '#7C3AED', bg: '#F5F3FF', title: 'Burglary & Theft',          desc: 'Forcible entry/exit, theft of stock, cash in safe, and employee dishonesty.' },
  { icon: Users,         color: '#0284C7', bg: '#F0F9FF', title: 'Third Party Liability',     desc: 'Legal liability for injury or property damage to clients and visitors on your premises.' },
  { icon: HeartHandshake,color: '#059669', bg: '#ECFDF5', title: 'Group Personal Accident',  desc: 'Death, total disability, and medical benefits per employee — as required by NSITF.' },
  { icon: Briefcase,     color: '#D97706', bg: '#FFFBEB', title: 'Employee Health Cover',     desc: 'Basic HMO plan for your team. Required under the NHIA Act 2022 for formal employers.' },
  { icon: FileCheck,     color: '#EC4899', bg: '#FDF2F8', title: 'Business Interruption',     desc: 'Revenue replacement if fire or perils force you to halt operations temporarily.' },
]

const coverageOptions = [
  { id: 'fire_perils', label: 'Fire & Special Perils',   sub: 'Fire, lightning, explosion, and allied perils',        price: 50000, defaultChecked: true },
  { id: 'burglary',    label: 'Burglary & Theft',         sub: 'Forcible entry/exit, theft by employees',              price: 35000, defaultChecked: true },
  { id: 'liability',   label: 'Third Party Liability',    sub: 'Legal liability to third parties on your premises',    price: 45000, defaultChecked: false },
  { id: 'gpa',         label: 'Group Personal Accident',  sub: 'Death and disability benefit per employee',            price: 8000,  defaultChecked: false },
  { id: 'health',      label: 'Employee Health Cover',    sub: 'Basic HMO plan for your team',                        price: 12000, defaultChecked: false },
  { id: 'interruption',label: 'Business Interruption',    sub: 'Revenue replacement during forced closure',            price: 30000, defaultChecked: false },
]

const industries = [
  { emoji: '🛒', name: 'Retail / Supermarket',  covers: ['Fire & perils on stock', 'Burglary & cash theft', 'Public liability', 'Employee GPA'] },
  { emoji: '🍽',  name: 'Restaurant / Food',     covers: ['Fire & kitchen perils', 'Loss of profits (interruption)', 'Product liability', 'Employee health'] },
  { emoji: '🏗',  name: 'Construction / Site',   covers: ['Contractors all-risk', 'Plant & machinery', 'Public liability', 'Employee accident'] },
  { emoji: '💻',  name: 'Tech / Office',          covers: ['Computer & equipment cover', 'Professional indemnity', 'Cyber liability', 'Employee group plan'] },
]

const steps = [
  { n: '01', icon: '🏢', title: 'Describe your business', desc: 'Industry, location, number of employees, and assets to insure.' },
  { n: '02', icon: '📊', title: 'Get live quotes',        desc: 'Real-time prices from 5+ NAICOM-licensed commercial insurers.' },
  { n: '03', icon: '💳', title: 'Pay & bind cover',       desc: 'Online payment. Cover binds immediately on confirmation.' },
  { n: '04', icon: '📋', title: 'Get your schedule',      desc: 'Policy schedule emailed instantly — NAICOM-stamped and ready.' },
]

const whyUs = [
  { icon: '⚡', title: 'Same-day cover',          desc: 'Quote, pay, and get your policy schedule in under 15 minutes.' },
  { icon: '🔧', title: 'Custom-built policies',   desc: 'Pick exactly the covers you need — no bloated bundles you don\'t use.' },
  { icon: '📞', title: 'Dedicated claims handler', desc: 'A named claims officer for your business from day one.' },
  { icon: '🧾', title: 'FIRS tax deductible',     desc: 'Business insurance premiums are fully deductible under Nigerian tax law (CITA).' },
]

export default function BusinessProductPage() {
  const [selected, setSelected] = useState<string[]>(['fire_perils', 'burglary'])

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const total = coverageOptions.filter((o) => selected.includes(o.id)).reduce((sum, o) => sum + o.price, 0)

  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>

      {/* ── Hero ── */}
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Tag variant="business">Business Insurance</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              Protect what you<br />built from scratch.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-5" style={{ color: 'var(--text-muted)' }}>
              Fire & perils, burglary, liability, GPA, and employee health — all in one policy for every Nigerian business.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {[{ icon: FileCheck, label: 'NAICOM licensed' }, { icon: Briefcase, label: 'Custom cover' }, { icon: Check, label: 'Same-day binding' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: 'var(--business-600)' }} />
                  <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--business-600)' }}>{label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <Link href="/quote/business"
                className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-2xl font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg"
                style={{ backgroundColor: 'var(--business-600)' }}>
                Get business quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Starting from ₦50,000/yr · Tax deductible under CITA</p>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div className="hidden lg:block"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)', minHeight: 320 }}>
              <div className="relative z-10 flex flex-col items-center justify-center py-10 gap-5 px-8">
                <div className="text-6xl">🏢</div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {[{ icon: '🔥', label: 'Fire & Perils', color: '#DC2626' },
                    { icon: '🔒', label: 'Burglary', color: '#7C3AED' },
                    { icon: '👥', label: 'Liability', color: '#0284C7' },
                    { icon: '🏥', label: 'Employee Health', color: '#059669' }].map((item) => (
                    <div key={item.label} className="bg-white rounded-xl p-3 flex items-center gap-2.5">
                      <span className="text-xl">{item.icon}</span>
                      <p className="font-sans font-semibold text-[12px]" style={{ color: item.color }}>{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl shadow-md px-4 py-3 text-center">
                  <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>Estimated from</p>
                  <p className="font-display font-bold text-[18px]" style={{ color: 'var(--business-600)' }}>₦50,000/yr</p>
                  <p className="font-sans text-[10px]" style={{ color: 'var(--text-subtle)' }}>FIRS tax deductible</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What's Covered ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--business-600)' }}>Coverage</p>
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>What's covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverageItems.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl border border-[var(--border-default)] p-6 hover:border-[var(--business-600)] hover:-translate-y-0.5 transition-all duration-200">
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

      {/* ── What is business insurance ── */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--business-600)' }}>Basics</p>
            <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              What is business insurance?
            </h2>
            <p className="font-sans text-[15px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              Business insurance protects your company's physical assets, employees, and legal liability from unexpected events — fire, theft, accidents, and third-party lawsuits.
            </p>
            <p className="font-sans text-[15px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              In Nigeria, several covers are <strong style={{ color: 'var(--text-primary)' }}>legally required</strong>: Employers' Liability, Employee Compensation (NSITF), and Health Coverage (NHIA 2022) for formal-sector businesses.
            </p>
            <div className="p-4 rounded-2xl border mb-5" style={{ backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }}>
              <p className="font-sans font-semibold text-[13px] mb-1" style={{ color: '#0284C7' }}>💡 Tax benefit</p>
              <p className="font-sans text-[13px]" style={{ color: '#0369A1' }}>
                Business insurance premiums are <strong>fully deductible</strong> as a business expense under the Companies Income Tax Act (CITA). A ₦200,000 premium reduces your tax bill by up to ₦60,000.
              </p>
            </div>
            {['Protects against multi-million naira fire and flood losses', 'Covers legal costs if a customer sues for injury on your premises', 'Mandatory NSITF and employee health requirements satisfied in one policy', 'Business interruption cover keeps you afloat if forced to close temporarily'].map((pt) => (
              <div key={pt} className="flex items-start gap-3 mb-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--business-50)' }}>
                  <Check className="w-3 h-3" style={{ color: 'var(--business-600)' }} strokeWidth={3} />
                </div>
                <p className="font-sans text-[14px]" style={{ color: 'var(--text-secondary)' }}>{pt}</p>
              </div>
            ))}
          </div>

          {/* By industry */}
          <div>
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--business-600)' }}>By Industry</p>
            <div className="flex flex-col gap-3">
              {industries.map((ind) => (
                <div key={ind.name} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{ind.emoji}</span>
                    <p className="font-sans font-bold text-[14px]" style={{ color: 'var(--text-primary)' }}>{ind.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {ind.covers.map((c) => (
                      <span key={c} className="font-sans text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--business-50)', color: 'var(--business-600)' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Coverage builder ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--business-600)' }}>Build your policy</p>
          <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            Custom cover, live pricing
          </h2>
          <p className="font-sans text-base mb-8" style={{ color: 'var(--text-muted)' }}>Pick the covers you need — your premium updates instantly.</p>
          <div className="max-w-[680px] flex flex-col gap-3">
            {coverageOptions.map((opt) => (
              <CheckboxCard key={opt.id} label={opt.label} subLabel={opt.sub} priceTag={`+${formatNaira(opt.price)}/yr`}
                checked={selected.includes(opt.id)} onChange={() => toggle(opt.id)}
                productColor="var(--business-600)" productColorBg="var(--business-50)" />
            ))}
          </div>
          <div className="max-w-[680px] mt-4 px-6 py-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{ backgroundColor: 'var(--business-600)' }}>
            <div>
              <p className="font-sans font-medium text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Estimated annual premium:</p>
              <p className="font-display font-bold text-[28px] text-white">{formatNaira(total)}</p>
              <p className="font-sans text-[12px]" style={{ color: 'rgba(255,255,255,0.6)' }}>FIRS-deductible · NAICOM licensed</p>
            </div>
            <Link href="/quote/business"
              className="h-11 px-5 bg-white rounded-xl font-sans font-semibold text-sm flex items-center shrink-0"
              style={{ color: 'var(--business-600)' }}>
              Get this quote →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2 text-center" style={{ color: 'var(--business-600)' }}>Process</p>
          <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-10 text-center" style={{ color: 'var(--text-primary)' }}>
            Insured in 4 steps
          </h2>
          <div className="relative grid md:grid-cols-4 gap-6">
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px" style={{ backgroundColor: 'var(--border-default)' }} />
            {steps.map((step, i) => (
              <motion.div key={step.n}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 relative z-10"
                  style={{ backgroundColor: i === 3 ? 'var(--business-600)' : 'var(--business-50)', border: '2px solid', borderColor: i === 3 ? 'var(--business-600)' : '#DDD6FE' }}>
                  {step.icon}
                </div>
                <span className="font-sans font-bold text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--business-600)' }}>Step {step.n}</span>
                <h3 className="font-display font-bold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/quote/business"
              className="inline-flex items-center h-[54px] px-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-base transition-all hover:-translate-y-px hover:shadow-lg">
              Get insured now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why ShopInsurance ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--business-600)' }}>Why us</p>
          <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
            Why ShopInsurance for business cover?
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

      {/* ── FAQ ── */}
      <FAQAccordion faqs={BUSINESS_FAQS} productColor="var(--business-600)" />

      {/* ── Footer CTA ── */}
      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--business-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Secure your business today</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Custom coverage for every Nigerian business, big or small. Tax deductible under CITA.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/quote/business"
              className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px] transition-all hover:bg-white/90"
              style={{ color: 'var(--business-600)' }}>
              Get business quote now →
            </Link>
            <a href="https://wa.me/2348001234567"
              className="inline-flex items-center gap-2 h-12 px-7 border-2 border-white/40 rounded-xl font-sans font-semibold text-[15px] text-white/90 hover:border-white">
              <PhoneCall className="w-4 h-4" /> Talk to a specialist
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
