'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Plus, Minus, type LucideIcon } from 'lucide-react'
import base from './motorLanding.module.css'
import s from './travelBusinessLanding.module.css'

export function LandingButton({ children, href, light = false }: { children: React.ReactNode; href: string; light?: boolean }) {
  return <Link href={href} className={`${base.button} ${light ? base.light : ''}`}>{children}<ArrowRight size={16}/></Link>
}
export function LandingHeading({ label, children }: { label: string; children: React.ReactNode }) {
  return <><p className={base.eyebrow}>{label}</p><h2>{children}</h2></>
}
export function CoverageGrid({ items }: { items: { icon: LucideIcon; title: string; text: string }[] }) {
  return <div className={s.coverage}>{items.map((x,i)=><article key={x.title}><span className={`${s.icon} ${s['tone'+i]}`}><x.icon size={26}/></span><h3>{x.title}</h3><p>{x.text}</p></article>)}</div>
}
export function LandingProcess({ items, href, action }: { items: { icon: LucideIcon; title: string; text: string }[]; href: string; action: string }) {
  return <section className={base.process}><div className={base.container}><LandingHeading label="Process">Covered in 4 simple steps</LandingHeading><div className={base.steps}>{items.map((x,i)=><div key={x.title}><span className={base.stepIcon}><x.icon size={28}/></span><small className={s.stepNumber}>STEP {String(i+1).padStart(2,'0')}</small><h3>{x.title}</h3><p>{x.text}</p></div>)}</div><LandingButton href={href}>{action}</LandingButton></div></section>
}
export function LandingReasons({ title, items }: { title: string; items: { icon: LucideIcon; title: string; text: string }[] }) {
  return <section className={base.mint}><div className={base.container}><LandingHeading label="Why ShopInsurance">{title}</LandingHeading><div className={base.fourGrid}>{items.map(x=><article className={base.reason} key={x.title}><x.icon size={29}/><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></div></section>
}
export function LandingFAQ({ product, items }: { product: string; items: { q: string; a: string }[] }) {
  const [open,setOpen]=useState<number|null>(0)
  return <section><div className={`${base.container} ${base.faq}`}><div><LandingHeading label="FAQ">Common questions<br/>answered</LandingHeading><p>Can’t find your answer? Our team can help you understand your cover.</p><LandingButton href="/contact">Speak to our team</LandingButton></div><div>{items.map((x,i)=><div className={base.faqItem} key={x.q}><button type="button" aria-expanded={open===i} aria-controls={`${product}-faq-${i}`} onClick={()=>setOpen(open===i?null:i)}>{x.q}{open===i?<Minus size={17}/>:<Plus size={17}/>}</button><div id={`${product}-faq-${i}`} hidden={open!==i}><p>{x.a}</p></div></div>)}</div></div></section>
}
