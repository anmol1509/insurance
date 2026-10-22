'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertCircle, ArrowLeft, Car, CheckCircle2, Loader2, Search, ShieldCheck, Sparkles } from 'lucide-react'
import { useQuoteStore } from '@/store/quoteStore'
import { NEW_CAR_PREFILL } from '@/lib/motorRegistration'
import { lookupVehicleByPlate } from '@/lib/verifydata/browser'
import { VEHICLE_SUGGESTIONS } from '@/data/vehicleMakes'
import { VEHICLE_TYPES } from '@/lib/constants'
import Select from '@/components/ui/Select'
import VehiclePreview from '@/components/quote/motor/VehiclePreview'

type LookupState='idle'|'loading'|'found'|'error'
const years=Array.from({length:35},(_,i)=>String(new Date().getFullYear()-i))
const makeNames=Array.from(new Set(VEHICLE_SUGGESTIONS.map(v=>v.split(' ')[0]))).sort()

export default function MotorStep1(){
  const {motorData,updateMotor,setStep,heroPrefill,setHeroPrefill}=useQuoteStore()
  const [mode,setMode]=useState<'lookup'|'new'>(motorData.isNewCar?'new':'lookup')
  const [lookupState,setLookupState]=useState<LookupState>(motorData.lookupVerified?'found':'idle')
  const [inputValue,setInputValue]=useState(motorData.registrationNumber)
  const [error,setError]=useState('')
  const [make,setMake]=useState(motorData.vehicleMakeModel.split(' ')[0]||'')
  const [model,setModel]=useState(motorData.vehicleMakeModel.split(' ').slice(1).join(' ')||'')
  const prefillConsumed=useRef(false)
  const models=useMemo(()=>VEHICLE_SUGGESTIONS.filter(v=>v.startsWith(`${make} `)).map(v=>v.slice(make.length+1)).sort(),[make])

  async function runLookup(raw:string){
    const plate=raw.trim().toUpperCase(); if(!plate)return
    setLookupState('loading');setError('');updateMotor({registrationNumber:plate,lookupVerified:false,isNewCar:false})
    try{
      const verified=await lookupVehicleByPlate(plate)
      if(!verified.fields.vehicleMakeModel)throw new Error('No vehicle details were returned for that registration number.')
      updateMotor({...verified.fields,registrationNumber:plate,lookupVerified:true,isNewCar:false})
      setLookupState('found')
    }catch(e){
      setLookupState('error')
      setError(e instanceof Error?e.message:'Vehicle lookup is unavailable right now. Please try again or enter the details manually.')
    }
  }

  useEffect(()=>{
    if(prefillConsumed.current||heroPrefill?.product!=='motor')return
    prefillConsumed.current=true;const value=heroPrefill.value;setHeroPrefill(null)
    queueMicrotask(()=>{if(value===NEW_CAR_PREFILL){startNewCar()}else{setInputValue(value);void runLookup(value)}})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[heroPrefill])

  function startNewCar(){setMode('new');setLookupState('idle');setError('');setInputValue('');setMake('');setModel('');updateMotor({isNewCar:true,lookupVerified:false,registrationNumber:'',vehicleMakeModel:'',yearOfManufacture:null,vehicleVariant:'',vehicleType:'',fuelType:'',vehicleColour:'',engineCapacity:'',chassisVIN:'',mileageKm:0})}
  function manualEntry(){updateMotor({registrationNumber:inputValue.trim().toUpperCase(),lookupVerified:false,isNewCar:false,vehicleMakeModel:''});setStep('motor',2)}
  function updateNew(patch:Parameters<typeof updateMotor>[0]){updateMotor({isNewCar:true,lookupVerified:false,...patch})}

  if(mode==='new')return <div className="space-y-6">
    <button type="button" onClick={()=>{setMode('lookup');updateMotor({isNewCar:false})}} className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"><ArrowLeft size={16}/> Use a registration plate instead</button>
    <div className="grid gap-5">
      <Select label="Car Brand (Make)" required value={make} options={makeNames.map(x=>({value:x,label:x}))} onChange={v=>{setMake(v);setModel('');updateNew({vehicleMakeModel:v,vehicleVariant:'',vehicleType:''})}} placeholder="Select make" productColor="#005B3B"/>
      <Select label="Model" required value={model} options={models.map(x=>({value:x,label:x}))} onChange={v=>{setModel(v);updateNew({vehicleMakeModel:`${make} ${v}`.trim(),vehicleVariant:'',vehicleType:''})}} placeholder={make?'Select model':'Select make first'} disabled={!make} productColor="#005B3B"/>
      <div className="grid sm:grid-cols-2 gap-5"><Select label="Model year" required value={motorData.yearOfManufacture?String(motorData.yearOfManufacture):''} options={years.map(x=>({value:x,label:x}))} onChange={v=>updateNew({yearOfManufacture:Number(v)})} placeholder="Select year" disabled={!model} productColor="#005B3B"/><Select label="Vehicle type" required value={motorData.vehicleType} options={VEHICLE_TYPES.map(x=>({value:x,label:x}))} onChange={v=>updateNew({vehicleType:v})} placeholder="Select vehicle type" disabled={!model} productColor="#005B3B"/></div>
      <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Variant / trim <span className="font-normal text-slate-400">(if known)</span></label><input className="h-12 w-full rounded-xl border border-slate-300 px-4 outline-none focus:border-emerald-700" value={motorData.vehicleVariant} onChange={e=>updateNew({vehicleVariant:e.target.value})} disabled={!model} placeholder="e.g. XLE, Sport, Premium"/></div>
    </div>
    {motorData.vehicleMakeModel?<div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"><VehiclePreview data={motorData} compact/></div>:<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><Car className="mx-auto text-slate-300" size={36}/><p className="font-semibold mt-3">Your car will appear here</p><p className="text-xs text-slate-500 mt-1">Select a make and model to build your vehicle summary.</p></div>}
  </div>

  return <div className="space-y-5">
    {lookupState==='found'&&motorData.lookupVerified?<>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex gap-4"><CheckCircle2 className="text-emerald-600 shrink-0" size={28}/><div><h3 className="font-bold text-lg text-emerald-900">Vehicle found</h3><p className="text-sm text-emerald-800">These details came from the registry. Review them before continuing.</p></div></div>
      <VehiclePreview data={motorData}/>
      <div className="flex flex-wrap gap-3"><button type="button" onClick={()=>setStep('motor',2)} className="rounded-xl border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-800">Edit details</button><button type="button" onClick={()=>{setLookupState('idle');setInputValue('');updateMotor({lookupVerified:false,vehicleMakeModel:''})}} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold">Search again</button></div>
    </>:<>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 text-center"><span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Car size={27}/></span><h3 className="text-xl font-bold">Enter your plate number</h3><p className="mt-1 text-sm text-slate-500">We’ll request your vehicle details from the configured registry service.</p>
        <div className="mt-5 flex rounded-xl border border-slate-300 bg-white focus-within:border-emerald-700 focus-within:ring-4 focus-within:ring-emerald-50"><span className="m-1 grid min-w-14 place-items-center rounded-lg bg-emerald-700 text-sm font-bold text-white">NG</span><input aria-label="Registration plate" className="h-12 min-w-0 flex-1 px-3 uppercase tracking-widest outline-none" value={inputValue} onChange={e=>{setInputValue(e.target.value.toUpperCase());setError('');setLookupState('idle')}} onKeyDown={e=>e.key==='Enter'&&void runLookup(inputValue)} placeholder="e.g. LAG-123-AA"/></div>
        <button type="button" onClick={()=>void runLookup(inputValue)} disabled={!inputValue.trim()||lookupState==='loading'} className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 font-bold text-white disabled:opacity-45">{lookupState==='loading'?<><Loader2 className="animate-spin" size={18}/>Looking up vehicle…</>:<><Search size={18}/>Find my car</>}</button>
        <p className="mt-3 text-xs text-slate-500">Don’t have the plate handy? <button type="button" onClick={manualEntry} className="font-semibold text-emerald-800 underline">Enter details manually</button></p>
      </div>
      {error&&<div role="alert" className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertCircle className="shrink-0" size={19}/><div><strong>We couldn’t verify that vehicle.</strong><p className="mt-1">{error}</p></div></div>}
      <div className="flex items-center gap-3"><span className="h-px flex-1 bg-slate-200"/><span className="text-xs font-semibold uppercase text-slate-400">or</span><span className="h-px flex-1 bg-slate-200"/></div>
      <button type="button" onClick={startNewCar} className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 p-4 text-left hover:border-emerald-500"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Sparkles size={21}/></span><span className="flex-1"><strong className="block">Brand-new car — no plate number yet?</strong><span className="text-xs text-slate-500">Select the vehicle from the existing catalogue.</span></span><ShieldCheck size={18} className="text-emerald-700"/></button>
    </>}
  </div>
}
