'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getDashboardPathByRole } from '@/lib/auth-redirects'

export default function AuthLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const accessToken = localStorage.getItem('fhf-access-token') || localStorage.getItem('access_token')
    const refreshToken =
      localStorage.getItem('fhf-refresh-token') || localStorage.getItem('refresh_token')

    if (!accessToken && !refreshToken) return

    const role = JSON.parse(localStorage.getItem('currentUser') || 'null')?.role
    const dashboardPath = getDashboardPathByRole(role)

    if (pathname?.startsWith('/auth')) {
      router.replace(dashboardPath)
    }
  }, [pathname, router])

  return children
}
