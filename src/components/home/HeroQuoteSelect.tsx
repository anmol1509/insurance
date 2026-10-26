'use client'

import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp, UserRound, Heart, Users, Building2, MapPin, Globe, Landmark, Plane, Sunrise, Store, Factory, UtensilsCrossed, BriefcaseBusiness, HardHat, Laptop, Stethoscope, GraduationCap, Truck, type LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { BUSINESS_TYPES, MEDICAL_COVER_OPTIONS, TRAVEL_DESTINATIONS } from '@/lib/constants'
import s from './heroQuoteSelect.module.css'

type Product = 'medical' | 'travel' | 'business'
type Option = { value: string; label: string; description: string; icon: LucideIcon }
const medicalIcons = [UserRound, Heart, Users, Building2]
const travelIcons = [Landmark, Landmark, Globe, Sunrise, MapPin, Plane]
const businessDetails: Record<string, { icon: LucideIcon; description: string }> = {
  'Retail / Trading': { icon: Store, description: 'Shops, trading & online stores' },
  Manufacturing: { icon: Factory, description: 'Production, processing & factories' },
  'Food & Hospitality': { icon: UtensilsCrossed, description: 'Restaurants, cafés & hotels' },
  'Professional Services': { icon: BriefcaseBusiness, description: 'Consulting, legal & financial services' },
  Construction: { icon: HardHat, description: 'Contractors, builders & civil works' },
  Technology: { icon: Laptop, description: 'Software, IT & telecoms' },
  Healthcare: { icon: Stethoscope, description: 'Clinics, hospitals & care providers' },
  Education: { icon: GraduationCap, description: 'Schools, colleges & training' },
  'Logistics / Transport': { icon: Truck, description: 'Freight, trucking & delivery' },
  Other: { icon: Building2, description: 'Find cover for your business' },
}
function getOptions(product: Product): Option[] {
  if (product === 'medical') return MEDICAL_COVER_OPTIONS.map((option, index) => ({ value: option.value, label: option.label, description: option.sub, icon: medicalIcons[index] }))
  if (product === 'travel') return TRAVEL_DESTINATIONS.map((option, index) => ({ value: option.value, label: option.label, description: option.sub, icon: travelIcons[index] }))
  return BUSINESS_TYPES.map(value => ({ value, label: value, ...businessDetails[value] }))
}
const config = {
  medical: { label: 'Who needs cover?', hint: 'Choose who you’d like to protect', icon: Heart },
  travel: { label: 'Where are you heading?', hint: 'Choose your travel destination', icon: Plane },
  business: { label: 'What’s your business?', hint: 'Choose your industry', icon: BriefcaseBusiness },
}
export default function HeroQuoteSelect({ product, value, onChange, accent, wash }: { product: Product; value: string; onChange: (value: string) => void; accent: string; wash: string }) {
  const options = getOptions(product)
  const selected = options.find(option => option.value === value)
  const current = config[product]
  const Icon = selected?.icon ?? current.icon
  const theme = { '--select-accent': accent, '--select-wash': wash } as CSSProperties
  return <Select.Root value={value} onValueChange={onChange}>
    <Select.Trigger className={s.trigger} style={theme} aria-label={product === 'medical' ? 'Who needs cover?' : product === 'travel' ? 'Travel destination' : 'Business type'}>
      <span className={s.triggerIcon}><Icon size={21}/></span>
      <span className={s.triggerText}><span className={s.fieldLabel}>{current.label}</span><span className={`${s.value} ${!selected ? s.placeholder : ''}`}><Select.Value placeholder={current.hint}/></span></span>
      <Select.Icon className={s.chevron}><ChevronDown size={18}/></Select.Icon>
    </Select.Trigger>
    <Select.Portal><Select.Content className={s.menu} style={theme} position="popper" sideOffset={9} collisionPadding={16} align="start">
      <div className={s.menuHeader}><span>{current.label}</span><small>{options.length} options</small></div>
      <Select.ScrollUpButton className={s.scroll}><ChevronUp size={16}/></Select.ScrollUpButton>
      <Select.Viewport className={s.viewport}>{options.map(option => <Select.Item value={option.value} key={option.value} textValue={option.label} className={s.option}>
        <span className={s.optionIcon}><option.icon size={19}/></span>
        <span className={s.optionText}><Select.ItemText>{option.label}</Select.ItemText><small>{option.description}</small></span>
        <Select.ItemIndicator className={s.selected}><Check size={15}/></Select.ItemIndicator>
      </Select.Item>)}</Select.Viewport>
      <Select.ScrollDownButton className={s.scroll}><ChevronDown size={16}/></Select.ScrollDownButton>
      <div className={s.menuFooter}>Choose an option to personalise your quote</div>
    </Select.Content></Select.Portal>
  </Select.Root>
}
