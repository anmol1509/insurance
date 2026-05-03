'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Plane, HeartPulse, Luggage, Clock, Globe, Waves, PhoneCall, X } from 'lucide-react'
import Tag from '@/components/ui/Tag'

const coverageItems = [
  { icon: HeartPulse, color: '#DC2626', bg: '#FEF2F2', title: 'Medical emergencies',    desc: 'Hospital treatment, surgery, and emergency evacuation abroad — up to $1M.' },
  { icon: Plane,      color: '#D97706', bg: '#FFFBEB', title: 'Trip cancellation',       desc: 'Full refund if your trip is cancelled for covered reasons before departure.' },
  { icon: Luggage,    color: '#7C3AED', bg: '#F5F3FF', title: 'Baggage & belongings',    desc: 'Lost, stolen, or damaged luggage, passport, and personal effects.' },
  { icon: Clock,      color: '#0284C7', bg: '#F0F9FF', title: 'Flight delay',            desc: 'Compensation for delays over 4 hours — meals, hotel, and rebooking costs.' },
  { icon: Globe,      color: '#059669', bg: '#ECFDF5', title: 'Schengen compliant',      desc: '€30,000+ medical cover meeting EU Schengen and UK visa requirements.' },
  { icon: Waves,      color: '#EC4899', bg: '#FDF2F8', title: 'Adventure sports',        desc: 'Optional cover for skiing, diving, bungee, trekking, and extreme activities.' },
]

const notCovered = [
  'Pre-existing medical conditions (unless declared and agreed)',
  'Travel to countries under Nigerian government travel advisory',
  'Losses due to alcohol or drug use',
  'Self-inflicted injuries',
  'Losses you don\'t report to local authorities within 24 hours',
  'Delay under 4 hours or missed connections due to own fault',
]

const schengenVsWorldwide = [
  { feature: 'Schengen area',           schengen: '✅ Fully covered', worldwide: '✅ Fully covered' },
  { feature: 'UK & Ireland',            schengen: '❌ Not covered',   worldwide: '✅ Covered' },
  { feature: 'USA & Canada',            schengen: '❌ Not covered',   worldwide: '✅ Covered' },
  { feature: 'Asia & Australia',        schengen: '❌ Not covered',   worldwide: '✅ Covered' },
  { feature: 'Min. medical cover',      schengen: '€30,000',          worldwide: '$100,000+' },
  { feature: 'Visa letter included',    schengen: '✅ Yes',           worldwide: 'Not required' },
  { feature: 'Typical premium',         schengen: 'Lower',            worldwide: 'Higher' },
]

const steps = [
  { n: '01', icon: '✈️', title: 'Enter trip details',    desc: 'Destination, travel dates, number of travellers, and trip value.' },
  { n: '02', icon: '📊', title: 'Compare travel plans',  desc: 'Real-time quotes from top insurers with benefit limits side-by-side.' },
  { n: '03', icon: '💳', title: 'Pay securely',          desc: 'Card, bank transfer, or USSD. Instant payment confirmation.' },
  { n: '04', icon: '📄', title: 'Download certificate',  desc: 'PDF policy document ready for your visa appointment in seconds.' },
]

const whyUs = [
  { icon: '🛂', title: 'Visa-ready certificate',   desc: 'Our certificates are accepted at all Schengen, UK, and US consulates.' },
  { icon: '⚡', title: 'Instant policy issuance',  desc: 'Certificate ready in under 3 minutes — even at midnight before your flight.' },
  { icon: '🌍', title: 'Worldwide emergency line', desc: '+234 800 SHOP INS — 24/7 multilingual emergency support abroad.' },
  { icon: '💰', title: 'Cheapest direct price',    desc: 'No broker markup. Compare 5+ insurers and pay the actual insurer rate.' },
]

