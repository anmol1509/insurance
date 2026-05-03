'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import BottomNav from './BottomNav'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import LiveChat from '@/components/ui/LiveChat'
import CookieBanner from '@/components/ui/CookieBanner'

const CHROME_HIDDEN_PREFIXES = ['/dashboard', '/login', '/register', '/admin', '/quote']
const BOTTOM_NAV_HIDDEN_PREFIXES = ['/quote', '/dashboard', '/admin', '/login', '/register']
const FLOATING_HIDDEN_PREFIXES = ['/login', '/register', '/admin']

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideChrome = CHROME_HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))
  const showBottomNav = !BOTTOM_NAV_HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))
  const hideFloating = FLOATING_HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))

  return (
    <>
      {!hideChrome && <Navbar />}
      <main className={showBottomNav ? 'pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0' : undefined}>
        {children}
      </main>
      {!hideChrome && <Footer />}
      {showBottomNav && <BottomNav />}
      {!hideFloating && <WhatsAppButton />}
      {!hideFloating && <LiveChat />}
      <CookieBanner />
    </>
  )
}
