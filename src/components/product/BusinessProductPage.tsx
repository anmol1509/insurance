'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Flame, ShieldCheck, Users, Briefcase, HeartHandshake, FileCheck, Check, Headphones, SlidersHorizontal, Zap, FileText, CreditCard, ChartNoAxesCombined, ShoppingCart, Utensils, HardHat, Laptop, ArrowRight, PhoneCall } from 'lucide-react'
import { useQuoteStore } from '@/store/quoteStore'
import { calculateBusinessPremium } from '@/lib/premiumCalculator'
import { LandingButton as CTA, LandingHeading as Heading, CoverageGrid, LandingProcess, LandingReasons, LandingFAQ } from './LandingSections'
import base from './motorLanding.module.css'
import s from './travelBusinessLanding.module.css'

const coverage=[
  {icon:Flame,title:'Fire & Special Perils',text:'Protection against fire and eligible allied perils affecting your business property.'},
  {icon:ShieldCheck,title:'Burglary & Theft',text:'Cover for eligible break-ins and theft of insured stock or valuables.'},
  {icon:Users,title:'Employee Health Cover',text:'Explore medical cover for your team. Contact us about group options.'},
  {icon:Briefcase,title:'Third Party Liability',text:'Discuss cover for your business’s liability to clients and visitors.'},
  {icon:HeartHandshake,title:'Group Personal Accident',text:'Explore employee accident benefits, subject to the chosen policy.'},
  {icon:FileCheck,title:'Business Interruption',text:'Ask about protection for eligible losses when an insured event disrupts operations.'},
]
const options=[
  {id:'fire_perils',label:'Fire & Special Perils',sub:'Fire and eligible allied perils'},
  {id:'burglary',label:'Burglary & Theft',sub:'Break-in, stock and valuables'},
  {id:'householders',label:'Householder’s Comprehensive',sub:'Building, contents and personal effects'},
  {id:'gpa',label:'Group Personal Accident',sub:'Employee accident benefits'},
]
const industries=[
  {icon:ShoppingCart,name:'Retail / Supermarket',type:'Retail / Trading',tags:['Stock & property','Burglary','Employee accident']},
  {icon:Utensils,name:'Restaurant / Food',type:'Food & Hospitality',tags:['Premises','Kitchen equipment','Business needs']},
  {icon:HardHat,name:'Construction / Site',type:'Construction',tags:['Site risks','Plant & machinery','Employee accident']},
  {icon:Laptop,name:'Tech / Office',type:'Technology',tags:['Office equipment','Business property','Team protection']},
]
const faqs=[
  {q:'Which insurance does my business need?',a:'Your needs depend on the type of business, premises, employees and activities. Start with the risks you want to cover, then confirm any legal or contractual requirements with an appropriate adviser and your insurer.'},
  {q:'Can I deduct business insurance premiums from company tax?',a:'Tax treatment depends on your circumstances and applicable rules. Ask your accountant or tax adviser to confirm how premiums should be treated for your business.'},
  {q:'What is the difference between fire insurance and fire & special perils?',a:'Fire cover addresses insured fire losses. Fire and special perils may extend protection to additional events named in the policy. Check the schedule, exclusions and limits before purchasing.'},
  {q:'How is the insured value determined for my property?',a:'Use the valuation basis required by your insurer, which may be reinstatement or replacement cost. Provide accurate values for buildings, contents and stock, and ask for professional valuation advice where needed.'},
  {q:'Does cover extend to employees working remotely or off-site?',a:'It depends on the policy and declared locations or activities. Tell the insurer about remote work and off-site operations so the appropriate cover and territorial limits can be confirmed.'},
  {q:'How long does it take to issue a business insurance certificate?',a:'Timing depends on the insurer, the type of cover, underwriting and completion of payment and required documents. Wait for confirmation that the policy has been issued before relying on cover.'},
]
const money=(value:number)=>`₦${value.toLocaleString('en-NG',{maximumFractionDigits:0})}`
export default function BusinessProductPage(){
  const data=useQuoteStore(state=>state.businessData)
  const [selected,setSelected]=useState(['fire_perils','burglary'])
  const [monthly,setMonthly]=useState(false)
  const estimate=(items:string[])=>calculateBusinessPremium({...data,coverageItems:items}).total
  const total=estimate(selected)
  const quote=`/quote/business?covers=${selected.join(',')}`
  return <div className={`${base.page} ${s.page} ${s.business}`}>
    <section className={s.hero}><Image src="/business/building.webp" alt="Modern glass-fronted business premises on a landscaped street" fill priority sizes="100vw"/><div className={s.heroShade}/><div className={`${base.container} ${s.heroInner}`}><div className={s.heroCopy}><span className={s.tag}>Business insurance</span><h1>Protect what you<br/>built <em>from scratch.</em></h1><p>Fire, burglary, property and employee protection. Build cover around the business you’ve worked hard to grow.</p><div className={base.ticks}><span><ShieldCheck size={17}/>Choose your covers</span><span><SlidersHorizontal size={17}/>Customise your quote</span><span><Headphones size={17}/>Helpful support</span></div><CTA href="/quote/business">Get business quote</CTA><small>Cover shaped around your business and its needs.</small></div><div className={s.heroBadges}>{coverage.slice(0,4).map(x=><div key={x.title}><x.icon/><strong>{x.title}</strong></div>)}</div></div></section>
    <section className={base.mint} id="business-covers"><div className={base.container}><Heading label="Coverage">What’s covered</Heading><CoverageGrid items={coverage}/></div></section>
    <section><div className={`${base.container} ${s.twoColumn}`}><div><Heading label="Basics">What is business insurance?</Heading><p>Business insurance helps protect your company’s assets, employees and liability against insured events, such as fire, theft and accidents.</p><p>Choose protection that reflects your industry, premises and people. Each policy has its own benefits, limits and exclusions.</p><div className={s.notice}><Briefcase size={23}/><p><strong>Built around your business</strong><br/>Start with the covers you need. Your insurer will confirm eligibility, required details and final terms.</p></div><ul className={base.checkList}>{['Protect eligible business property and stock','Explore accident cover for your employees','Review policy conditions before you buy','Get help choosing the appropriate protection'].map(t=><li key={t}><Check size={16}/>{t}</li>)}</ul></div><div className={s.industries}>{industries.map(x=><Link href={`/quote/business?industry=${encodeURIComponent(x.type)}`} key={x.name}><x.icon size={31}/><span><strong>{x.name}</strong><span className={s.industryTags}>{x.tags.map(t=><small key={t}>{t}</small>)}</span></span><ArrowRight size={15}/></Link>)}</div></div></section>
    <section className={base.mint}><div className={base.container}><div className={s.sectionHead}><div><Heading label="Build your policy">Custom cover, instant estimate</Heading><p>Select your covers to see an illustrative estimate.</p></div><div className={s.tabs} aria-label="Estimate display"><button type="button" aria-pressed={!monthly} className={!monthly?s.active:''} onClick={()=>setMonthly(false)}>Annual</button><button type="button" aria-pressed={monthly} className={monthly?s.active:''} onClick={()=>setMonthly(true)}>Monthly equivalent</button></div></div><div className={s.builder}><div><div className={s.coverOptions}>{options.map(x=><label className={selected.includes(x.id)?s.selected:''} key={x.id}><input type="checkbox" checked={selected.includes(x.id)} onChange={()=>setSelected(prev=>prev.includes(x.id)?prev.filter(id=>id!==x.id):[...prev,x.id])}/><span><strong>{x.label}</strong><small>{x.sub}</small></span><b>{money(monthly?estimate([x.id])/12:estimate([x.id]))}<small>/{monthly?'mo':'yr'}</small></b></label>)}</div><p className={s.caption}>Need liability, employee health or business interruption cover? <Link href="/contact">Speak to a specialist →</Link></p></div><aside className={s.estimate}><p>Your illustrative estimate</p><strong aria-live="polite">{money(monthly?total/12:total)}<small>/{monthly?'mo':'yr'}</small></strong><p className={s.caption}>{monthly?'Annual estimate divided by 12 for comparison; this is not an instalment payment offer.':'Based on the existing quote calculator. This is not a binding insurer price.'}</p><ul className={base.checkList}>{['Your chosen covers carried into the quote','Review sums insured and business details','Confirm final terms before purchase'].map(t=><li key={t}><Check size={16}/>{t}</li>)}</ul>{selected.length?<CTA href={quote}>Get full quote</CTA>:<button className={s.disabled} type="button" disabled>Select a cover to continue</button>}<Link href="/contact" className={s.specialist}><Headphones size={15}/>Speak to a specialist</Link></aside></div></div></section>
    <LandingProcess href="/quote/business" action="Get business insurance now" items={[{icon:FileText,title:'Describe your business',text:'Industry, location, employees and assets.'},{icon:ChartNoAxesCombined,title:'Review your cover',text:'Choose protection and provide the required details.'},{icon:CreditCard,title:'Review & pay',text:'Confirm the terms before proceeding to payment.'},{icon:FileCheck,title:'Get your certificate',text:'Your insurer confirms issuance after processing.'}]}/>
    <LandingReasons title="Why ShopInsurance for business cover?" items={[{icon:Zap,title:'A simpler journey',text:'Start your business quote and review options online.'},{icon:SlidersHorizontal,title:'Custom cover choices',text:'Select the protections that match your business needs.'},{icon:Headphones,title:'Helpful support',text:'Get guidance with your quote and claims questions.'},{icon:FileCheck,title:'Clear policy details',text:'Review requirements, limits and exclusions before buying.'}]}/>
    <LandingFAQ product="business" items={faqs}/>
    <section className={s.businessCta}><div className={`${base.container} ${s.sectionHead}`}><div><p className={base.eyebrow}>Protect your business</p><h2>Secure your business today.</h2><p>Explore cover for your business, big or small.</p></div><div className={base.ctaActions}><CTA href="/quote/business" light>Get business quote now</CTA><Link href="/contact" className={base.outline}><PhoneCall size={16}/>Talk to a specialist</Link></div></div></section>
  </div>
}
