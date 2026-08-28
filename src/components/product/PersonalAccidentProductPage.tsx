'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, HeartPulse, ShieldAlert, Users, Briefcase, FileCheck, X, PhoneCall } from 'lucide-react'
import Tag from '@/components/ui/Tag'
import FAQAccordion from '@/components/product/FAQAccordion'

const PA_FAQS = [
  { q: 'What does personal accident insurance cover?', a: 'It pays a benefit for accidental death, permanent total or partial disability, temporary total disability, and medical expenses arising from an accident — whether it happens at work, at home, in traffic, or anywhere else. It is not health insurance and does not cover illness.' },
  { q: 'How is my coverage amount (sum insured) chosen?', a: "You choose a coverage tier — ₦1M, ₦2M, ₦5M, or ₦10M — which is the maximum amount paid for a covered accidental death or permanent total disability. Partial disability and medical expense benefits are paid as a proportion of this sum, according to your policy schedule." },
  { q: 'Do I need to disclose pre-existing medical conditions?', a: "Yes. NSIA asks you to declare any pre-existing conditions when you apply. This does not necessarily disqualify you from cover, but it must be accurate — an undisclosed condition relevant to a claim can affect whether that claim is paid." },
  { q: 'Who receives the payout if I die in a covered accident?', a: "The beneficiary you name during your application — typically a spouse, child, or parent. You can update your beneficiary at any time by contacting NSIA directly; keep this detail current, especially after major life changes." },
  { q: 'Is personal accident cover the same as life insurance?', a: 'No. Personal accident cover only pays out for accidents — it does not cover death or disability from illness or natural causes. It is usually far cheaper than life insurance because it covers a narrower set of risks, and is a good complement to, not a replacement for, life or health cover.' },
  { q: 'What documents do I need to apply?', a: 'NSIA requires a means of identification, a recent utility bill, and a passport photograph. A medical report may be requested for higher coverage amounts. Your certificate is issued once your application and documents are submitted.' },
]

const coverageItems = [
  { icon: HeartPulse,  color: '#E11D48', bg: '#FFF1F2', title: 'Accidental death',        desc: 'A lump-sum benefit paid to your named beneficiary.' },
  { icon: ShieldAlert, color: '#DC2626', bg: '#FEF2F2', title: 'Permanent disability',     desc: 'Cover for permanent total or partial disability from an accident.' },
  { icon: Briefcase,   color: '#D97706', bg: '#FFFBEB', title: 'Temporary disability',     desc: 'Income replacement while you recover from a covered injury.' },
  { icon: FileCheck,   color: '#059669', bg: '#ECFDF5', title: 'Medical expenses',         desc: 'Reimbursement for treatment costs following a covered accident.' },
  { icon: Users,       color: '#7C3AED', bg: '#F5F3FF', title: 'Named beneficiary',        desc: 'You choose who receives the benefit if a claim is paid.' },
  { icon: Check,       color: '#0284C7', bg: '#F0F9FF', title: 'NAICOM licensed',          desc: 'Underwritten directly by NSIA Insurance, a NAICOM-regulated insurer.' },
]

const notCovered = [
  'Death or disability from illness or natural causes',
  'Self-inflicted injury or suicide',
  'Injury while under the influence of drugs or alcohol',
  'Participation in professional or hazardous sports, unless declared',
  'War, riot, or nuclear risks',
  'Undisclosed pre-existing conditions relevant to the claim',
]

const steps = [
  { n: '01', icon: '🧍', title: 'Tell us about you',    desc: 'Age, occupation, and the coverage amount you want.' },
  { n: '02', icon: '❤️', title: 'Name a beneficiary',   desc: 'Who receives the benefit, plus a quick health declaration.' },
  { n: '03', icon: '📄', title: 'Upload your documents', desc: 'ID, utility bill, and a passport photograph.' },
  { n: '04', icon: '✅', title: 'Get your certificate',  desc: 'Policy number issued directly by NSIA on submission.' },
]

