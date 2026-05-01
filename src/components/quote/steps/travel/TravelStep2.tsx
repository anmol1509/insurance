'use client'
import { useEffect } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import RadioCard from '@/components/ui/RadioCard'
import { calculateTravelPremium } from '@/lib/premiumCalculator'
import { formatNaira } from '@/lib/formatters'
import { motion } from 'framer-motion'

const addons = [
  { id: 'cancellation',     label: 'Trip Cancellation',   sub: 'Refund if trip is cancelled for covered reasons', price: 3500 },
  { id: 'baggage',          label: 'Baggage & Belongings', sub: 'Lost, stolen or damaged luggage',                 price: 2800 },
  { id: 'flight_delay',     label: 'Flight Delay',         sub: 'Compensation for delays over 4 hours',            price: 1500 },
  { id: 'adventure_sports', label: 'Adventure Sports',     sub: 'Ski, diving, bungee, extreme activities',         price: 4000 },
]

const currencies = [
  { value: 'NGN', label: 'NGN — Nigerian Naira' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
]

export default function TravelStep2() {
  const { travelData, updateTravel, setCalculatedPremium } = useQuoteStore()

  function toggleAddon(id: string) {
    const curr = travelData.addons
    updateTravel({ addons: curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id] })
  }

  useEffect(() => {
    const { total, breakdown } = calculateTravelPremium(travelData)
    setCalculatedPremium(total, breakdown)
  }, [travelData, setCalculatedPremium])

  const { total } = calculateTravelPremium(travelData)

  return (
    <div className="space-y-7">
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Departure Date"
          required
          type="date"
          value={travelData.departureDate}
          onChange={(e) => updateTravel({ departureDate: e.target.value })}
          productColor="var(--travel-600)"
        />
        <Input
          label="Return Date"
          required
          type="date"
          value={travelData.returnDate}
          onChange={(e) => updateTravel({ returnDate: e.target.value })}
          productColor="var(--travel-600)"
        />
      </div>

      {/* Currency */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Preferred coverage currency
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {currencies.map((c) => (
            <RadioCard
              key={c.value}
              label={c.label}
              selected={travelData.preferredCurrency === c.value}
              onClick={() => updateTravel({ preferredCurrency: c.value })}
              productColor="var(--travel-600)"
              productColorBg="var(--travel-50)"
            />
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-1" style={{ color: 'var(--text-secondary)' }}>
          Optional add-ons
        </p>
        <p className="font-sans text-[13px] mb-3" style={{ color: 'var(--text-muted)' }}>
          Select all that apply — premium updates live.
        </p>
        <div className="flex flex-col gap-3">
          {addons.map((addon) => {
            const selected = travelData.addons.includes(addon.id)
            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddon(addon.id)}
                className="flex items-center justify-between p-4 rounded-2xl border-[1.5px] text-left transition-all"
                style={
                  selected
                    ? { borderColor: 'var(--travel-600)', backgroundColor: 'var(--travel-50)' }
                    : { borderColor: 'var(--border-default)', backgroundColor: 'white' }
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded border-[1.5px] flex items-center justify-center shrink-0"
                    style={selected ? { borderColor: 'var(--travel-600)', backgroundColor: 'var(--travel-600)' } : { borderColor: 'var(--border-medium)' }}
                  >
                    {selected && <span className="text-white text-[10px] font-bold">✓</span>}
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{addon.label}</p>
                    <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>{addon.sub}</p>
                  </div>
                </div>
                <span className="font-sans font-semibold text-sm shrink-0 ml-3" style={{ color: 'var(--travel-600)' }}>
                  +{formatNaira(addon.price)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Live premium */}
      {travelData.destination && travelData.departureDate && travelData.returnDate && (
        <motion.div
          className="rounded-2xl p-6 border"
          style={{ backgroundColor: 'var(--travel-50)', borderColor: 'var(--travel-100)' }}
          layout
        >
          <p className="font-sans font-medium text-[13px] mb-1" style={{ color: 'var(--text-muted)' }}>
            Estimated premium
          </p>
          <motion.p
            key={total}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            className="font-display font-extrabold text-[40px] leading-none"
            style={{ color: 'var(--travel-600)' }}
          >
            {formatNaira(total)}
          </motion.p>
        </motion.div>
      )}
    </div>
  )
}
