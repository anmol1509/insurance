'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import CheckboxCard from '@/components/ui/CheckboxCard'
import { differenceInDays } from 'date-fns'
import { formatNaira } from '@/lib/formatters'
import { calculateTravelPremium } from '@/lib/premiumCalculator'

const addons = [
  { id: 'cancellation', label: 'Trip Cancellation', sub: 'Non-refundable costs if you cancel', price: 3500 },
  { id: 'baggage', label: 'Baggage Loss', sub: 'Lost, stolen, or delayed luggage', price: 2800 },
  { id: 'flight_delay', label: 'Flight Delay', sub: 'Daily allowance for delays > 6 hrs', price: 1500 },
  { id: 'adventure_sports', label: 'Adventure Sports', sub: 'Extreme activities cover', price: 4000 },
]

export default function TravelStep2() {
  const { travelData, updateTravel, setCalculatedPremium } = useQuoteStore()

  const days = travelData.departureDate && travelData.returnDate
    ? Math.max(1, differenceInDays(new Date(travelData.returnDate), new Date(travelData.departureDate)))
    : null

  useEffect(() => {
    const { total, breakdown } = calculateTravelPremium(travelData)
    setCalculatedPremium(total, breakdown)
  }, [travelData, setCalculatedPremium])

  const isSchengen = travelData.destination === 'schengen'

  const visibleAddons = isSchengen ? addons.filter((a) => a.id !== 'adventure_sports') : addons

  const toggleAddon = (id: string) => {
    const current = travelData.addons
    updateTravel({ addons: current.includes(id) ? current.filter((x) => x !== id) : [...current, id] })
  }

  const { total } = calculateTravelPremium(travelData)

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <Input label="Departure Date" required type="date" value={travelData.departureDate} onChange={(e) => updateTravel({ departureDate: e.target.value })} />
        </div>
        <div>
          <Input label="Return Date" required type="date" value={travelData.returnDate} onChange={(e) => updateTravel({ returnDate: e.target.value })} />
        </div>
      </div>

      {days && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border font-sans font-medium text-[13px]" style={{ backgroundColor: 'var(--green-50)', borderColor: 'var(--green-100)', color: 'var(--green-700)' }}>
          📅 Trip duration: {days} day{days > 1 ? 's' : ''}
        </div>
      )}

      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>Add-on Coverage</p>
        <div className="flex flex-col gap-3">
          {visibleAddons.map((addon) => (
            <CheckboxCard key={addon.id} label={addon.label} subLabel={addon.sub} priceTag={`+${formatNaira(addon.price)}`} checked={travelData.addons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} productColor="var(--travel-600)" productColorBg="var(--travel-50)" />
          ))}
        </div>
      </div>

      {travelData.destination && travelData.departureDate && travelData.returnDate && (
        <div className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--travel-50)', borderColor: 'var(--travel-100)' }}>
          <p className="font-sans font-medium text-[13px] mb-1" style={{ color: 'var(--text-muted)' }}>Estimated premium</p>
          <p className="font-display font-bold text-[42px] leading-none" style={{ color: 'var(--travel-600)' }}>{formatNaira(total)}</p>
        </div>
      )}
    </div>
  )
}
