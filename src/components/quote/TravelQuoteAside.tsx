import Image from 'next/image'
import { Globe, Headphones, FileCheck } from 'lucide-react'
import s from './travelQuote.module.css'

export default function TravelQuoteAside() {
  return <aside className={s.aside} aria-label="Travel insurance overview">
    <Image src="/travel/coast.webp" alt="Traveller looking over a sunlit Mediterranean coast" fill priority sizes="(max-width:1023px) 95vw, 40vw" className={s.asidePhoto}/>
    <div className={s.fade}/>
    <div className={s.copy}><span className={s.accent}/><h2>Explore the world<br/>with <em>confidence</em></h2><p className={s.lead}>Explore travel insurance for your next adventure — with cover options for your destination, your belongings and your peace of mind.</p>
      <div className={s.benefits}>{[
        {icon:Globe,title:'Cover for your destination',text:'Choose the region you plan to visit'},
        {icon:Headphones,title:'Assistance options',text:'Check the support included in your policy'},
        {icon:FileCheck,title:'Clear cover details',text:'Review benefits and exclusions before you travel'},
      ].map(({icon:Icon,title,text})=><div className={s.benefit} key={title}><span><Icon size={27}/></span><div><strong>{title}</strong><p>{text}</p></div></div>)}</div>
    </div>
  </aside>
}
