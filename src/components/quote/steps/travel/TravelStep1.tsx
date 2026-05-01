'use client'
import { useQuoteStore } from '@/store/quoteStore'
import Input from '@/components/ui/Input'
import RadioCard from '@/components/ui/RadioCard'
import NINField from '@/components/ui/NINField'
import ToggleSwitch from '@/components/ui/ToggleSwitch'

const destinations = [
  { id: 'schengen',    label: 'Schengen',     sub: 'EU / Europe' },
  { id: 'uk',          label: 'UK',           sub: 'United Kingdom' },
  { id: 'usa_canada',  label: 'USA / Canada', sub: 'North America' },
  { id: 'africa',      label: 'Africa',       sub: 'African countries' },
  { id: 'asia',        label: 'Asia',         sub: 'Asia-Pacific' },
  { id: 'worldwide',   label: 'Worldwide',    sub: 'Any destination' },
]

const tripTypes = [
  { id: 'single' as const, label: 'Single Trip', sub: 'One journey' },
  { id: 'multi_annual' as const, label: 'Multi-Trip Annual', sub: 'Unlimited trips in 12 months' },
]

export default function TravelStep1() {
  const { travelData, updateTravel } = useQuoteStore()

  return (
    <div className="space-y-7">
      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          required
          value={travelData.fullName}
          onChange={(e) => updateTravel({ fullName: e.target.value })}
          placeholder="As on your passport"
          productColor="var(--travel-600)"
        />
        <Input
          label="Date of Birth"
          required
          type="date"
          value={travelData.dateOfBirth}
          onChange={(e) => updateTravel({ dateOfBirth: e.target.value })}
          hint="Must be 18 or older"
          productColor="var(--travel-600)"
        />
      </div>

      <NINField
        value={travelData.nin}
        onChange={(v) => updateTravel({ nin: v })}
        productColor="var(--travel-600)"
      />

      <Input
        label="Passport Number"
        required
        value={travelData.passportNumber}
        onChange={(e) => updateTravel({ passportNumber: e.target.value.toUpperCase() })}
        placeholder="e.g. A12345678"
        productColor="var(--travel-600)"
      />

      <div className="grid md:grid-cols-2 gap-5">
        <Input
          label="Number of Travellers"
          required
          type="number"
          value={travelData.numberOfTravellers}
          onChange={(e) => updateTravel({ numberOfTravellers: Math.max(1, Number(e.target.value)) })}
          hint="Including the primary traveller"
          productColor="var(--travel-600)"
        />
        <Input
          label="Visa Requirement / Type"
          value={travelData.visaRequirement}
          onChange={(e) => updateTravel({ visaRequirement: e.target.value })}
          placeholder="e.g. Tourist, Business, Student"
          productColor="var(--travel-600)"
        />
      </div>

      {/* All Nigerian citizens */}
      {travelData.numberOfTravellers > 1 && (
        <div
          className="flex justify-between items-center p-5 rounded-2xl border"
          style={{ backgroundColor: 'var(--surface-raised)', borderColor: 'var(--border-default)' }}
        >
          <p className="font-sans font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Are all travellers Nigerian citizens?
          </p>
          <ToggleSwitch
            checked={travelData.allNigerianCitizens}
            onChange={(v) => updateTravel({ allNigerianCitizens: v })}
            productColor="var(--travel-600)"
          />
        </div>
      )}

      {/* Destination */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Destination / Region <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {destinations.map((d) => (
            <RadioCard
              key={d.id}
              label={d.label}
              priceHint={d.sub}
              selected={travelData.destination === d.id}
              onClick={() => updateTravel({ destination: d.id })}
              productColor="var(--travel-600)"
              productColorBg="var(--travel-50)"
            />
          ))}
        </div>
      </div>

      {/* Trip type */}
      <div>
        <p className="font-sans font-semibold text-[13px] mb-3" style={{ color: 'var(--text-secondary)' }}>
          Trip type <span className="text-[var(--error)]">*</span>
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {tripTypes.map((t) => (
            <RadioCard
              key={t.id}
              label={t.label}
              priceHint={t.sub}
              selected={travelData.tripType === t.id}
              onClick={() => updateTravel({ tripType: t.id })}
              productColor="var(--travel-600)"
              productColorBg="var(--travel-50)"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
