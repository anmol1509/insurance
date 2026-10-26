import Image from 'next/image'
import { ShieldCheck, Zap, Users } from 'lucide-react'
import s from './businessQuote.module.css'

export default function BusinessQuoteAside() {
  return <aside className={s.aside} aria-label="Business insurance overview">
    <Image src="/business/quote-owner.webp" alt="Business owner holding a tablet outside modern offices" fill priority sizes="(max-width:1023px) 95vw, 40vw" className={s.photo}/>
    <div className={s.fade}/>
    <div className={s.copy}><span className={s.accent}/><h2>Protection<br/>for every kind<br/>of <em>business</em></h2><p className={s.lead}>Explore business insurance tailored to your industry — so you can focus on what matters most: your growth.</p>
      <div className={s.benefits}>{[
        {icon:ShieldCheck,title:'Industry-specific needs',text:'Choose cover for your business and its risks'},
        {icon:Zap,title:'Simple online quotes',text:'Build and review your cover in one place'},
        {icon:Users,title:'Support for your business',text:'Get guidance on requirements and next steps'},
      ].map(({icon:Icon,title,text})=><div className={s.benefit} key={title}><span><Icon size={27}/></span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div>
    </div>
  </aside>
}
