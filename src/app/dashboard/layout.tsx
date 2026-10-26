'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useHydrated } from '@/lib/useHydrated'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const router = useRouter()
  const hydrated = useHydrated()

  useEffect(() => {
    if (hydrated && !user) router.replace('/login')
  }, [user, router, hydrated])

  if (!hydrated || !user) return null

  return <DashboardLayout>{children}</DashboardLayout>
}
