import Image from 'next/image'
import { Hospital, Zap, ShieldCheck } from 'lucide-react'
import s from './medicalQuoteAside.module.css'

export default function MedicalQuoteAside() {
  return <aside className={s.panel} aria-label="Medical insurance overview">
    <div className={s.photo}><Image src="/medical/family.webp" alt="Parents and their daughter smiling together" fill priority sizes="(max-width: 1023px) 90vw, 40vw"/></div>
    <div className={s.fade}/>
    <div className={s.copy}>
      <span className={s.accent}/>
      <h2>Quality healthcare<br/>for what matters<br/>most</h2>
      <p className={s.description}>Explore medical coverage for yourself, your family or your team — with benefits and hospital options to suit your needs.</p>
      <div className={s.benefits}>{[
        { icon: Hospital, title: 'Explore hospital networks', text: 'Check the facilities included in your plan' },
        { icon: Zap, title: 'Simple online quotes', text: 'Compare cover for the people you care about' },
        { icon: ShieldCheck, title: 'Choose with confidence', text: 'Review policy benefits, limits and exclusions' },
      ].map(({icon:Icon,title,text})=><div className={s.benefit} key={title}><span><Icon size={25}/></span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div>
    </div>
  </aside>
}
