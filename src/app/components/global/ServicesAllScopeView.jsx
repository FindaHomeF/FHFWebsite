'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ServicesFilterWrapper from './ServicesFilterWrapper'

const readLocalJson = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(stored) ? stored : fallback
  } catch {
    return fallback
  }
}

const toNumberPrice = (value) => {
  if (typeof value === 'number') return value
  const parsed = Number(String(value ?? '').replace(/[^\d.]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

const mapLocalService = (service, index) => ({
  id: service.id || service._id || `local-service-${index}`,
  serviceId: String(service.id || service._id || index + 1),
  title: service.title || service.serviceName || 'Untitled Service',
  category: service.category || 'Others',
  featured: Boolean(service.featured || service.isPremium || service.verified),
  datePosted: service.createdAt ? new Date(service.createdAt) : new Date(),
  price: toNumberPrice(service.price || service.minPrice || 0),
  rating: Number(service.rating || 4.0),
  location: service.location || 'FUTA Area',
  verified: Boolean(service.verified ?? true),
  ownerId: service.ownerId || service.owner_id || service.userId || service.user_id || service.artisanId,
  ownerEmail: service.ownerEmail || service.owner_email || service.email,
})

export default function ServicesAllScopeView({ mockItems = [] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const scope = searchParams.get('scope') === 'my' ? 'my' : 'all'

  const currentUser = useMemo(() => {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null')
    } catch {
      return null
    }
  }, [])

  const userScopedItems = useMemo(() => {
    const localServices = readLocalJson('services', []).map(mapLocalService)
    const allItems = [...mockItems, ...localServices]

    if (scope !== 'my') return allItems

    const userId = String(currentUser?.id ?? currentUser?.user_id ?? currentUser?.pk ?? '')
    const userEmail = String(currentUser?.email || '').toLowerCase()

    return allItems.filter((item) => {
      const ownerId = String(item.ownerId || '')
      const ownerEmail = String(item.ownerEmail || '').toLowerCase()
      if (userId && ownerId) return ownerId === userId
      if (userEmail && ownerEmail) return ownerEmail === userEmail
      return false
    })
  }, [scope, currentUser, mockItems])

  const setScope = (nextScope) => {
    const params = new URLSearchParams(searchParams.toString())
    if (nextScope === 'all') {
      params.delete('scope')
    } else {
      params.set('scope', 'my')
    }
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  return <ServicesFilterWrapper items={userScopedItems} scope={scope} onScopeChange={setScope} />
}
