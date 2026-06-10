'use client'
import { useState } from 'react'
import { useQuoteStore } from '@/store/quoteStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, CheckCircle2, Car, AlertCircle, Pencil } from 'lucide-react'

const MOCK_LOOKUP: Record<string, {
  vehicleMakeModel: string; yearOfManufacture: number; vehicleType: string;
  engineCapacity: string; vehicleColour: string; chassisVIN: string;
  fuelType: string; vehicleVariant: string;
}> = {
  'LAG-123-AA': { vehicleMakeModel: 'Toyota Camry', yearOfManufacture: 2020, vehicleType: 'Saloon', engineCapacity: '2000–2499cc', vehicleColour: 'Black', chassisVIN: 'JT2BF22K1W0084979', fuelType: 'Petrol', vehicleVariant: 'XLE' },
  'ABJ-456-BB': { vehicleMakeModel: 'Honda CR-V', yearOfManufacture: 2019, vehicleType: 'SUV', engineCapacity: '1500–1999cc', vehicleColour: 'White', chassisVIN: '5J6RW2H89KA009423', fuelType: 'Petrol', vehicleVariant: 'Sport' },
  'RIV-789-CC': { vehicleMakeModel: 'Mercedes-Benz C300', yearOfManufacture: 2021, vehicleType: 'Saloon', engineCapacity: '2000–2499cc', vehicleColour: 'Silver', chassisVIN: 'WDD2050122F382015', fuelType: 'Petrol', vehicleVariant: 'AMG Line' },
}

type LookupState = 'idle' | 'loading' | 'found' | 'not_found'

export default function MotorStep1() {
  const { motorData, updateMotor, setStep } = useQuoteStore()
  const [lookupState, setLookupState] = useState<LookupState>('idle')
  const [inputValue, setInputValue] = useState(motorData.registrationNumber)

  async function handleLookup() {
    if (!inputValue.trim()) return
    setLookupState('loading')
    updateMotor({ registrationNumber: inputValue.trim().toUpperCase() })
    await new Promise((r) => setTimeout(r, 1800))

    const key = inputValue.trim().toUpperCase()
    const found = MOCK_LOOKUP[key] ?? {
      vehicleMakeModel: 'Toyota Camry',
      yearOfManufacture: 2020,
      vehicleType: 'Saloon',
      engineCapacity: '2000–2499cc',
      vehicleColour: 'Black',
      chassisVIN: 'JN1AAZX45U0000001',
      fuelType: 'Petrol',
      vehicleVariant: 'SE',
    }
    updateMotor(found)
    setLookupState('found')
  }

  function handleSkip() {
    updateMotor({ registrationNumber: inputValue.trim().toUpperCase() })
    setLookupState('found')
  }

  const found = lookupState === 'found'

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div
        className="rounded-3xl border-2 p-6 sm:p-8 text-center"
        style={{ borderColor: found ? 'var(--motor-300)' : 'var(--border-default)', backgroundColor: found ? 'var(--motor-50)' : 'white', transition: 'all 0.3s' }}
      >
        <div className="flex items-center justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: found ? 'var(--motor-600)' : 'var(--surface-raised)' }}>
            {found
              ? <CheckCircle2 className="w-8 h-8 text-white" />
              : <Car className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />}
          </div>
        </div>

        <h2 className="font-display font-bold text-xl mb-1.5" style={{ color: 'var(--text-primary)' }}>
          {found ? 'Vehicle found!' : 'Enter your plate number'}
        </h2>
        <p className="font-sans text-[14px] mb-6" style={{ color: 'var(--text-muted)' }}>
          {found
            ? "We've pre-filled your car details from the FRSC registry. Review them in the next step."
            : "We’ll look up your vehicle details automatically from the FRSC/NIID registry."}
        </p>

        {!found && (
          <>
            <div className="relative mb-3">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 font-sans font-bold text-[13px] px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--motor-600)', color: 'white' }}>
                NG
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value.toUpperCase())
                  setLookupState('idle')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                placeholder="e.g. LAG-123-AA"
                className="w-full h-14 pl-16 pr-4 rounded-2xl border-2 font-sans font-semibold text-[16px] tracking-widest outline-none transition-all"
                style={{ borderColor: lookupState === 'not_found' ? '#ef4444' : 'var(--border-medium)', color: 'var(--text-primary)', letterSpacing: '0.08em' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--motor-600)'; e.currentTarget.style.boxShadow = '0 0 0 4px color-mix(in srgb, var(--motor-600) 12%, transparent)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = lookupState === 'not_found' ? '#ef4444' : 'var(--border-medium)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>

            <AnimatePresence>
              {lookupState === 'not_found' && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2 justify-center mb-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="font-sans text-[13px] text-red-600">Plate not found in registry — you can still continue manually.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={handleLookup}
              disabled={lookupState === 'loading' || !inputValue.trim()}
              className="w-full h-13 py-3.5 rounded-2xl font-sans font-bold text-[15px] text-white transition-all disabled:opacity-50 hover:-translate-y-px hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: 'var(--motor-600)' }}
            >
              {lookupState === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Looking up vehicle…
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Find my car
                </>
              )}
            </button>

            {lookupState === 'loading' && (
              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 1.6, ease: 'linear' }}
                className="mt-3 h-1 rounded-full origin-left"
                style={{ backgroundColor: 'var(--motor-600)' }}
              />
            )}

            <p className="font-sans text-[12px] mt-3" style={{ color: 'var(--text-muted)' }}>
              Don&apos;t have the plate handy?{' '}
              <button type="button" onClick={handleSkip} className="underline font-medium" style={{ color: 'var(--motor-600)' }}>
                Enter details manually
              </button>
            </p>
          </>
        )}

        {found && motorData.vehicleMakeModel && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border p-4 text-left"
            style={{ backgroundColor: 'white', borderColor: 'var(--motor-200)' }}
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                ['Make & Model', motorData.vehicleMakeModel],
                ['Year', motorData.yearOfManufacture],
                ['Type', motorData.vehicleType],
                ['Fuel', motorData.fuelType],
                ['Colour', motorData.vehicleColour],
                ['Variant', motorData.vehicleVariant],
                ['Engine', motorData.engineCapacity],
                ['Chassis', motorData.chassisVIN ? motorData.chassisVIN.slice(0, 8) + '…' : null],
              ].map(([label, value]) => value ? (
                <div key={String(label)}>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <p className="font-sans font-semibold text-[13px]" style={{ color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ) : null)}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--motor-100)' }}>
              <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
                ✓ Pre-filled from FRSC/NIID registry
              </p>
              <button
                type="button"
                onClick={() => setStep('motor', 2)}
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border font-sans text-[11px] font-medium transition-colors hover:bg-[var(--motor-50)]"
                style={{ borderColor: 'var(--motor-300)', color: 'var(--motor-700)' }}
              >
                <Pencil className="w-3 h-3" /> Edit details
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Trust stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: '12,000+', label: 'cars insured' },
          { value: '₦2.1B', label: 'claims paid out' },
          { value: '4.8★', label: 'customer rating' },
        ].map(({ value, label }) => (
          <div key={label} className="rounded-2xl border bg-white px-3 py-3.5 text-center" style={{ borderColor: 'var(--border-subtle)' }}>
            <p className="font-display font-extrabold text-[18px] leading-none" style={{ color: 'var(--motor-600)' }}>{value}</p>
            <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
