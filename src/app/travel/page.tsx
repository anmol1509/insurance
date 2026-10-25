import type { Metadata } from 'next'
import TravelProductPage from '@/components/product/TravelProductPage'

export const metadata: Metadata = {
  title: 'Travel Insurance',
  description: 'Explore travel insurance for your destination. Compare medical, baggage, cancellation and optional activity cover for your journey.',
}

export default function TravelPage() {
  return <TravelProductPage />
}
