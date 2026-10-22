'use client'

import Link from 'next/link'
import { Car, Check, ChevronDown, Headphones, ShieldCheck, User, X, Zap } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import { useAuthStore } from '@/store/authStore'
import { useQuoteStore } from '@/store/quoteStore'
import { MOTOR_PLANS } from '@/lib/motorPlans'
import VehiclePreview, { formatNaira } from './VehiclePreview'
import s from '../motorQuote.module.css'

interface Props {
  currentStep:number; totalSteps:number; stepTitle:string; stepSub:string
  onBack?:()=>void; onNext:()=>void; isFinalStep:boolean; nextDisabled?:boolean
  maxStep:number; onStepSelect:(step:number)=>void
  steps:readonly {id:number;label:string}[]; children:React.ReactNode
}

export default function MotorQuoteLayout({currentStep,totalSteps,stepTitle,stepSub,onBack,onNext,isFinalStep,nextDisabled,maxStep,onStepSelect,steps,children}:Props){
  const user=useAuthStore(x=>x.user)
  const motorData=useQuoteStore(x=>x.motorData)
  const plan=MOTOR_PLANS.find(p=>p.id===motorData.selectedUnderwriter)
  const isPlan=currentStep===4
  return <div className={s.flow}>
    <header className={s.header}><div className={s.headerInner}>
      <Logo size={32} href="/" />
      <div className={s.product}><Car size={18}/><strong>Motor Insurance</strong><span>·</span><span className={s.stepCount}>Step {currentStep}/{totalSteps}</span></div>
      <div className={s.account}>{user&&<div className={s.user}><span className={s.avatar}>{user.initials||<User size={13}/>}</span><span>{user.phone||user.email}</span><ChevronDown size={14}/></div>}<Link className={s.exit} href="/" aria-label="Exit quote"><X size={20}/></Link></div>
    </div></header>
    <nav className={s.rail} aria-label="Motor quote progress"><div className={s.railInner}>{steps.map((step,index)=>{const n=index+1;const state=n<currentStep?'complete':n===currentStep?'active':'';return <span key={step.id} style={{display:'contents'}}><button type="button" disabled={n>maxStep} onClick={()=>n<=maxStep&&onStepSelect(n)} className={`${s.railStep} ${state?s[state]:''}`}><span className={s.railNum}>{n<currentStep?<Check size={15}/>:n}</span><span>{step.label}</span></button>{index<steps.length-1&&<span className={s.connector}/>}</span>})}</div></nav>
    <div className={s.content}><div className={`${s.twoColumn} ${isPlan?s.plan:''}`}>
      {isPlan?<PlanSidebar data={motorData} plan={plan}/>:<ContextPanel step={currentStep} data={motorData} plan={plan}/>}
      <main className={isPlan?s.planMain:s.panel}>
        <div className={s.panelHeader}><div><h2>{stepTitle}</h2><p>{stepSub}</p></div></div>
        <div className={s.body}>{children}</div>
        <QuoteNav onBack={onBack} onNext={onNext} disabled={nextDisabled} final={isFinalStep} current={currentStep} total={totalSteps}/>
      </main>
    </div></div>
    <div className={s.mobileBar}>{onBack&&<button className={s.back} onClick={onBack}>← Back</button>}<button className={s.next} onClick={onNext} disabled={nextDisabled}>{isFinalStep?'Submit →':'Next step →'}</button></div>
  </div>
}

function ContextPanel({step,data,plan}:{step:number;data:ReturnType<typeof useQuoteStore.getState>['motorData'];plan?:typeof MOTOR_PLANS[number]}){
  const copy=step===1?(data.isNewCar?['Brand-new car','Your next car','starts here','Choose your vehicle from the existing database. No plate number needed.']:data.lookupVerified?['Vehicle found','Great! We found','your car.','Review the registry details, then continue.']:['Motor insurance','Drive with complete','confidence','Compare cover and continue with confidence.']):step===2?['Your selected car',"Let's confirm",'your car details',data.isNewCar?'Add the information from your purchase documents.':'Check the registry details and edit anything that is incorrect.']:step===3?['Your selected car','Car value &','cover type','Set an honest insured value and choose the cover you need.']:step===5?['Documents','Everything in','one place','Upload only what your selected insurer requires.']:['Final step','Review before','submitting','Confirm your information and quote details.']
  return <aside className={s.aside}><div className={s.asideCopy}><p className={s.eyebrow}>{copy[0]}</p><h1>{copy[1]} {copy[2]&&<em>{copy[2]}</em>}</h1><p className={s.asideLead}>{copy[3]}</p>
    {step===1&&!data.vehicleMakeModel&&<div className={s.benefits}><Benefit icon={ShieldCheck} text="Licensed providers"/><Benefit icon={Zap} text="Fast quotes"/><Benefit icon={Headphones} text="Claims assistance"/></div>}
    <VehiclePreview data={data}/>
    {step>=5&&plan&&<div className={s.summary}><div className={s.summaryTitle}><strong>{plan.name}</strong><span>{plan.insurer}</span></div><div className={s.specs}><Spec l="Cover" v={data.coverType==='tpo'?'Third Party':'Comprehensive'}/><Spec l="Annual premium" v={formatNaira(useQuoteStore.getState().calculatedPremium)}/></div></div>}
  </div></aside>
}
function PlanSidebar({data,plan}:{data:ReturnType<typeof useQuoteStore.getState>['motorData'];plan?:typeof MOTOR_PLANS[number]}){return <aside className={s.planAside}><div className={s.compact}><h3>Your vehicle</h3><VehiclePreview data={data} compact/><div className={s.compactRow}><span>Insured value</span><b>{formatNaira(data.carValue)}</b></div></div><div className={s.compact}><h3>Your cover preferences</h3><div className={s.compactRow}><span>Cover type</span><b>{data.coverType==='tpo'?'Third Party Only':'Comprehensive'}</b></div>{plan&&<div className={s.compactRow}><span>Selected</span><b>{plan.name}</b></div>}</div></aside>}
function Benefit({icon:Icon,text}:{icon:typeof ShieldCheck;text:string}){return <div className={s.benefit}><span className={s.benefitIcon}><Icon size={19}/></span>{text}</div>}
function Spec({l,v}:{l:string;v:string}){return <div className={s.spec}><label>{l}</label><b>{v}</b></div>}
function QuoteNav({onBack,onNext,disabled,final,current,total}:{onBack?:()=>void;onNext:()=>void;disabled?:boolean;final:boolean;current:number;total:number}){return <div className={s.nav}>{onBack&&<button className={s.back} onClick={onBack}>← Back</button>}<small>Step {current} of {total} · Motor Insurance</small><button className={s.next} onClick={onNext} disabled={disabled}>{final?'Submit →':'Next step →'}</button></div>}
