'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuoteStore } from '@/store/quoteStore'
import { BUSINESS_TYPES, MEDICAL_COVER_OPTIONS, TRAVEL_DESTINATIONS } from '@/lib/constants'
import { NEW_CAR_PREFILL } from '@/lib/motorRegistration'
import { ArrowRight, Car, Heart, Plane, Building2, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'

const TABS = [
  { key: 'motor',    label: 'Motor',    icon: Car,       color: 'var(--motor-600)',    bg: 'var(--motor-50)',    href: '/quote/motor'    },
  { key: 'medical',  label: 'Medical',  icon: Heart,     color: 'var(--medical-600)',  bg: 'var(--medical-50)',  href: '/quote/medical'  },
  { key: 'travel',   label: 'Travel',   icon: Plane,     color: 'var(--travel-600)',   bg: 'var(--travel-50)',   href: '/quote/travel'   },
  { key: 'business', label: 'Business', icon: Building2, color: 'var(--business-600)', bg: 'var(--business-50)', href: '/quote/business' },
] as const

type TabKey = 'motor' | 'medical' | 'travel' | 'business'


const HERO_COPY: Record<TabKey, { eyebrow: string; title: string; highlight: string; description: string; image: string; imageAlt: string; accent: string; wash: string; benefit: string }> = {
  motor: { eyebrow: 'Drive with peace of mind', title: 'Drive with complete', highlight: 'confidence.', description: 'Compare motor insurance from trusted insurers and get the coverage that fits your car.', image: '/home/motor-hero.svg', imageAlt: 'White car with green city illustration', accent: '#087a47', wash: '#eaf8ef', benefit: 'Protection for every journey' },
  medical: { eyebrow: 'Care that puts you first', title: 'Better health.', highlight: 'Brighter tomorrows.', description: 'Find medical cover for yourself and the people who matter most.', image: '/home/medical-hero.svg', imageAlt: '', accent: '#1765c1', wash: '#eaf4ff', benefit: 'Care when it matters most' },
  travel: { eyebrow: 'Go further with confidence', title: 'Explore the world.', highlight: 'Worry-free.', description: 'Compare travel policies for your next adventure, with support wherever you go.', image: '/home/travel-hero.svg', imageAlt: '', accent: '#bc770c', wash: '#fff5e5', benefit: 'Cover beyond borders' },
  business: { eyebrow: 'Built for ambitious businesses', title: 'Protect what', highlight: 'you’ve built.', description: 'Find coverage for your premises, people and operations as your business grows.', image: '/home/business-hero.svg', imageAlt: '', accent: '#7041b8', wash: '#f3eeff', benefit: 'Your growth deserves protection' },
}

export default function HeroSection() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>('motor')
  const [plateNum,  setPlateNum]  = useState('')
  const [coverFor,  setCoverFor]  = useState('')
  const [destination, setDestination] = useState('')
  const [businessType, setBusinessType] = useState('')
  const setHeroPrefill = useQuoteStore((s) => s.setHeroPrefill)

  /**
   * Each tab asks exactly what step 1 of its flow asks, so hand the answer
   * over and let the flow open on step 2 instead of asking a second time.
   * Motor's plate still goes through the registry lookup on the way.
   */
  function startQuote(product: TabKey, value: string) {
    const answer = value.trim()
    setHeroPrefill(answer ? { product, value: answer } : null)
    router.push(`/quote/${product}`)
  }

  const hero = HERO_COPY[activeTab]
  const heroPhoto: Record<TabKey,string> = {
    motor: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85',
    medical: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=85',
    travel: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=85',
    business: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85',
  }
  return (
    <section className="relative isolate overflow-hidden bg-[#f4faf8] min-h-[590px] lg:min-h-[610px]">
      <div className="absolute inset-0 -z-20"><img src={heroPhoto[activeTab]} alt="" className="h-full w-full object-cover object-center" /></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f8fdfa] via-[#f8fdfa]/95 via-[43%] to-[#f8fdfa]/15" />
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 lg:pt-14 pb-12 relative">
        <div className="max-w-[620px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#d9f6e8] px-3 py-1.5 text-xs font-bold text-[#065f3d]"><ShieldCheck className="w-3.5 h-3.5"/> Nigeria’s trusted insurance partner</span>
          <AnimatePresence mode="wait"><motion.div key={activeTab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}}>
            <h1 className="mt-5 font-display text-[clamp(39px,4.1vw,61px)] font-extrabold leading-[1.04] tracking-[-.045em] text-[#071e30]">{activeTab==='motor'?<>Buy insurance with<br/>confidence.<br/><span className="text-[#076c44]">Claim stress free.</span></>:<>{hero.title}<br/><span style={{color:hero.accent}}>{hero.highlight}</span></>}</h1>
            <p className="mt-4 max-w-[465px] text-[15px] leading-relaxed text-slate-600">{activeTab==='motor'?'Compare plans from top insurers, get the best coverage and manage everything online — quickly, securely and without stress.':hero.description}</p>
          </motion.div></AnimatePresence>
        </div>
        <div className="mt-7 max-w-[705px] rounded-[20px] bg-white/95 shadow-[0_15px_50px_rgba(9,42,35,.16)] border border-white overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-100" role="tablist" aria-label="Insurance type">{TABS.map(t=>{const Icon=t.icon;return <button key={t.key} type="button" role="tab" aria-selected={activeTab===t.key} onClick={()=>setActiveTab(t.key)} className={`flex items-center justify-center gap-2 min-h-14 px-2 text-[13px] font-bold transition-colors ${activeTab===t.key?'bg-[#087c4b] text-white':'bg-white text-slate-700 hover:bg-emerald-50'}`}><Icon className="w-4 h-4"/><span>{t.label}</span></button>})}</div>
          <div className="px-5 sm:px-6 py-5">
            <div className="flex flex-wrap justify-between items-start gap-2 mb-3"><div><h2 className="text-base font-extrabold text-slate-900">Get a {activeTab==='motor'?'car':activeTab==='medical'?'health':activeTab} insurance quote</h2><p className="text-xs text-slate-500 mt-1">Enter your details to compare quotes from top insurers.</p></div><Link href="/login" className="text-xs font-semibold text-[#087c4b]">Retrieve saved quote ↗</Link></div>
            <div className="flex flex-col sm:flex-row gap-2">{activeTab==='motor'?<input aria-label="Car registration number" placeholder="Enter your car number (e.g. LNO 123 AB)" value={plateNum} onChange={e=>setPlateNum(e.target.value.toUpperCase())} onKeyDown={e=>e.key==='Enter'&&startQuote('motor',plateNum)} className="min-w-0 flex-1 h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-emerald-600"/>:<select aria-label="Quote details" value={activeTab==='medical'?coverFor:activeTab==='travel'?destination:businessType} onChange={e=>activeTab==='medical'?setCoverFor(e.target.value):activeTab==='travel'?setDestination(e.target.value):setBusinessType(e.target.value)} className="min-w-0 flex-1 h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900"><option value="">{activeTab==='medical'?'Who needs cover?':activeTab==='travel'?'Where are you travelling?':'What type of business?'}</option>{activeTab==='medical'?MEDICAL_COVER_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>):activeTab==='travel'?TRAVEL_DESTINATIONS.map(d=><option key={d.value} value={d.value}>{d.label}</option>):BUSINESS_TYPES.map(b=><option key={b} value={b}>{b}</option>)}</select>}
              <button type="button" onClick={()=>startQuote(activeTab,activeTab==='motor'?plateNum:activeTab==='medical'?coverFor:activeTab==='travel'?destination:businessType)} className="h-12 px-6 rounded-xl bg-[#07844d] hover:bg-[#056a3e] text-white text-sm font-bold flex items-center justify-center gap-2 shrink-0">Get Quotes <ArrowRight className="w-4 h-4"/></button></div>
            {activeTab==='motor'&&<button type="button" onClick={()=>startQuote('motor',NEW_CAR_PREFILL)} className="mt-2 text-xs text-emerald-800 underline underline-offset-2">Brand-new car without a plate? Start here</button>}
            <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-[11px] text-slate-500">{['Instant quotes','Top insurers','Secure & confidential'].map(x=><span key={x} className="inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-700"/>{x}</span>)}</div>
          </div>
        </div>
        <div className="hidden lg:flex absolute right-8 top-16 bg-white/95 rounded-xl shadow-lg px-4 py-3 gap-2 items-center text-xs font-bold text-slate-800"><ShieldCheck className="text-emerald-600 w-6 h-6"/> Comprehensive cover<br/>from trusted insurers</div>
        <div className="hidden lg:flex absolute right-10 bottom-16 bg-white/95 rounded-xl shadow-lg px-4 py-3 gap-2 items-center text-xs font-bold text-slate-800"><CheckCircle2 className="text-emerald-600 w-6 h-6"/> Quick & easy<br/>claims process</div>
      </div>
    </section>
  )
}
