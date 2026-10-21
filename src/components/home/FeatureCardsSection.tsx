import Link from 'next/link'
import { Search, Tag, Zap, Headphones, ArrowRight, ShieldCheck } from 'lucide-react'

const benefits = [
  { icon: Search, title: 'Compare easily', description: 'Get quotes from multiple insurers in one place.' },
  { icon: Tag, title: 'Best prices', description: 'Compare cover and costs with transparent pricing.' },
  { icon: Zap, title: '100% online', description: 'Buy, renew and manage your policy digitally.' },
  { icon: Headphones, title: 'Dedicated support', description: 'Helpful people when you need them.' },
]

export default function FeatureCardsSection() {
  return <section className="bg-white border-b border-slate-100" aria-label="Why choose ShopInsurance">
    <div className="max-w-[1280px] mx-auto px-5 lg:px-12 py-10 lg:py-12 grid grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-0">
      {benefits.map(({icon:Icon,title,description},i)=><div key={title} className={`flex flex-col sm:flex-row gap-3 lg:gap-4 lg:px-6 ${i>0?'lg:border-l lg:border-slate-100':''}`}>
        <span className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center"><Icon className="w-5 h-5"/></span>
        <div><h3 className="font-bold text-slate-900 text-sm mb-1">{title}</h3><p className="text-slate-500 text-xs leading-relaxed">{description}</p></div>
      </div>)}
    </div>
    <div className="sr-only"><Link href="/renewals">Renew your policy <ArrowRight/></Link><ShieldCheck/></div>
  </section>
}
