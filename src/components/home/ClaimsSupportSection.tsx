import Link from 'next/link'
import { ArrowRight, CheckCircle2, Headphones, ShieldCheck } from 'lucide-react'

export default function ClaimsSupportSection() {
  return <section className="bg-white py-16 lg:py-24 overflow-hidden" aria-labelledby="claims-heading">
    <div className="max-w-[1280px] mx-auto px-5 lg:px-20 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className="relative rounded-[32px] min-h-[300px] lg:min-h-[390px] bg-gradient-to-br from-emerald-50 via-[#e4f6ee] to-slate-100 flex items-center justify-center overflow-hidden">
        <div className="absolute w-64 h-64 rounded-full border-[35px] border-white/50 top-[-50px] left-[-50px]" />
        <div className="relative w-48 h-60 bg-slate-900 rounded-[32px] border-[8px] border-slate-900 shadow-2xl p-3 flex flex-col gap-4 rotate-[-6deg]">
          <div className="h-full bg-white rounded-[22px] p-4 flex flex-col items-center justify-center gap-3 text-center">
            <span className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center"><CheckCircle2 className="w-8 h-8 text-emerald-700" /></span>
            <p className="text-slate-900 font-bold text-sm">Your claims, simplified.</p>
            <p className="text-slate-500 text-[11px]">Guidance and support throughout the process.</p>
            <span className="w-full rounded-lg bg-emerald-700 text-white text-[11px] py-2 font-semibold">View claims</span>
          </div>
        </div>
        <div className="absolute right-4 bottom-8 lg:right-8 bg-white shadow-xl rounded-2xl px-4 py-3 flex items-center gap-3"><ShieldCheck className="w-7 h-7 text-emerald-600" /><div><p className="text-xs font-bold text-slate-900">We're here to help</p><p className="text-[11px] text-slate-500">Support when you need it</p></div></div>
      </div>
      <div><p className="text-xs tracking-[.16em] font-bold uppercase text-emerald-700 mb-3">Stress-free claims</p><h2 id="claims-heading" className="font-display font-extrabold text-4xl lg:text-5xl tracking-tight leading-tight text-slate-950 mb-5">Need to make a claim?</h2><p className="text-slate-600 text-base leading-relaxed max-w-lg mb-7">Accidents and unexpected events are stressful enough. Find guidance on the claims process and get help with the next step.</p><div className="flex flex-wrap gap-3 mb-8"><Link href="/claims" className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 transition-colors text-white px-6 py-3 font-semibold">Start a claim <ArrowRight className="w-4 h-4"/></Link><Link href="/contact" className="inline-flex items-center rounded-xl border border-slate-200 text-slate-700 px-6 py-3 font-semibold">Talk to support</Link></div><div className="grid sm:grid-cols-3 gap-4 text-xs font-medium text-slate-600"><span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-700"/>Clear guidance</span><span className="flex items-center gap-2"><Headphones className="w-4 h-4 text-emerald-700"/>Helpful support</span><span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-700"/>Simple next steps</span></div></div>
    </div>
  </section>
}
