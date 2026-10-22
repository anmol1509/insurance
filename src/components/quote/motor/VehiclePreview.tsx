'use client'

import { Car, CalendarDays, Fuel, Gauge, Palette, Layers3 } from 'lucide-react'
import type { MotorData } from '@/store/quoteStore'
import s from '../motorQuote.module.css'

export function formatNaira(value?: number | null) {
  return value ? `₦${value.toLocaleString('en-NG')}` : 'Not set'
}

export default function VehiclePreview({ data, compact = false }: { data: MotorData; compact?: boolean }) {
  const specs = [
    ['Vehicle type', data.vehicleType, Car],
    ['Year', data.yearOfManufacture, CalendarDays],
    ['Fuel type', data.fuelType, Fuel],
    ['Colour', data.vehicleColour, Palette],
    ['Engine size', data.engineCapacity, Gauge],
    ['Variant / trim', data.vehicleVariant, Layers3],
  ] as const
  return (
    <>
      {data.vehicleMakeModel && (
        <div className={s.summary} style={compact ? { marginTop: 8 } : undefined}>
          <div className={s.summaryTitle}>
            <strong>{data.vehicleMakeModel}</strong>
            <span>{[data.vehicleVariant, data.yearOfManufacture].filter(Boolean).join(' · ')}</span>
          </div>
          <div className={s.specs}>
            {specs.map(([label, value, Icon]) => value ? (
              <div className={s.spec} key={label}>
                <label><Icon size={12} /> {label}</label><b>{value}</b>
              </div>
            ) : null)}
          </div>
        </div>
      )}
    </>
  )
}
