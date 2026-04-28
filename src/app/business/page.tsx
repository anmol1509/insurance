import type { Metadata } from 'next'
import BusinessProductPage from '@/components/product/BusinessProductPage'

export const metadata: Metadata = {
  title: 'Business Insurance',
  description: 'Fire & perils, burglary, liability, and group personal accident for Nigerian businesses. Build your custom cover.',
}

export default function BusinessPage() {
  return <BusinessProductPage />
}