export default function PersonalAccidentProductPage() {
  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>

      {/* ── Hero ── */}
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Tag variant="pa">Personal Accident Insurance</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              Protection for<br />life&apos;s accidents.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-5" style={{ color: 'var(--text-muted)' }}>
              Cover for accidental death, disability, and injury — at work, at home, or anywhere in between. Underwritten directly by NSIA Insurance.
            </p>
            <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-6 border" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}>
              <Check className="w-5 h-5 shrink-0" style={{ color: 'var(--green-700)' }} />
              <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--green-700)' }}>
                Direct NSIA underwriting · From ₦1,000,000 cover · NAICOM regulated
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Link href="/quote/personal-accident"
                className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-2xl font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg"
                style={{ backgroundColor: 'var(--pa-600)' }}>
                Get accident cover <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Coverage from ₦1M to ₦10M</p>
            </div>
          </motion.div>

          <motion.div className="hidden lg:block"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF1F2 0%, #FECDD3 100%)', minHeight: 320 }}>
              <div className="relative z-10 flex flex-col items-center justify-center py-10 gap-5 px-8">
                <div className="text-7xl">🩹</div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {[{ label: 'Basic', price: '₦1,000,000', color: 'var(--pa-600)' },
                    { label: 'Standard', price: '₦2,000,000', color: '#7C3AED' },
                    { label: 'Enhanced', price: '₦5,000,000', color: '#059669' },
                    { label: 'Premium', price: '₦10,000,000', color: '#DC2626' }].map((p) => (
                    <div key={p.label} className="bg-white rounded-2xl shadow-sm p-3 text-center">
                      <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{p.label} tier</p>
                      <p className="font-display font-bold text-[13px]" style={{ color: p.color }}>{p.price}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl shadow-md px-4 py-2.5 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" style={{ color: 'var(--pa-600)' }} />
                  <p className="font-sans font-medium text-[12px]" style={{ color: 'var(--text-primary)' }}>Underwritten by NSIA Insurance</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What's Covered ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--pa-600)' }}>Coverage</p>
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>What&apos;s covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverageItems.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl border border-[var(--border-default)] p-6 hover:border-[var(--pa-600)] hover:-translate-y-0.5 transition-all duration-200">
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

      {/* ── What is personal accident insurance ── */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--pa-600)' }}>Basics</p>
            <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              What is personal accident insurance?
            </h2>
            <p className="font-sans text-[15px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              Personal accident insurance pays a benefit if you die, become disabled, or are injured as a direct result of an accident. Unlike health insurance, it does not cover illness — it exists specifically for the financial shock of a sudden accident.
            </p>
            <p className="font-sans text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              You choose a <strong style={{ color: 'var(--text-primary)' }}>coverage amount</strong> — the maximum benefit paid for death or permanent total disability — and name a <strong style={{ color: 'var(--text-primary)' }}>beneficiary</strong> to receive it.
            </p>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
                <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>What&apos;s NOT covered</p>
              </div>
              <div className="divide-y p-2" style={{ borderColor: 'var(--border-subtle)' }}>
                {notCovered.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 py-2.5 px-2">
                    <X className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: '#DC2626' }} />
                    <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--pa-600)' }}>Coverage tiers</p>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
              <div className="grid grid-cols-2 px-4 py-3" style={{ backgroundColor: 'var(--pa-600)' }}>
                <p className="font-sans font-bold text-[11px] text-white uppercase tracking-[0.06em]">Tier</p>
                <p className="font-sans font-bold text-[11px] text-white/70 uppercase tracking-[0.06em]">Good for</p>
              </div>
              {[
                { tier: '₦1,000,000', fit: 'Individuals seeking baseline cover' },
                { tier: '₦2,000,000', fit: 'Salaried employees, small families' },
                { tier: '₦5,000,000', fit: 'Sole breadwinners, higher-risk occupations' },
                { tier: '₦10,000,000', fit: 'Business owners, dependants to protect' },
              ].map((row, i) => (
                <div key={row.tier} className="grid grid-cols-2 px-4 py-3 border-t gap-2" style={{ borderColor: 'var(--border-subtle)', backgroundColor: i % 2 === 0 ? 'white' : 'var(--surface-raised)' }}>
                  <p className="font-sans font-semibold text-[12px]" style={{ color: 'var(--pa-600)' }}>{row.tier}</p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{row.fit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2 text-center" style={{ color: 'var(--pa-600)' }}>Process</p>
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
                  style={{ backgroundColor: i === 3 ? 'var(--pa-600)' : 'var(--pa-50)', border: '2px solid', borderColor: i === 3 ? 'var(--pa-600)' : 'var(--pa-100)' }}>
                  {step.icon}
                </div>
                <span className="font-sans font-bold text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--pa-600)' }}>Step {step.n}</span>
                <h3 className="font-display font-bold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/quote/personal-accident"
              className="inline-flex items-center h-[54px] px-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-base transition-all hover:-translate-y-px hover:shadow-lg">
              Get accident cover →
            </Link>
          </div>
        </div>
      </section>

      <FAQAccordion faqs={PA_FAQS} productColor="var(--pa-600)" />

      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--pa-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Protect what an accident could cost you</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Certificate issued directly by NSIA on submission.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/quote/personal-accident"
              className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px] transition-all hover:bg-white/90"
              style={{ color: 'var(--pa-600)' }}>
              Get accident cover now →
            </Link>
            <a href="https://wa.me/2348001234567"
              className="inline-flex items-center gap-2 h-12 px-7 border-2 border-white/40 rounded-xl font-sans font-semibold text-[15px] text-white/90 hover:border-white">
              <PhoneCall className="w-4 h-4" /> Speak to an expert
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
