'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const DISABLE_ROUTE_PROTECTION = true

const PROTECTED_PREFIXES = ['/admin', '/student', '/agent', '/artisan', '/settings']

const hasAuthSession = () => {
  const accessToken = localStorage.getItem('fhf-access-token') || localStorage.getItem('access_token')
  const refreshToken = localStorage.getItem('fhf-refresh-token') || localStorage.getItem('refresh_token')
  return Boolean(accessToken || refreshToken)
}

const isProtectedPath = (pathname = '') => {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

const AuthSessionGuard = () => {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (DISABLE_ROUTE_PROTECTION) return

    const enforceSession = () => {
      if (!pathname || !isProtectedPath(pathname)) return
      if (!hasAuthSession()) {
        router.replace('/auth')
      }
    }

    const handleStorageChange = () => enforceSession()
    const handleAuthCleared = () => enforceSession()
    const handleWindowFocus = () => enforceSession()

    enforceSession()
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('fhf-auth-cleared', handleAuthCleared)
    window.addEventListener('focus', handleWindowFocus)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('fhf-auth-cleared', handleAuthCleared)
      window.removeEventListener('focus', handleWindowFocus)
    }
  }, [pathname, router])

  return null
}

export default AuthSessionGuard
