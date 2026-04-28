import type { Metadata } from 'next'
import TravelProductPage from '@/components/product/TravelProductPage'

export const metadata: Metadata = {
  title: 'Travel Insurance',
  description: 'Schengen-compliant travel insurance. Medical emergencies, baggage protection, trip cancellation. Certificate ready for visa applications.',
}

export default function TravelPage() {
  return <TravelProductPage />
}
