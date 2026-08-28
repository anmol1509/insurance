'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Ship, Package, Globe, FileCheck, ShieldCheck, X, PhoneCall } from 'lucide-react'
import Tag from '@/components/ui/Tag'
import FAQAccordion from '@/components/product/FAQAccordion'

const MARINE_FAQS = [
  { q: 'What does marine cargo insurance actually cover?', a: 'It covers physical loss or damage to goods while they are in transit — by sea, air, or land — from the point of origin to their final destination. This includes loading and unloading, transhipment, and storage in transit, depending on the cover type you choose.' },
  { q: 'What is the difference between "All Risks" and "Institute Cargo Clauses"?', a: 'All Risks cover is the broadest — it covers any loss or damage unless specifically excluded. Institute Cargo Clauses A, B, and C offer decreasing levels of cover: Clause A is close to All Risks, Clause B covers named perils like fire, flood, and vessel accidents, and Clause C covers only major casualties like sinking or collision.' },
  { q: 'Do I need marine insurance for local transit within Nigeria?', a: 'Yes — goods moved by road, rail or inland waterway within Nigeria are still exposed to accident, theft and fire risk. NSIA\'s "Local Transit" cargo category is designed specifically for this, alongside Import Cargo and Export Cargo for goods crossing borders.' },
  { q: 'How is my premium calculated?', a: 'Premium is based on the sum insured (the value of your goods), the cargo category, and the cover type you select. Our quote flow calculates this live with NSIA Insurance before you submit your application, so the figure you see is the figure you pay.' },
  { q: 'What documents do I need to submit a claim or a policy application?', a: 'To apply, NSIA requires a means of identification, a recent utility bill, and your commercial invoice for the goods. A bill of lading and packing list are recommended but optional. Keep these ready before you shipment departs so cover can be arranged in time.' },
  { q: 'Can I insure goods in a foreign currency?', a: 'Yes. Select USD, GBP or EUR as your currency when describing your shipment. NSIA publishes daily exchange rates used to convert your sum insured for underwriting — your certificate will show both the original currency and the Naira equivalent.' },
]

const coverageItems = [
  { icon: Ship,        color: '#2563EB', bg: '#EFF6FF', title: 'All modes of transit',   desc: 'Cover for goods moving by sea, air, or land, door to door.' },
  { icon: Package,     color: '#7C3AED', bg: '#F5F3FF', title: 'Import & export cargo',  desc: 'Cover for goods crossing Nigerian borders in either direction.' },
  { icon: Globe,       color: '#059669', bg: '#ECFDF5', title: 'Local transit',          desc: 'Cover for goods moved within Nigeria by road, rail or waterway.' },
  { icon: FileCheck,   color: '#D97706', bg: '#FFFBEB', title: 'Flexible cover levels',  desc: 'From All Risks down to named-peril Institute Cargo Clause C.' },
  { icon: ShieldCheck, color: '#DC2626', bg: '#FEF2F2', title: 'NAICOM licensed',        desc: 'Underwritten directly by NSIA Insurance, a NAICOM-regulated insurer.' },
  { icon: Check,       color: '#0284C7', bg: '#F0F9FF', title: 'Live premium quote',     desc: "NSIA's own calculator prices your shipment before you apply." },
]

const notCovered = [
  'Ordinary wear, tear, or leakage',
  'Inherent vice or nature of the goods themselves',
  'Insufficient or unsuitable packing',
  'Delay, even where caused by an insured peril',
  'Loss arising from the insolvency of carriers',
  'War and strikes, unless separately extended',
]

const steps = [
  { n: '01', icon: '📦', title: 'Describe your shipment', desc: 'Cargo category, value, vessel and voyage details.' },
  { n: '02', icon: '📊', title: 'Get a live premium',     desc: "Priced instantly using NSIA Insurance's own calculator." },
  { n: '03', icon: '📄', title: 'Upload your documents',  desc: 'ID, utility bill, and your commercial invoice.' },
  { n: '04', icon: '✅', title: 'Get your certificate',   desc: 'Policy number issued directly by NSIA on submission.' },
]

