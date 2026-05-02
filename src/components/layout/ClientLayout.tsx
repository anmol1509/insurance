'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import LiveChat from '@/components/ui/LiveChat'
import CookieBanner from '@/components/ui/CookieBanner'

const CHROME_HIDDEN_PREFIXES = ['/dashboard', '/login', '/register', '/admin']

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideChrome = CHROME_HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))

  return (
    <>
      {!hideChrome && <Navbar />}
      <main>{children}</main>
      {!hideChrome && <Footer />}
      {!hideChrome && <WhatsAppButton />}
      {!hideChrome && <LiveChat />}
      <CookieBanner />
    </>
  )
}
