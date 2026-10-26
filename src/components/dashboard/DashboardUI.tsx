'use client'
import Image from 'next/image'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import { Headphones, X, ShieldCheck, type LucideIcon } from 'lucide-react'
import s from './dashboard.module.css'

export function PageHeading({ title, sub, children, photo = false }: { title: string; sub: string; children?: React.ReactNode; photo?: boolean }) {
  return <header className={`${s.pageHeading} ${photo?s.headingPhoto:''}`}>{photo&&<Image src="/dashboard/welcome.webp" alt="" fill sizes="(max-width:700px) 100vw, 60vw"/>}<div><h1>{title}</h1><p>{sub}</p></div>{children}</header>
}
export function IconTile({ icon: Icon, tone = 'green' }: { icon: LucideIcon; tone?: string }) { return <span className={`${s.iconTile} ${s[tone]??''}`}><Icon size={23}/></span> }
export function Status({ children, tone = 'green' }: { children: React.ReactNode; tone?: string }) { return <span className={`${s.status} ${s[tone]??''}`}>{children}</span> }
export function CardHeading({ icon, title, sub, children }: { icon: LucideIcon; title: string; sub?: string; children?: React.ReactNode }) { return <div className={s.cardHeading}><IconTile icon={icon}/><div><h2>{title}</h2>{sub&&<p>{sub}</p>}</div>{children}</div> }
export function HelpCard({ title = 'Need a hand?', text = 'Our team can help you find the right next step.' }: { title?: string; text?: string }) { return <section className={`${s.card} ${s.help}`}><div className={s.cardHeading}><IconTile icon={Headphones}/><div><h3>{title}</h3><p>{text}</p></div></div><div className={s.actions}><a className={s.secondary} href="https://wa.me/2348001234567" target="_blank" rel="noreferrer">Chat on WhatsApp</a><Link className={s.secondary} href="/contact">Contact us</Link></div></section> }
export function DashboardModal({ title, open, onClose, children }: { title: string; open: boolean; onClose: ()=>void; children: React.ReactNode }) { return <Dialog.Root open={open} onOpenChange={v=>!v&&onClose()}><Dialog.Portal><Dialog.Overlay className={s.modalOverlay}/><Dialog.Content className={s.modal}><div className={s.modalHeading}><Dialog.Title>{title}</Dialog.Title><Dialog.Close aria-label="Close dialog"><X size={21}/></Dialog.Close></div><Dialog.Description className={s.srOnly}>Review the account information below.</Dialog.Description><div className={s.modalBody}>{children}</div></Dialog.Content></Dialog.Portal></Dialog.Root> }
export function DemoDocumentNotice({ name }: { name: string }) { return <div className={s.empty}><IconTile icon={ShieldCheck}/><h3>{name}</h3><p>This seeded demo record has no downloadable file attached. Uploaded files can be viewed or downloaded during the current session.</p></div> }
export const policyImages: Record<string,string> = { motor:'/motor/city-suv.webp',medical:'/medical/doctor.webp',business:'/business/building.webp',travel:'/travel/coast.webp' }
export const dateLabel = (date: string) => new Date(date).toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'})
export const daysUntil = (date: string, now: number) => Math.ceil((new Date(date).getTime()-now)/86400000)