export default function TravelProductPage() {
  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>

      {/* ── Hero ── */}
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Tag variant="travel">Travel Insurance</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              Travel the world,<br />worry-free.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-5" style={{ color: 'var(--text-muted)' }}>
              Schengen-compliant certificates, medical emergencies, baggage protection. Compare plans from Nigeria's top travel insurers.
            </p>
            <div className="inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-6 border" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)' }}>
              <Check className="w-5 h-5 shrink-0" style={{ color: 'var(--green-700)' }} />
              <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--green-700)' }}>
                Schengen & UK visa compliant · Meets €30,000 minimum medical coverage
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Link href="/quote/travel"
                className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-2xl font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg"
                style={{ backgroundColor: 'var(--travel-600)' }}>
                Get travel quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>From ₦12,000/yr · Single-trip & annual multi-trip</p>
            </div>
          </motion.div>

          {/* Hero visual */}
          <motion.div className="hidden lg:block"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', minHeight: 320 }}>
              <div className="relative z-10 flex flex-col items-center justify-center py-10 gap-5 px-8">
                <div className="text-7xl">✈️</div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  {[{ label: 'Single trip', price: '₦12,000', sub: '7 days', color: 'var(--travel-600)' },
                    { label: 'Multi-trip', price: '₦45,000', sub: '365 days', color: '#7C3AED' },
                    { label: 'Schengen', price: '₦18,000', sub: '14 days', color: '#059669' },
                    { label: 'Worldwide', price: '₦35,000', sub: '30 days', color: '#DC2626' }].map((p) => (
                    <div key={p.label} className="bg-white rounded-2xl shadow-sm p-3 text-center">
                      <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>{p.label} · {p.sub}</p>
                      <p className="font-display font-bold text-[14px]" style={{ color: p.color }}>{p.price}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-2xl shadow-md px-4 py-2.5 flex items-center gap-2">
                  <span className="text-base">🛂</span>
                  <p className="font-sans font-medium text-[12px]" style={{ color: 'var(--text-primary)' }}>Accepted at Schengen & UK consulates</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What's Covered ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--travel-600)' }}>Coverage</p>
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>What's covered</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverageItems.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl border border-[var(--border-default)] p-6 hover:border-[var(--travel-600)] hover:-translate-y-0.5 transition-all duration-200">
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

      {/* ── What is travel insurance ── */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--travel-600)' }}>Basics</p>
            <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              What is travel insurance?
            </h2>
            <p className="font-sans text-[15px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              Travel insurance protects you financially when things go wrong before or during a trip — medical emergencies abroad, cancelled flights, lost luggage, or travel delays.
            </p>
            <p className="font-sans text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              For <strong style={{ color: 'var(--text-primary)' }}>Schengen visa applications</strong>, proof of minimum €30,000 medical travel insurance is <strong style={{ color: 'var(--text-primary)' }}>legally required</strong> by all EU embassies. Our certificates are accepted by all 27 Schengen member states.
            </p>
            <div className="p-4 rounded-2xl border mb-4" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
              <p className="font-sans font-semibold text-[13px] mb-1" style={{ color: '#92400E' }}>⚠️ Without travel insurance abroad:</p>
              <p className="font-sans text-[13px]" style={{ color: '#92400E' }}>A 3-day hospitalisation in the UK costs ₦4–12M. In the USA, a simple surgery can exceed ₦80M. Travel insurance covers all of this.</p>
            </div>

            {/* What's NOT covered */}
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--surface-raised)' }}>
                <p className="font-sans font-bold text-[12px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-subtle)' }}>What's NOT covered</p>
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

          {/* Schengen vs Worldwide */}
          <div>
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: 'var(--travel-600)' }}>Schengen vs Worldwide</p>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border-default)' }}>
              <div className="grid grid-cols-3 px-4 py-3" style={{ backgroundColor: 'var(--travel-600)' }}>
                <p className="font-sans font-bold text-[11px] text-white/70 uppercase tracking-[0.06em]">Feature</p>
                <p className="font-sans font-bold text-[11px] text-white uppercase tracking-[0.06em]">Schengen</p>
                <p className="font-sans font-bold text-[11px] text-white/70 uppercase tracking-[0.06em]">Worldwide</p>
              </div>
              {schengenVsWorldwide.map((row, i) => (
                <div key={row.feature} className="grid grid-cols-3 px-4 py-3 border-t gap-2" style={{ borderColor: 'var(--border-subtle)', backgroundColor: i % 2 === 0 ? 'white' : 'var(--surface-raised)' }}>
                  <p className="font-sans font-semibold text-[12px]" style={{ color: 'var(--text-secondary)' }}>{row.feature}</p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--travel-600)' }}>{row.schengen}</p>
                  <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>{row.worldwide}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2 text-center" style={{ color: 'var(--travel-600)' }}>Process</p>
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
                  style={{ backgroundColor: i === 3 ? 'var(--travel-600)' : 'var(--travel-50)', border: '2px solid', borderColor: i === 3 ? 'var(--travel-600)' : '#FDE68A' }}>
                  {step.icon}
                </div>
                <span className="font-sans font-bold text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--travel-600)' }}>Step {step.n}</span>
                <h3 className="font-display font-bold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/quote/travel"
              className="inline-flex items-center h-[54px] px-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-base transition-all hover:-translate-y-px hover:shadow-lg">
              Compare travel plans →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why ShopInsurance ── */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--travel-600)' }}>Why us</p>
          <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
            Why ShopInsurance for travel cover?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyUs.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="rounded-3xl border border-[var(--border-default)] p-6" style={{ backgroundColor: 'var(--surface-raised)' }}>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--travel-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Ready to travel with confidence?</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Schengen certificate in minutes. Accepted at all EU consulates.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/quote/travel"
              className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px] transition-all hover:bg-white/90"
              style={{ color: 'var(--travel-600)' }}>
              Get travel quote now →
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
