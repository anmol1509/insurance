'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Shield, Clock, Check, ArrowRight, Flame, Lock, Users, CloudRain, Wrench, BadgeCheck, Info, Star, PhoneCall } from 'lucide-react'
import Tag from '@/components/ui/Tag'

const coverageItems = [
  { icon: Shield,     color: '#1D4ED8', bg: '#EFF6FF', title: 'Accidental damage',     desc: 'Full cover for your vehicle in case of collision, impact, or rollover.' },
  { icon: Flame,      color: '#DC2626', bg: '#FEF2F2', title: 'Theft & fire',           desc: 'Complete protection against vehicle theft, arson, and fire damage.' },
  { icon: Users,      color: '#7C3AED', bg: '#F5F3FF', title: 'Third party liability',  desc: 'Covers legal liability to third parties — bodily injury and property damage.' },
  { icon: CloudRain,  color: '#0284C7', bg: '#F0F9FF', title: 'Flood & natural perils', desc: 'Cover for flood, hailstorm, windstorm, and other acts of nature.' },
  { icon: Wrench,     color: '#D97706', bg: '#FFFBEB', title: 'Roadside assistance',    desc: '24/7 towing, battery jump-start, flat tyre, and emergency fuel delivery.' },
  { icon: BadgeCheck, color: '#059669', bg: '#ECFDF5', title: 'NIID auto-registration', desc: 'Instant NIID registration — certificate valid nationwide in under 3 minutes.' },
]

const steps = [
  { n: '01', icon: '🚗', title: 'Enter vehicle details',    desc: 'Reg number, make/model, market value and cover type — takes 2 minutes.' },
  { n: '02', icon: '📊', title: 'Compare live quotes',      desc: 'We fetch real-time prices from 10+ NAICOM-licensed insurers instantly.' },
  { n: '03', icon: '💳', title: 'Pay securely',             desc: 'Paystack or Flutterwave — card, bank transfer, or USSD. 100% secure.' },
  { n: '04', icon: '🛡', title: 'Get your certificate',     desc: 'Your NIID certificate lands in your inbox within 3 minutes of payment.' },
]

const coverTypes = [
  {
    id: 'comprehensive',
    name: 'Comprehensive',
    price: 'from ₦65,000/yr',
    tag: 'Most popular',
    tagColor: '#059669',
    covers: ['Own damage (accident, fire, theft)', 'Third party injury & property', 'Flood & natural perils', 'Roadside assistance', 'NIID registration'],
    notCovered: ['Mechanical breakdown', 'Wear & tear'],
  },
  {
    id: 'tpft',
    name: 'Third Party Fire & Theft',
    price: 'from ₦25,000/yr',
    tag: null,
    tagColor: '',
    covers: ['Third party bodily injury', 'Third party property damage', 'Fire damage to own vehicle', 'Theft of own vehicle'],
    notCovered: ['Accidental damage to own car', 'Flood & natural perils'],
  },
  {
    id: 'tpo',
    name: 'Third Party Only',
    price: 'from ₦15,000/yr',
    tag: 'Legal minimum',
    tagColor: '#D97706',
    covers: ['Third party bodily injury', 'Third party property damage', 'NIID registration'],
    notCovered: ['Any damage to your own vehicle', 'Theft or fire', 'Natural perils'],
  },
]

const whyUs = [
  { icon: '⚡', title: 'Certificate in 3 minutes',   desc: 'Fastest issuance in Nigeria — no agent visits, no paperwork.' },
  { icon: '🏆', title: '10+ NAICOM-licensed insurers', desc: 'We shop the market so you always get the best price.' },
  { icon: '📞', title: '24/7 claims support',          desc: 'Dedicated claims team, WhatsApp or call, any time of day.' },
  { icon: '🔒', title: 'NDPR-compliant data security', desc: 'Your personal data is encrypted and never sold to third parties.' },
]

