'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Car, CalendarDays, Fuel, Gauge, Palette, Layers3 } from 'lucide-react'
import type { MotorData } from '@/store/quoteStore'
import { NIGERIA_VEHICLE_CATALOG } from '@/data/vehicleMakes'
import s from '../motorQuote.module.css'

export function formatNaira(value?: number | null) {
  return value ? `₦${value.toLocaleString('en-NG')}` : 'Not set'
}

export default function VehiclePreview({ data, compact = false }: { data: MotorData; compact?: boolean }) {
  const [matchedPhoto,setMatchedPhoto]=useState<{key:string;url:string;matchedBy:string}|null>(null)
  const vin=data.chassisVIN.trim().toUpperCase()
  const make=Object.keys(NIGERIA_VEHICLE_CATALOG).sort((a,b)=>b.length-a.length).find(value=>data.vehicleMakeModel.startsWith(`${value} `))||''
  const model=make?data.vehicleMakeModel.slice(make.length).trim():''
  const params=new URLSearchParams()
  if(/^[A-HJ-NPR-Z0-9]{17}$/.test(vin))params.set('vin',vin)
  else if(make&&model){params.set('make',make);params.set('model',model);if(data.yearOfManufacture)params.set('year',String(data.yearOfManufacture))}
  const lookupKey=params.toString()
  const matchedImage=matchedPhoto?.key===lookupKey?matchedPhoto.url:null
  useEffect(()=>{
    if(!lookupKey)return
    let active=true
    fetch(`/api/auto-dev/photos?${lookupKey}`)
      .then(response=>response.ok?response.json():Promise.reject(new Error('No vehicle photo')))
      .then((payload:unknown)=>{
        if(active&&payload&&typeof payload==='object'&&typeof (payload as {imageUrl?:unknown}).imageUrl==='string'){
          const photo=payload as {imageUrl:string;matchedBy?:string}
          setMatchedPhoto({key:lookupKey,url:photo.imageUrl,matchedBy:photo.matchedBy||'vehicle'})
        }
      })
      .catch(()=>{})
    return()=>{active=false}
  },[lookupKey])
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
        <Image src={matchedImage||"/auth/car-illustration.webp"} alt={matchedImage?(matchedPhoto?.matchedBy==='vin'?`${data.vehicleMakeModel||'Vehicle'} matched by VIN`:`${data.vehicleMakeModel} selected vehicle image`):'Representative vehicle illustration'} width={1000} height={560} priority onError={()=>setMatchedPhoto(null)} />
      </div>
      {!compact && <p className={s.imageNote}>{matchedImage?(matchedPhoto?.matchedBy==='vin'?'Vehicle photo matched using the supplied VIN.':matchedPhoto?.matchedBy==='make-model-year'?'Image of the selected make, model and year.':'Image of the selected make and model.'):'Representative image — your exact vehicle may differ.'}</p>}
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
