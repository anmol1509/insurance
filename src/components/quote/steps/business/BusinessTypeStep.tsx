'use client'
import { useQuoteStore } from '@/store/quoteStore'
import { BUSINESS_TYPES } from '@/lib/constants'
import { Store, Factory, UtensilsCrossed, Briefcase, HardHat, Laptop, Stethoscope, GraduationCap, Truck, Building2, ShieldCheck, type LucideIcon } from 'lucide-react'
import s from '@/components/quote/businessQuote.module.css'

const details: Record<string,{icon:LucideIcon;sub:string}> = {
  'Retail / Trading': {icon:Store,sub:'Shops, trading, e-commerce'},
  Manufacturing: {icon:Factory,sub:'Factories, production, processing'},
  'Food & Hospitality': {icon:UtensilsCrossed,sub:'Restaurants, hotels, cafés'},
  'Professional Services': {icon:Briefcase,sub:'Consultancy, legal, financial'},
  Construction: {icon:HardHat,sub:'Contractors, builders, civil works'},
  Technology: {icon:Laptop,sub:'IT, software, telecoms'},
  Healthcare: {icon:Stethoscope,sub:'Hospitals, clinics, medical services'},
  Education: {icon:GraduationCap,sub:'Schools, colleges, training centres'},
  'Logistics / Transport': {icon:Truck,sub:'Freight, trucking, delivery'},
  Other: {icon:Building2,sub:'Any other business type'},
}

export default function BusinessTypeStep() {
  const { businessData, updateBusiness } = useQuoteStore()
  return <div><div className={s.types} role="radiogroup" aria-label="Business type">
    {BUSINESS_TYPES.map((type,index)=>{
      const {icon:Icon,sub}=details[type]
      return <button key={type} type="button" role="radio" aria-checked={businessData.businessType===type} className={s.type} onClick={()=>updateBusiness({businessType:type})}
        onKeyDown={event=>{
          const offset=event.key==='ArrowRight'||event.key==='ArrowDown'?1:event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:0
          if(!offset)return
          event.preventDefault()
          const next=(index+offset+BUSINESS_TYPES.length)%BUSINESS_TYPES.length
          updateBusiness({businessType:BUSINESS_TYPES[next]})
          event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus()
        }}><span className={s.typeIcon}><Icon size={26}/></span><span className={s.typeText}><strong>{type}</strong><small>{sub}</small></span><span className={s.radio} aria-hidden="true"/></button>
    })}
  </div><div className={s.notice}><ShieldCheck size={23}/><p>Choose the closest match. You’ll review cover options for your premises, stock and people in the following steps.</p></div></div>
}
