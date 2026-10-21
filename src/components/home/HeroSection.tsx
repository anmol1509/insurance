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
  return (
    <section className="relative overflow-hidden pt-12 pb-14 lg:pt-16 lg:pb-20" style={{ background: `linear-gradient(110deg, #f7fcf9 0%, ${hero.wash} 100%)` }}>
      <div className="max-w-[1320px] mx-auto px-5 lg:px-12 relative">
        <div className="grid lg:grid-cols-[53%_47%] gap-8 lg:gap-4 items-center">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide bg-white/80 border border-emerald-100 text-emerald-800"><ShieldCheck className="w-4 h-4" /> {hero.eyebrow}</span>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.24}}>
                <h1 className="mt-6 mb-4 font-display font-extrabold tracking-[-0.045em] leading-[1.05] text-[clamp(38px,4.4vw,66px)] text-slate-950">{hero.title}<br/><span style={{color:hero.accent}}>{hero.highlight}</span></h1>
                <p className="max-w-[525px] mb-8 text-base lg:text-lg leading-relaxed text-slate-600">{hero.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="hidden lg:flex min-h-[315px] items-center justify-center relative" aria-hidden="true">
            <div className="absolute w-[370px] h-[370px] rounded-full opacity-60" style={{background:hero.wash,border:'32px solid rgba(255,255,255,.45)'}} />
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{opacity:0,x:25,scale:.95}} animate={{opacity:1,x:0,scale:1}} exit={{opacity:0,x:-15}} transition={{duration:.3}} className="relative w-full flex flex-col items-center justify-center">
                {hero.image ? <img src={hero.image} alt={hero.imageAlt} className="max-h-[310px] w-full object-contain drop-shadow-2xl" /> : <div className="relative w-[300px] h-[245px] rounded-[40px] bg-white/75 shadow-xl flex items-center justify-center border border-white">
                  {activeTab==='medical' ? <Heart className="w-32 h-32 text-blue-500" strokeWidth={1.1}/> : activeTab==='travel' ? <Plane className="w-32 h-32 text-amber-500" strokeWidth={1.1}/> : <Building2 className="w-32 h-32 text-violet-500" strokeWidth={1.1}/>}
                </div>}
                <div className="absolute right-0 top-2 bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-3 flex items-center gap-3 text-sm font-semibold text-slate-800"><ShieldCheck className="w-5 h-5" style={{color:hero.accent}}/> {hero.benefit}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="relative z-20 mt-2 lg:-mt-7 max-w-[950px] rounded-[26px] bg-white border border-slate-200 shadow-[0_22px_65px_rgba(15,61,42,.12)] p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6" role="tablist" aria-label="Insurance type">
            {TABS.map(t=>{const Icon=t.icon;return <button key={t.key} type="button" role="tab" aria-selected={activeTab===t.key} onClick={()=>setActiveTab(t.key)} className="rounded-xl flex items-center justify-center gap-2 px-3 py-3 text-sm font-semibold transition-colors border" style={{background:activeTab===t.key?t.bg:'#fff',color:activeTab===t.key?t.color:'#526175',borderColor:activeTab===t.key?t.color:'#e5e7eb'}}><Icon className="w-4 h-4"/>{t.label}</button>})}
          </div>
          <div className="flex flex-wrap justify-between items-start gap-3 mb-4"><div><h2 className="text-xl font-bold text-slate-900">Get a {activeTab==='motor'?'car':activeTab==='medical'?'health':activeTab} insurance quote</h2><p className="text-sm text-slate-500 mt-1">A few details are all you need to get started.</p></div><Link href="/login" className="text-xs text-emerald-800 underline underline-offset-4">Retrieve saved quote</Link></div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              {activeTab==='motor' ? <input aria-label="Car registration number" placeholder="Enter car number (e.g. LAG 123 AB) — optional" value={plateNum} onChange={e=>setPlateNum(e.target.value.toUpperCase())} onKeyDown={e=>e.key==='Enter'&&startQuote('motor',plateNum)} className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-900 outline-none focus:border-emerald-600"/> : <select aria-label="Quote details" value={activeTab==='medical'?coverFor:activeTab==='travel'?destination:businessType} onChange={e=>activeTab==='medical'?setCoverFor(e.target.value):activeTab==='travel'?setDestination(e.target.value):setBusinessType(e.target.value)} className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm text-slate-900 bg-white focus:border-emerald-600"><option value="">{activeTab==='medical'?'Who needs cover?':activeTab==='travel'?'Where are you travelling?':'What type of business?'}</option>{activeTab==='medical'?MEDICAL_COVER_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>):activeTab==='travel'?TRAVEL_DESTINATIONS.map(d=><option key={d.value} value={d.value}>{d.label}</option>):BUSINESS_TYPES.map(b=><option key={b} value={b}>{b}</option>)}</select>}
            </div>
            <button type="button" onClick={()=>startQuote(activeTab,activeTab==='motor'?plateNum:activeTab==='medical'?coverFor:activeTab==='travel'?destination:businessType)} className="h-12 sm:px-8 px-6 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:brightness-110 transition-all" style={{background:'#07834b'}}>Get Quotes <ArrowRight className="w-4 h-4"/></button>
          </div>
          {activeTab==='motor'&&<button type="button" onClick={()=>startQuote('motor',NEW_CAR_PREFILL)} className="mt-3 text-sm font-semibold text-emerald-800 underline underline-offset-2">Brand-new car without a plate? Start here</button>}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-xs text-slate-500">{['Instant quotes','Compare trusted insurers','Secure & confidential'].map(x=><span key={x} className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600"/>{x}</span>)}</div>
        </div>
        <p className="flex gap-2 items-center text-xs text-slate-600 mt-5"><Sparkles className="w-4 h-4 text-emerald-600"/> Simple insurance. Clear choices. A more confident tomorrow.</p>
      </div>
    </section>
  )}