export default function MarineProductPage() {
  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>

      {/* ── Hero ── */}
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Tag variant="marine">Marine Insurance</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              Your cargo,<br />covered in transit.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-5" style={{ color: 'var(--text-muted)' }}>
              Insure goods moving by sea, air or land — import, export, or local transit. Underwritten directly by NSIA Insurance, priced live in minutes.
            </p>
            <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-6 border" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}>
              <Check className="w-5 h-5 shrink-0" style={{ color: 'var(--green-700)' }} />
              <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--green-700)' }}>
                Direct NSIA underwriting · Live premium calculator · NAICOM regulated
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Link href="/quote/marine"
                className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-2xl font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg"
                style={{ backgroundColor: 'var(--marine-600)' }}>
                Get marine quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Import, export & local transit cargo cover</p>
            </div>
          </motion.div>

          <motion.div className="hidden lg:block"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', minHeight: 320 }}>
              <div className="relative z-10 flex flex-col items-center justify-center py-10 gap-5 px-8">
                <div className="text-7xl">🚢</div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {[{ label: 'Import cargo', sub: 'All Risks', color: 'var(--marine-600)' },
                    { label: 'Export cargo', sub: 'ICC Clause A', color: '#7C3AED' },
                    { label: 'Local transit', sub: 'ICC Clause B', color: '#059669' },
                    { label: 'Any currency', sub: 'NGN / USD / GBP', color: '#DC2626' }].map((p) => (
                    <div key={p.label} className="bg-white rounded-2xl shadow-sm p-3 text-center">
                      <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{p.label}</p>
                      <p className="font-display font-bold text-[13px]" style={{ color: p.color }}>{p.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl shadow-md px-4 py-2.5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" style={{ color: 'var(--marine-600)' }} />
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
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--marine-600)' }}>Coverage</p>
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>What&apos;s covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverageItems.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl border border-[var(--border-default)] p-6 hover:border-[var(--marine-600)] hover:-translate-y-0.5 transition-all duration-200">
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

      {/* ── What is marine insurance ── */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--marine-600)' }}>Basics</p>
            <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              What is marine cargo insurance?
            </h2>
            <p className="font-sans text-[15px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              Marine cargo insurance protects the financial value of goods while they are being transported — whether across an ocean, through the air, or across Nigeria by road. If your shipment is lost, damaged, or destroyed in transit, your policy compensates you for its insured value.
            </p>
            <p className="font-sans text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              Cover is priced against the <strong style={{ color: 'var(--text-primary)' }}>sum insured</strong> — the declared value of your goods — and the <strong style={{ color: 'var(--text-primary)' }}>cover type</strong> you choose, from broad All Risks cover down to named-peril clauses for lower-value shipments.
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
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--marine-600)' }}>Cover types</p>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
              <div className="grid grid-cols-2 px-4 py-3" style={{ backgroundColor: 'var(--marine-600)' }}>
                <p className="font-sans font-bold text-[11px] text-white uppercase tracking-[0.06em]">Cover</p>
                <p className="font-sans font-bold text-[11px] text-white/70 uppercase tracking-[0.06em]">Scope</p>
              </div>
              {[
                { cover: 'All Risks', scope: 'Broadest — any loss unless excluded' },
                { cover: 'With Average', scope: 'Partial loss covered, subject to threshold' },
                { cover: 'FPA', scope: 'Total loss & named partial-loss perils' },
                { cover: 'Institute Cargo Clause A', scope: 'Near-equivalent to All Risks' },
                { cover: 'Institute Cargo Clause B', scope: 'Named perils — fire, flood, collision' },
                { cover: 'Institute Cargo Clause C', scope: 'Major casualties only — sinking, collision' },
              ].map((row, i) => (
                <div key={row.cover} className="grid grid-cols-2 px-4 py-3 border-t gap-2" style={{ borderColor: 'var(--border-subtle)', backgroundColor: i % 2 === 0 ? 'white' : 'var(--surface-raised)' }}>
                  <p className="font-sans font-semibold text-[12px]" style={{ color: 'var(--marine-600)' }}>{row.cover}</p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{row.scope}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2 text-center" style={{ color: 'var(--marine-600)' }}>Process</p>
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
                  style={{ backgroundColor: i === 3 ? 'var(--marine-600)' : 'var(--marine-50)', border: '2px solid', borderColor: i === 3 ? 'var(--marine-600)' : 'var(--marine-100)' }}>
                  {step.icon}
                </div>
                <span className="font-sans font-bold text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--marine-600)' }}>Step {step.n}</span>
                <h3 className="font-display font-bold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/quote/marine"
              className="inline-flex items-center h-[54px] px-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-base transition-all hover:-translate-y-px hover:shadow-lg">
              Get a marine quote →
            </Link>
          </div>
        </div>
      </section>

      <FAQAccordion faqs={MARINE_FAQS} productColor="var(--marine-600)" />

      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--marine-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Ready to insure your shipment?</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Live NSIA premium, certificate issued on submission.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/quote/marine"
              className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px] transition-all hover:bg-white/90"
              style={{ color: 'var(--marine-600)' }}>
              Get marine quote now →
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
