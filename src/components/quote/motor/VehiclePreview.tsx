'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Car, CalendarDays, Fuel, Gauge, Palette, Layers3 } from 'lucide-react'
import type { MotorData } from '@/store/quoteStore'
import s from '../motorQuote.module.css'

export function formatNaira(value?: number | null) {
  return value ? `₦${value.toLocaleString('en-NG')}` : 'Not set'
}

export default function VehiclePreview({ data, compact = false }: { data: MotorData; compact?: boolean }) {
  const [matchedPhoto,setMatchedPhoto]=useState<{vin:string;url:string}|null>(null)
  const vin=data.chassisVIN.trim().toUpperCase()
  const matchedImage=matchedPhoto?.vin===vin?matchedPhoto.url:null
  useEffect(()=>{
    if(!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin))return
    let active=true
    fetch(`/api/auto-dev/photos?vin=${encodeURIComponent(vin)}`)
      .then(response=>response.ok?response.json():Promise.reject(new Error('No vehicle photo')))
      .then((payload:unknown)=>{
        if(active&&payload&&typeof payload==='object'&&typeof (payload as {imageUrl?:unknown}).imageUrl==='string')setMatchedPhoto({vin,url:(payload as {imageUrl:string}).imageUrl})
      })
      .catch(()=>{})
    return()=>{active=false}
  },[vin])
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
      <div className={s.vehicleArt} style={compact ? { minHeight: 130, marginTop: 8 } : undefined}>
        <Image src={matchedImage||"/auth/car-illustration.webp"} alt={matchedImage?`${data.vehicleMakeModel||'Vehicle'} matched by VIN`:'Representative vehicle illustration'} width={1000} height={560} priority onError={()=>setMatchedPhoto(null)} />
      </div>
      {!compact && <p className={s.imageNote}>{matchedImage?'Vehicle photo matched using the supplied VIN.':'Representative image — your exact vehicle may differ.'}</p>}
      {data.vehicleMakeModel && (
        <div className={s.summary}>
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
