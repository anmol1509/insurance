'use client'
import { useQuoteStore } from '@/store/quoteStore'
import { TRAVEL_DESTINATIONS } from '@/lib/constants'
import { Plane } from 'lucide-react'
import s from '@/components/quote/travelQuote.module.css'

export default function TravelDestination() {
  const { travelData, updateTravel } = useQuoteStore()
  return <div>
    <div className={s.destinations} role="radiogroup" aria-label="Travel destination">
      {TRAVEL_DESTINATIONS.map((destination,index)=><button
        key={destination.value} type="button" role="radio" aria-checked={travelData.destination===destination.value}
        className={s.destination} onClick={()=>updateTravel({destination:destination.value})}
        onKeyDown={event=>{
          const offset=event.key==='ArrowRight'||event.key==='ArrowDown'?1:event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:0
          if(!offset)return
          event.preventDefault()
          const next=(index+offset+TRAVEL_DESTINATIONS.length)%TRAVEL_DESTINATIONS.length
          updateTravel({destination:TRAVEL_DESTINATIONS[next].value})
          const buttons=event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
          buttons?.[next]?.focus()
        }}>
        <span className={s.thumbnail} aria-hidden="true" style={{backgroundPosition:`${(index%3)*50}% ${index<3?0:100}%`}}/>
        <span className={s.destinationText}><strong>{destination.label}</strong><small>{destination.sub}</small></span><span className={s.radio} aria-hidden="true"/>
      </button>)}
    </div>
    <div className={s.notice}><Plane size={22}/><p>Choose your destination and review the policy’s medical limits, covered territories and any visa requirements before purchase.</p></div>
  </div>
}