export default function MotorProductPage() {
  return (
    <div style={{ backgroundColor: 'var(--page-bg)' }}>

      {/* ── Hero ── */}
      <section className="bg-white py-16 px-5 lg:px-20">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Tag variant="motor">Motor Insurance</Tag>
            <h1 className="font-display font-extrabold mt-4 mb-4 tracking-tight leading-[1.08]"
              style={{ fontSize: 'clamp(36px, 4vw, 52px)', color: 'var(--text-primary)' }}>
              Drive with full<br />confidence.
            </h1>
            <p className="font-sans text-[17px] leading-relaxed max-w-[460px] mb-5" style={{ color: 'var(--text-muted)' }}>
              Comprehensive, TPO, or TPF&T cover — get your NIID-registered certificate in under 3 minutes from Nigeria's top insurers.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {[{ icon: Shield, label: 'NIID Registered' }, { icon: Clock, label: 'Certificate in 3 mins' }, { icon: Check, label: 'Claims in 24 hours' }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: 'var(--motor-600)' }} />
                  <span className="font-sans font-medium text-[13px]" style={{ color: 'var(--motor-600)' }}>{label}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <Link href="/quote/motor"
                className="inline-flex items-center gap-2 w-fit h-14 px-8 rounded-2xl font-sans font-semibold text-base text-white transition-all hover:-translate-y-px hover:shadow-lg"
                style={{ backgroundColor: 'var(--motor-600)' }}>
                Get motor quote <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="font-sans text-xs" style={{ color: 'var(--text-subtle)' }}>Starting from ₦15,000/yr · No agent required</p>
            </div>
          </motion.div>

          {/* Car photo hero */}
          <motion.div className="hidden lg:block relative"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="relative rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', minHeight: 340 }}>
              {/* Decorative rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border-[2px] opacity-20" style={{ borderColor: 'var(--motor-600)' }} />
                <div className="absolute w-96 h-96 rounded-full border-[1px] opacity-10" style={{ borderColor: 'var(--motor-600)' }} />
              </div>
              {/* Car SVG — modern SUV side view */}
              <div className="relative z-10 flex items-end justify-center px-8 pt-10 pb-6">
                <svg viewBox="0 0 480 200" width="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Body */}
                  <rect x="30" y="90" width="420" height="80" rx="18" fill="#1D4ED8" />
                  {/* Cabin roof */}
                  <path d="M110 90 C130 40 160 25 200 22 L310 22 C350 22 380 40 400 90Z" fill="#2563EB" />
                  {/* Windscreen */}
                  <path d="M200 27 C215 27 280 27 305 27 L380 88 L140 88Z" fill="#BFDBFE" opacity="0.7" />
                  {/* Rear window */}
                  <path d="M130 88 L170 32 L195 27 L145 88Z" fill="#BFDBFE" opacity="0.5" />
                  {/* Door details */}
                  <rect x="155" y="92" width="75" height="55" rx="4" fill="#1E40AF" opacity="0.5" />
                  <rect x="240" y="92" width="80" height="55" rx="4" fill="#1E40AF" opacity="0.5" />
                  <rect x="330" y="92" width="60" height="55" rx="4" fill="#1E40AF" opacity="0.4" />
                  {/* Door handles */}
                  <rect x="185" y="118" width="22" height="5" rx="2.5" fill="#93C5FD" />
                  <rect x="270" y="118" width="22" height="5" rx="2.5" fill="#93C5FD" />
                  <rect x="350" y="118" width="18" height="5" rx="2.5" fill="#93C5FD" />
                  {/* Headlights */}
                  <rect x="430" y="100" width="22" height="14" rx="4" fill="#FDE68A" />
                  <rect x="428" y="118" width="16" height="8" rx="3" fill="#FCD34D" opacity="0.7" />
                  {/* Tail lights */}
                  <rect x="28" y="100" width="16" height="14" rx="4" fill="#FCA5A5" />
                  {/* Wheels */}
                  <circle cx="120" cy="170" r="32" fill="#1E293B" />
                  <circle cx="120" cy="170" r="20" fill="#475569" />
                  <circle cx="120" cy="170" r="10" fill="#CBD5E1" />
                  <circle cx="370" cy="170" r="32" fill="#1E293B" />
                  <circle cx="370" cy="170" r="20" fill="#475569" />
                  <circle cx="370" cy="170" r="10" fill="#CBD5E1" />
                  {/* Ground shadow */}
                  <ellipse cx="240" cy="200" rx="220" ry="10" fill="#1D4ED8" opacity="0.08" />
                  {/* Roof rack detail */}
                  <rect x="185" y="21" width="120" height="5" rx="2.5" fill="#1D4ED8" opacity="0.4" />
                  {/* Side mirror */}
                  <path d="M415 105 L430 108 L430 114 L415 114Z" fill="#1E40AF" />
                </svg>
              </div>
              {/* Floating stat cards */}
              <div className="absolute top-4 right-4 bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-2.5">
                <span className="text-xl">🏦</span>
                <div>
                  <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>From</p>
                  <p className="font-display font-bold text-[15px]" style={{ color: 'var(--motor-600)' }}>₦15,000/yr</p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-white rounded-2xl shadow-md px-4 py-3 flex items-center gap-2.5">
                <div className="flex -space-x-1">
                  {['#1D4ED8', '#059669', '#D97706'].map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold" style={{ backgroundColor: c }}>
                      {['L', 'A', 'N'][i]}
                    </div>
                  ))}
                </div>
                <p className="font-sans font-medium text-[12px]" style={{ color: 'var(--text-primary)' }}>10+ insurers compared</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── What's Covered ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--green-700)' }}>What's Covered</p>
          <h2 className="font-display font-extrabold text-[34px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
            Full protection, every road
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coverageItems.map((item, i) => (
              <motion.div key={item.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-3xl border border-[var(--border-default)] p-6 hover:border-[var(--motor-600)] hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: item.bg }}>
                  <item.icon className="w-[22px] h-[22px]" style={{ color: item.color }} strokeWidth={2} />
                </div>
                <h3 className="font-display font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What is motor insurance ── */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--motor-600)' }}>Basics</p>
            <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-4" style={{ color: 'var(--text-primary)' }}>
              What is motor insurance?
            </h2>
            <p className="font-sans text-[15px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              Motor insurance (also called car insurance) is a contract between you and an insurer that protects you from financial loss if your vehicle is involved in an accident, stolen, or damaged.
            </p>
            <p className="font-sans text-[15px] leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
              In Nigeria, <strong style={{ color: 'var(--text-primary)' }}>Third Party insurance is mandatory</strong> under the Motor Vehicles (Third Party Insurance) Act. Driving without it attracts fines and potential prosecution by FRSC.
            </p>
            <div className="flex flex-col gap-3">
              {['Protects you from expensive repair bills after accidents', 'Covers legal liability if you injure someone or damage their property', 'Provides compensation if your car is stolen or written off', 'Required by law — FRSC checks at roadblocks and toll gates'].map((pt) => (
                <div key={pt} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: 'var(--motor-50)' }}>
                    <Check className="w-3 h-3" style={{ color: 'var(--motor-600)' }} strokeWidth={3} />
                  </div>
                  <p className="font-sans text-[14px]" style={{ color: 'var(--text-secondary)' }}>{pt}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Stats block */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '50K+', label: 'Policies issued on ShopInsurance', color: 'var(--motor-600)', bg: 'var(--motor-50)' },
              { value: '98%', label: 'Claim settlement rate with top insurers', color: '#059669', bg: '#ECFDF5' },
              { value: '3 min', label: 'Average time to get your certificate', color: '#7C3AED', bg: '#F5F3FF' },
              { value: '₦0', label: 'Broker commission — prices direct from insurer', color: '#D97706', bg: '#FFFBEB' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border p-5" style={{ backgroundColor: s.bg, borderColor: 'transparent' }}>
                <p className="font-display font-extrabold text-[32px] leading-none mb-1" style={{ color: s.color }}>{s.value}</p>
                <p className="font-sans text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cover type comparison ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--green-700)' }}>Cover Types</p>
          <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>
            Comprehensive vs TPF&T vs TPO
          </h2>
          <p className="font-sans text-[15px] mb-8" style={{ color: 'var(--text-muted)' }}>
            Choose the right level of protection for your vehicle and budget.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {coverTypes.map((ct, i) => (
              <motion.div key={ct.id}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`bg-white rounded-3xl border-2 p-6 flex flex-col ${i === 0 ? 'border-[var(--motor-600)]' : 'border-[var(--border-default)]'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-[18px]" style={{ color: 'var(--text-primary)' }}>{ct.name}</h3>
                  {ct.tag && (
                    <span className="font-sans font-bold text-[10px] px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: ct.tagColor }}>
                      {ct.tag}
                    </span>
                  )}
                </div>
                <p className="font-sans font-semibold text-[14px] mb-4" style={{ color: 'var(--motor-600)' }}>{ct.price}</p>
                <div className="flex-1">
                  <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text-subtle)' }}>What's covered</p>
                  {ct.covers.map((c) => (
                    <div key={c} className="flex items-center gap-2 mb-1.5">
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: '#059669' }} strokeWidth={3} />
                      <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{c}</span>
                    </div>
                  ))}
                  <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.06em] mb-2 mt-3" style={{ color: 'var(--text-subtle)' }}>Not covered</p>
                  {ct.notCovered.map((c) => (
                    <div key={c} className="flex items-center gap-2 mb-1.5">
                      <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                        <div className="w-3 h-0.5 rounded" style={{ backgroundColor: '#DC2626' }} />
                      </div>
                      <span className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{c}</span>
                    </div>
                  ))}
                </div>
                <Link href="/quote/motor"
                  className="mt-5 w-full h-11 rounded-xl flex items-center justify-center font-sans font-semibold text-[13px] transition-all hover:opacity-90"
                  style={{ backgroundColor: i === 0 ? 'var(--motor-600)' : 'var(--surface-raised)', color: i === 0 ? 'white' : 'var(--text-secondary)', border: i === 0 ? 'none' : '1.5px solid var(--border-default)' }}>
                  Get {ct.name} quote →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-16 px-5 lg:px-20 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2 text-center" style={{ color: 'var(--green-700)' }}>Process</p>
          <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-10 text-center" style={{ color: 'var(--text-primary)' }}>
            Insured in 4 simple steps
          </h2>
          <div className="relative grid md:grid-cols-4 gap-6">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px" style={{ backgroundColor: 'var(--border-default)' }} />
            {steps.map((step, i) => (
              <motion.div key={step.n}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 relative z-10"
                  style={{ backgroundColor: i === 3 ? 'var(--motor-600)' : 'var(--motor-50)', border: '2px solid', borderColor: i === 3 ? 'var(--motor-600)' : 'var(--motor-100, #BFDBFE)' }}>
                  {step.icon}
                </div>
                <span className="font-sans font-bold text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--motor-600)' }}>Step {step.n}</span>
                <h3 className="font-display font-bold text-[16px] mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/quote/motor"
              className="inline-flex items-center h-[54px] px-9 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-sans font-semibold text-base transition-all hover:-translate-y-px hover:shadow-lg">
              Get insured now →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why ShopInsurance ── */}
      <section className="py-16 px-5 lg:px-20" style={{ backgroundColor: 'var(--surface-raised)' }}>
        <div className="max-w-[1280px] mx-auto">
          <p className="font-sans font-bold text-[11px] uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--green-700)' }}>Why us</p>
          <h2 className="font-display font-extrabold text-[32px] tracking-tight mb-8" style={{ color: 'var(--text-primary)' }}>
            Why ShopInsurance for motor cover?
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
      <section className="py-14 px-5 lg:px-20 text-center" style={{ backgroundColor: 'var(--motor-600)' }}>
        <div className="max-w-[1280px] mx-auto">
          <h2 className="font-display font-extrabold text-[36px] text-white tracking-tight mb-2">Protect your vehicle today</h2>
          <p className="font-sans text-base mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Join 50,000+ Nigerians who trust ShopInsurance for their motor cover.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/quote/motor"
              className="inline-flex items-center h-12 px-7 bg-white rounded-xl font-sans font-bold text-[15px] transition-all hover:bg-white/90"
              style={{ color: 'var(--motor-600)' }}>
              Get your quote now →
            </Link>
            <a href="https://wa.me/2348001234567"
              className="inline-flex items-center gap-2 h-12 px-7 border-2 border-white/40 rounded-xl font-sans font-semibold text-[15px] text-white/90 transition-all hover:border-white hover:text-white">
              <PhoneCall className="w-4 h-4" /> Speak to an agent
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
