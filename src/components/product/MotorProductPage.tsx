'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShieldCheck, Zap, Check, Car, Flame, Users, CloudRain, FileCheck2, Headphones, SlidersHorizontal, CreditCard, PhoneCall, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import s from './motorLanding.module.css'

const coverage = [
  { title: 'Accidental damage', text: 'Protection for your vehicle against collision, impact or rollover, subject to your policy.', icon: Car },
  { title: 'Theft & fire', text: 'Cover for vehicle theft and fire damage under eligible policies.', icon: Flame },
  { title: 'Third party liability', text: 'Cover for liability to others — bodily injury and property damage.', icon: Users },
  { title: 'Floods & natural perils', text: 'Additional protection against natural perils where included by your insurer.', icon: CloudRain },
]
const covers = [
  { title: 'Comprehensive', sub: 'Protection for your car and others', benefits: ['Own damage, subject to policy terms', 'Third-party injury & property', 'Theft and fire cover', 'Optional extras vary by insurer'], cta: 'Get Comprehensive quote', href: '/quote/motor' },
  { title: 'Third Party Fire & Theft', sub: 'Liability, fire and theft protection', benefits: ['Third-party bodily injury', 'Third-party property damage', 'Fire damage to your vehicle', 'Theft of your vehicle'], cta: 'Enquire about TPF&T', href: '/contact' },
  { title: 'Third Party Only', sub: 'Cover for your liability to others', benefits: ['Third-party bodily injury', 'Third-party property damage', 'Own vehicle damage is not covered'], cta: 'Get Third Party quote', href: '/quote/motor' },
]
const process = [
  { icon: Car, title: 'Enter vehicle details', text: 'Registration number or make, model, year and cover type.' },
  { icon: SlidersHorizontal, title: 'Compare available quotes', text: 'Review prices and policy benefits from available insurers.' },
  { icon: CreditCard, title: 'Review & pay', text: 'Check your documents and details before proceeding to payment.' },
  { icon: FileCheck2, title: 'Receive your certificate', text: 'Your insurer issues your certificate after successful processing.' },
]
const reasons = [
  { icon: Zap, title: 'A simpler online journey', text: 'Enter your details and compare cover in one place.' },
  { icon: ShieldCheck, title: 'Compare insurer options', text: 'See available policies and find the right fit for your vehicle.' },
  { icon: Headphones, title: 'Claims assistance', text: 'Find support and guidance when you need to make a claim.' },
  { icon: FileCheck2, title: 'Clear policy details', text: 'Review benefits, exclusions and requirements before you choose.' },
]
const faqs = [
  { q: 'Which motor insurance cover should I choose?', a: 'Compare the protection you need for your own vehicle and your liability to other people. Comprehensive, Third Party Fire & Theft, and Third Party Only offer different levels of protection. Availability, limits and exclusions depend on the insurer.' },
  { q: 'What is the difference between Comprehensive and Third Party Fire & Theft (TPF&T)?', a: 'Comprehensive generally includes accidental damage to your own vehicle as well as fire, theft and third-party liability. TPF&T generally excludes accidental damage to your own vehicle. Always review the specific policy terms.' },
  { q: 'How is my motor premium calculated?', a: 'Your quote depends on the insurer, cover type and vehicle information, including value and use. Enter your details to see the prices available for your vehicle.' },
  { q: 'Can I insure a car that is not in my name?', a: 'Eligibility depends on your interest in the vehicle and the insurer’s requirements. Contact us before proceeding so the ownership details can be checked.' },
  { q: 'What documents do I need to file a motor insurance claim?', a: 'Requirements vary by insurer and incident. They may include your policy information, vehicle documents, photographs and an incident or police report. Contact the claims team for the list that applies to you.' },
  { q: 'How long does it take to get my insurance certificate?', a: 'Timing depends on the insurer, payment confirmation and completion of required documents. A submitted quote is not a policy; wait for confirmation of issuance from your insurer.' },
]
function CTA({ children = 'Get motor quote', href = '/quote/motor', light = false }: { children?: React.ReactNode; href?: string; light?: boolean }) {
  return <Link href={href} className={`${s.button} ${light ? s.light : ''}`}>{children}<ArrowRight size={16}/></Link>
}
function Heading({ label, children }: { label: string; children: React.ReactNode }) {
  return <><p className={s.eyebrow}>{label}</p><h2>{children}</h2></>
}
export default function MotorProductPage() {
  const [open, setOpen] = useState<number | null>(0)
  return <div className={s.page}>
    <section className={s.hero}>
      <Image src="/motor/city-suv.webp" alt="White SUV on a sunny city boulevard" fill priority sizes="100vw" className={s.heroImage}/>
      <div className={s.heroShade}/>
      <div className={`${s.container} ${s.heroInner}`}>
        <div className={s.heroCopy}><span className={s.tag}>Motor insurance</span><h1>Drive with full<br/>confidence.</h1><p>Find motor cover that fits your life.<br/>Compare protection for your vehicle and manage your insurance online.</p>
          <div className={s.ticks}>{['Compare cover', 'Online quotes', 'Claims assistance'].map(x => <span key={x}><ShieldCheck size={15}/>{x}</span>)}</div>
          <CTA/><small>Choose your cover. Review your quote. Drive with confidence.</small>
        </div>
        <div className={`${s.badge} ${s.coverBadge}`}><ShieldCheck/><span>Protection for<br/><strong>the road ahead</strong></span></div>
        <div className={`${s.badge} ${s.claimBadge}`}><Zap/><span>Simple online<br/><strong>quote process</strong></span></div>
        <div className={`${s.badge} ${s.compareBadge}`}><span className={s.dots}><i>A</i><i>N</i><i>T</i></span><strong>Compare insurer options</strong></div>
      </div>
    </section>
    <section className={s.mint}><div className={s.container}><Heading label="What’s covered">Full protection, every road</Heading><div className={s.fourGrid}>{coverage.map((item,i)=><article className={s.photoCard} key={item.title}><div className={s.coverPhoto} role="img" aria-label={item.title} style={{backgroundPosition:`${i*100/3}% center`}}/><div className={s.coverBody}><span className={`${s.icon} ${s['tone'+i]}`}><item.icon size={24}/></span><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></div></section>
    <section><div className={`${s.container} ${s.basics}`}><div><Heading label="Basics">What is motor insurance?</Heading><p>Motor insurance is a contract between you and an insurer that helps protect you from financial loss involving your vehicle, according to the cover you choose.</p><ul className={s.checkList}>{['Protection against eligible repair costs','Cover for liability to other road users','Options for comprehensive or third-party cover','Clear policy benefits, limits and exclusions'].map(x=><li key={x}><Check size={16}/>{x}</li>)}</ul></div><div className={s.highlights}>{[{icon:FileCheck2,title:'Your cover',text:'Compare policy benefits'},{icon:ShieldCheck,title:'Your choice',text:'Review insurer options'},{icon:Zap,title:'Online',text:'A straightforward quote journey'},{icon:SlidersHorizontal,title:'Clear terms',text:'Understand what is included'}].map((x,i)=><div className={s['tone'+i]} key={x.title}><x.icon size={32}/><span><strong>{x.title}</strong><small>{x.text}</small></span></div>)}</div></div></section>
    <section className={s.mint}><div className={s.container}><Heading label="Cover types">Comprehensive vs TPF&amp;T vs Third Party</Heading><p className={s.sectionSub}>Choose the right level of protection for your vehicle and budget.</p><div className={s.threeGrid}>{covers.map((c,i)=><article key={c.title} className={`${s.coverCard} ${i===0?s.featured:''}`}><h3>{c.title}</h3><p className={s.coverSub}>{c.sub}</p><ul className={s.checkList}>{c.benefits.map(b=><li key={b}><Check size={15}/>{b}</li>)}</ul><CTA href={c.href}>{c.cta}</CTA></article>)}</div></div></section>
    <section className={s.process}><div className={s.container}><Heading label="Process">Insured in 4 simple steps</Heading><div className={s.steps}>{process.map((x,i)=><div key={x.title}><span className={s.stepIcon}><x.icon size={28}/></span><h3>{i+1}. {x.title}</h3><p>{x.text}</p></div>)}</div><CTA>Get insured now</CTA></div></section>
    <section className={s.mint}><div className={s.container}><Heading label="Why ShopInsurance">Why choose us for motor cover?</Heading><div className={s.fourGrid}>{reasons.map(x=><article className={s.reason} key={x.title}><x.icon size={30}/><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></div></section>
    <section><div className={`${s.container} ${s.faq}`}><div><Heading label="FAQ">Common questions<br/>answered</Heading><p>Can’t find your answer? Our team can help you with your motor cover.</p><CTA href="/contact">Speak to our team</CTA></div><div>{faqs.map((x,i)=><div className={s.faqItem} key={x.q}><button type="button" aria-expanded={open===i} aria-controls={`motor-faq-${i}`} onClick={()=>setOpen(open===i?null:i)}>{x.q}{open===i?<Minus size={17}/>:<Plus size={17}/>}</button><div id={`motor-faq-${i}`} hidden={open!==i}><p>{x.a}</p></div></div>)}</div></div></section>
    <section className={s.finalCta}><Image src="/motor/city-suv.webp" alt="White SUV on an open city road" fill sizes="100vw"/><div className={s.ctaShade}/><div className={s.container}><h2>Protect your vehicle today</h2><p>Find the right motor cover for your next journey.</p><div className={s.ctaActions}><CTA light>Get your quote now</CTA><Link href="/contact" className={s.outline}><PhoneCall size={16}/>Speak to an agent</Link></div></div></section>
  </div>
}
