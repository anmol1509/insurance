'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Shield, FileText, Clock, FolderOpen, Settings, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Logo from '@/components/ui/Logo'
import s from './dashboard.module.css'
const NAV=[{label:'Overview',href:'/dashboard',icon:LayoutDashboard},{label:'My Policies',href:'/dashboard/policies',icon:Shield},{label:'Claims',href:'/dashboard/claims',icon:FileText},{label:'Quote History',href:'/dashboard/quotes',icon:Clock},{label:'Documents',href:'/dashboard/documents',icon:FolderOpen},{label:'Settings',href:'/dashboard/settings',icon:Settings}]
function Sidebar({ onNav }: { onNav?:()=>void }){
  const pathname=usePathname();const router=useRouter();const {user,logout}=useAuthStore()
  return <div className={s.sidebarInner}><div className={s.sidebarBrand}><Logo size={30}/></div><nav className={s.nav} aria-label="Dashboard navigation">{NAV.map(({label,href,icon:Icon})=><Link key={href} href={href} onClick={onNav} aria-current={pathname===href?'page':undefined} className={`${s.navItem} ${pathname===href?s.active:''}`}><Icon size={19}/>{label}{pathname===href&&<ChevronRight size={15}/>}</Link>)}</nav><div className={s.account}><div className={s.user}><span className={s.avatar}>{user?.initials||'You'}</span><div><strong>{user?.name}</strong><small>{user?.email||user?.phone}</small></div></div><button className={s.logout} type="button" onClick={()=>{logout();router.push('/login')}}><LogOut size={18}/>Sign out</button></div></div>
}
export default function DashboardLayout({children}:{children:React.ReactNode}){
 const [open,setOpen]=useState(false);const pathname=usePathname();const title=NAV.find(n=>n.href===pathname)?.label??'Your dashboard'
 return <div className={s.shell}><aside className={s.sidebar}><Sidebar/></aside>{open&&<><button type="button" className={s.mobileOverlay} aria-label="Close dashboard menu" onClick={()=>setOpen(false)}/><aside className={s.mobileSidebar}><button type="button" aria-label="Close dashboard menu" onClick={()=>setOpen(false)} style={{position:'absolute',right:12,top:24}}><X size={20}/></button><Sidebar onNav={()=>setOpen(false)}/></aside></>}<div className={s.main}><div className={s.mobileBar}><button type="button" onClick={()=>setOpen(true)} aria-expanded={open}><Menu size={20}/>Dashboard menu</button><span>{title}</span></div><main>{children}</main></div></div>
}
