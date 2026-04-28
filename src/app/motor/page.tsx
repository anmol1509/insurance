import type { Metadata } from 'next'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Tag from '@/components/ui/Tag'
import PlanCard from '@/components/ui/PlanCard'
import MotorProductPage from '@/components/product/MotorProductPage'

export const metadata: Metadata = {
  title: 'Motor Insurance',
  description:
    'Get motor insurance quotes online. Comprehensive, TPO, and TPF&T. NIID-registered certificate in 3 minutes. From ₦15,000/year.',
}

export default function MotorPage() {
  return <MotorProductPage />
}
