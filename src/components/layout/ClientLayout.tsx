'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import { HomeFooter } from '@/components/home/HomeChrome'
import Footer from './Footer'
import BottomNav from './BottomNav'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import LiveChat from '@/components/ui/LiveChat'
import CookieBanner from '@/components/ui/CookieBanner'
import DemoBanner from './DemoBanner'
import motorStyles from '@/components/product/motorLanding.module.css'

const FOOTER_HIDDEN_PREFIXES = [
  '/dashboard',
  '/login',
  '/register',
  '/admin',
  '/quote',
]
const BOTTOM_NAV_HIDDEN_PREFIXES = [
  '/quote',
  '/dashboard',
  '/admin',
  '/login',
  '/register',
]

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isProductLanding = ['/motor', '/medical', '/travel', '/business'].includes(pathname)
  const hideFooter = FOOTER_HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))
  const showBottomNav =
    !isHome && !BOTTOM_NAV_HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))

  return (
    <>
      <DemoBanner />
      <Navbar />
      <main
        className={
          showBottomNav
            ? 'pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0'
            : undefined
        }
      >
        {children}
      </main>
      {!hideFooter && (isHome ? <HomeFooter /> : isProductLanding ? <div className={motorStyles.footer}><HomeFooter /></div> : <Footer />)}
      {showBottomNav && <BottomNav />}
      <WhatsAppButton />
      <LiveChat />
      <CookieBanner />
    </>
  )
}
