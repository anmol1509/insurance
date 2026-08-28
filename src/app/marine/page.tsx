import type { Metadata } from 'next'
import MarineProductPage from '@/components/product/MarineProductPage'

export const metadata: Metadata = {
  title: 'Marine Cargo Insurance',
  description:
    'Insure cargo in transit by sea, air, or land. Import, export and local transit cover underwritten directly by NSIA Insurance, priced live in minutes.',
}

export default function MarinePage() {
  return <MarineProductPage />
}
