'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Check, ShieldCheck, Heart, Stethoscope, Baby, BedDouble, Siren, Flower2, Users, Zap, Headphones, FileText, ChartNoAxesCombined, CreditCard, Plus, Minus, PhoneCall } from 'lucide-react'
import { MEDICAL_PLANS } from '@/lib/medicalPlans'
import base from './motorLanding.module.css'
import s from './medicalLanding.module.css'

const benefits = [
  { icon: BedDouble, title: 'Hospitalisation cover', text: 'Help with room charges, surgery and inpatient care, within your policy limits.' },
  { icon: Stethoscope, title: 'Outpatient medical treatment', text: 'Consultations, diagnostic tests and prescribed medicines on eligible plans.' },
  { icon: Baby, title: 'Maternity care', text: 'Explore antenatal, delivery and postnatal benefits, including waiting periods.' },
  { icon: Heart, title: 'Critical illness', text: 'Review the treatment and support available for serious medical conditions.' },
  { icon: Siren, title: 'Emergency treatment', text: 'Check emergency care benefits and the facilities available through your plan.' },
  { icon: Flower2, title: 'Wellness & preventive care', text: 'Explore routine check-ups, screening and preventive benefits where included.' },
]
const steps = [
  { icon: FileText, title: 'Enter your details', text: 'Share basic information about you and the people you want to cover.' },
  { icon: ChartNoAxesCombined, title: 'Compare your options', text: 'Review premiums, hospital networks and policy benefits.' },
  { icon: CreditCard, title: 'Review & pay', text: 'Confirm your details and policy terms before proceeding to payment.' },
  { icon: ShieldCheck, title: 'Receive your policy', text: 'Your insurer confirms cover once your application is processed.' },
]
const reasons = [
  { icon: ShieldCheck, title: 'Compare insurers', text: 'Review health plan options together in one place.' },
  { icon: Zap, title: 'Simple & convenient', text: 'Start your quote online, at a time that works for you.' },
  { icon: Users, title: 'Cover for your needs', text: 'Explore individual, family and group cover options.' },
  { icon: Headphones, title: 'Dedicated support', text: 'Get help understanding your options and next steps.' },
]
const faqs = [
  { q: 'What does a health insurance plan cover?', a: 'Benefits vary by plan. They may include hospitalisation, consultations, diagnostic tests and prescribed medicines. Maternity, preventive care and other benefits have their own limits, exclusions and waiting periods.' },
  { q: 'Can I add my family members to my plan?', a: 'Choose who you want to cover when starting your quote. Eligibility, dependant limits and premiums depend on the insurer and plan you select.' },
  { q: 'What hospitals are covered under the plan?', a: 'Each provider has its own hospital network. Confirm that your preferred facility and the services you need are included before purchasing a plan.' },
  { q: 'How do I make a claim?', a: 'Follow the instructions in your policy or contact the support team. Some plans arrange treatment through a hospital network; others require you to submit receipts and supporting documents for reimbursement.' },
  { q: 'Is maternity cover included in all plans?', a: 'No. Maternity benefits, limits and waiting periods vary. Review the policy wording and disclose relevant information before choosing cover.' },
  { q: 'Can I switch to a different plan later?', a: 'Ask your provider about upgrading or changing cover. Changes may be subject to renewal dates, underwriting, new premiums and waiting periods.' },
]
const samples = ['reliance-standard', 'tht-gold', 'aiico-health-executive'].map(id => MEDICAL_PLANS.find(plan => plan.id === id)!).filter(Boolean)
const rows = [
  ['Annual cover', ...samples.map(p => p.annualLimit)],
  ['Inpatient care', ...samples.map(p => p.hospitalization)],
  ['Consultations', ...samples.map(p => p.consultation)],
  ['Pharmacy', ...samples.map(p => p.pharmacy)],
  ['Annual premium¹', ...samples.map(p => `₦${p.pricePerPerson.toLocaleString('en-NG')}`)],
]
function CTA({ children = 'Get a quote now', href = '/quote/medical', light = false }: { children?: React.ReactNode; href?: string; light?: boolean }) {
  return <Link href={href} className={`${base.button} ${light ? base.light : ''}`}>{children}<ArrowRight size={16}/></Link>
}
function Heading({ label, children }: { label: string; children: React.ReactNode }) {
  return <><p className={base.eyebrow}>{label}</p><h2>{children}</h2></>
}
export default function MedicalProductPage() {
  const [open, setOpen] = useState<number | null>(0)
  return <div className={`${base.page} ${s.page}`}>
    <section className={s.hero}>
      <div className={s.heroPhoto}><Image src="/medical/family.webp" alt="Nigerian parents and their daughter smiling together at home" fill priority sizes="(max-width:700px) 100vw, 65vw"/></div>
      <div className={`${base.container} ${s.heroInner}`}><div className={s.heroCopy}><p className={base.eyebrow}>Health insurance</p><h1>Health cover for<br/><em>every family.</em></h1><p>Compare medical insurance plans for you and your loved ones. Find the right balance of hospital access, benefits and peace of mind.</p><div className={base.ticks}>{[{icon:ShieldCheck,label:'Hospital networks'},{icon:CreditCard,label:'Compare benefits'},{icon:Users,label:'Family & individual plans'}].map(x=><span key={x.label}><x.icon size={15}/>{x.label}</span>)}</div><div className={s.heroActions}><CTA/><small>Your health. Your family. Your choice.</small></div></div>
      <div className={`${s.badge} ${s.first}`}><ShieldCheck/><span>Explore your<br/><strong>hospital options</strong></span></div><div className={`${s.badge} ${s.second}`}><Users/><span>Cover for you<br/><strong>&amp; your family</strong></span></div><div className={`${s.badge} ${s.third}`}><Heart/><span>Compare<br/><strong>medical cover</strong></span></div></div>
    </section>
    <section className={base.mint}><div className={base.container}><Heading label="What’s covered">Medical cover for life’s uncertainties</Heading><div className={s.coverage}>{benefits.map((x,i)=><article key={x.title}><span className={`${s.icon} ${s['tone'+i]}`}><x.icon size={26}/></span><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></div></section>
    <section><div className={`${base.container} ${s.information}`}><div><Heading label="Key information">Why health insurance in Nigeria?</Heading><p>Medical expenses can be unexpected and costly. A health insurance plan can help you and your family manage eligible treatment costs and access care when you need it.</p><ul className={base.checkList}>{['Compare hospital networks and care options','Understand cashless treatment and copayments','Find cover for you and your family','Explore individual, family and group needs','Check limits, exclusions and waiting periods'].map(t=><li key={t}><Check size={16}/>{t}</li>)}</ul></div><div><p className={base.eyebrow}>Sample plans</p><div className={s.tableScroll} tabIndex={0} role="region" aria-label="Sample medical plan comparison"><table className={s.planTable}><thead><tr><th scope="col">Benefits</th>{samples.map(p=><th scope="col" key={p.id}>{p.name}</th>)}</tr></thead><tbody>{rows.map(([label,...values])=><tr key={label}><th scope="row">{label}</th>{values.map((v,i)=><td key={i}>{v}</td>)}</tr>)}</tbody></table></div><p className={s.tableNote}>¹Illustrative annual prices per person from the current plan catalogue. Confirm pricing and benefits in your quote.</p></div></div></section>
    <section className={base.mint}><div className={`${base.container} ${s.planTypes}`}><Heading label="Plan types">Tailored for your needs</Heading><div className={s.tableScroll} tabIndex={0} role="region" aria-label="Health cover needs"><table className={s.needsTable}><thead><tr><th scope="col">Plan type</th><th scope="col">Ideal for</th><th scope="col">What to consider</th></tr></thead><tbody>{[['Individual cover','One adult','Benefits for your personal healthcare needs'],['Family cover','Your household','Dependant eligibility and cover for each member'],['Corporate cover','Businesses','Group benefits and employee requirements'],['Older adult cover','Later-life needs','Age eligibility, chronic care and waiting periods']].map(([name,who,what])=><tr key={name}><th scope="row">{name}</th><td>{who}</td><td>{what}</td></tr>)}</tbody></table></div></div></section>
    <section className={base.process}><div className={base.container}><Heading label="How it works">Covered in 4 simple steps</Heading><div className={base.steps}>{steps.map((x,i)=><div key={x.title}><span className={base.stepIcon}><x.icon size={28}/></span><h3>{i+1}. {x.title}</h3><p>{x.text}</p></div>)}</div><CTA>Get your health cover</CTA></div></section>
    <section className={base.mint}><div className={base.container}><Heading label="Why ShopInsurance">Why choose us for health cover?</Heading><div className={base.fourGrid}>{reasons.map(x=><article className={base.reason} key={x.title}><x.icon size={30}/><h3>{x.title}</h3><p>{x.text}</p></article>)}</div></div></section>
    <section><div className={`${base.container} ${base.faq}`}><div><Heading label="FAQ">Common questions<br/>answered</Heading><p>Can’t find your answer? Our team can help you understand your health cover.</p><CTA href="/contact">Speak to our team</CTA></div><div>{faqs.map((x,i)=><div className={base.faqItem} key={x.q}><button type="button" aria-expanded={open===i} aria-controls={`medical-faq-${i}`} onClick={()=>setOpen(open===i?null:i)}>{x.q}{open===i?<Minus size={17}/>:<Plus size={17}/>}</button><div id={`medical-faq-${i}`} hidden={open!==i}><p>{x.a}</p></div></div>)}</div></div></section>
    <section className={s.finalCta}><Image src="/medical/doctor.webp" alt="Doctor reviewing care information on a tablet in a clinic" fill sizes="100vw"/><div className={s.ctaShade}/><div className={base.container}><h2>Protect your family’s health today</h2><p>Explore medical cover for the people<br/>who matter most to you.</p><div className={base.ctaActions}><CTA light/><Link href="/contact" className={base.outline}><PhoneCall size={16}/>Speak to an agent</Link></div></div></section>
  </div>
}
