import type { Metadata } from 'next'
import MedicalProductPage from '@/components/product/MedicalProductPage'

export const metadata: Metadata = {
  title: 'Medical Insurance',
  description: 'Compare medical insurance options for individuals and families. Explore plan benefits, hospital networks and premiums with ShopInsurance.',
}

export default function MedicalPage() {
  return <MedicalProductPage />
}
