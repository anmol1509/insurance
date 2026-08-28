import type { Metadata } from 'next'
import PersonalAccidentProductPage from '@/components/product/PersonalAccidentProductPage'

export const metadata: Metadata = {
  title: 'Personal Accident Insurance',
  description:
    'Cover for accidental death, disability, and injury. Coverage from ₦1,000,000 to ₦10,000,000, underwritten directly by NSIA Insurance.',
}

export default function PersonalAccidentPage() {
  return <PersonalAccidentProductPage />
}
