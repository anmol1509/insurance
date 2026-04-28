'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import RadioCard from '@/components/ui/RadioCard'

const destinations = [
  { id: 'schengen', label: '🌍 Schengen/Europe' },
  { id: 'uk', label: '🇬🇧 UK' },
  { id: 'usa_canada', label: '🇺🇸 USA/Canada' },
  { id: 'africa', label: '🌍 Africa' },
  { id: 'asia', label: '🌏 Asia' },
  { id: 'worldwide', label: '🌐 Worldwide' },
]

const tripTypes = [
  { id: 'single', label: 'Single Trip', sub: 'One journey, one policy' },
  { id: 'multi_annual', label: 'Multi-trip Annual', sub: 'Unlimited trips for 12 months' },
]

export default function TravelStep1() {
  const { travelData, updateTravel } = useQuoteStore()

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <Input label="Full Name" required value={travelData.fullName} onChange={(e) => updateTravel({ fullName: e.target.value })} placeholder="As on passport" />
        <Input label="Date of Birth" required type="date" value={travelData.dob} onChange={(e) => updateTravel({ dob: e.target.value })} />
      </div>
      <Input label="Passport Number" value={travelData.passportNumber} onChange={(e) => updateTravel({ passportNumber: e.target.value })} placeholder="e.g. A12345678" />

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Destination <span style={{ color: 'var(--error)' }}>*</span></p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {destinations.map((d) => (
            <RadioCard key={d.id} label={d.label} selected={travelData.destination === d.id} onClick={() => updateTravel({ destination: d.id })} productColor="var(--travel-600)" productColorBg="var(--travel-50)" />
          ))}
        </div>
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Number of Travellers</p>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => updateTravel({ numberOfTravellers: Math.max(1, travelData.numberOfTravellers - 1) })} className="w-10 h-10 rounded-xl border-[1.5px] border-[var(--border-medium)] font-bold text-xl flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors">−</button>
          <span className="font-display font-bold text-2xl w-8 text-center" style={{ color: 'var(--text-primary)' }}>{travelData.numberOfTravellers}</span>
          <button type="button" onClick={() => updateTravel({ numberOfTravellers: Math.min(10, travelData.numberOfTravellers + 1) })} className="w-10 h-10 rounded-xl border-[1.5px] border-[var(--border-medium)] font-bold text-xl flex items-center justify-center hover:bg-[var(--surface-raised)] transition-colors">+</button>
        </div>
      </div>

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Trip Type</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {tripTypes.map((tt) => (
            <RadioCard key={tt.id} label={tt.label} subLabel={tt.sub} selected={travelData.tripType === tt.id} onClick={() => updateTravel({ tripType: tt.id as typeof travelData.tripType })} productColor="var(--travel-600)" productColorBg="var(--travel-50)" />
          ))}
        </div>
      </div>
    </div>
  )
}
