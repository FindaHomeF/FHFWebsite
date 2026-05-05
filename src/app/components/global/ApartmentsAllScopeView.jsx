'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import ApartmentsFilterWrapper from './ApartmentsFilterWrapper'

const toNumberPrice = (value) => {
  if (typeof value === 'number') return value
  const normalized = String(value ?? '')
    .replace(/[^\d.]/g, '')
    .trim()
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

const readLocalJson = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(stored) ? stored : fallback
  } catch {
    return fallback
  }
}

const mapLocalProperty = (item, index) => ({
  id: item.id || item._id || `local-property-${index}`,
  image: item.images?.[0] || item.image || '/hero-image.jpeg',
  propertyId: String(item.id || item._id || index + 1),
  title: item.title || 'Untitled Property',
  location: item.location || 'FUTA Area',
  category: item.category || 'Flat / Apartments',
  featured: Boolean(item.isPremium || item.featured),
  datePosted: item.createdAt ? new Date(item.createdAt) : new Date(),
  price: toNumberPrice(item.price),
  bedrooms: Number(item.room || item.rooms || item.bedrooms || 0),
  bathrooms: Number(item.bathroom || item.bathrooms || 0),
  inventory: Number(item.inventory || 1),
  ownerId: item.ownerId || item.owner_id || item.userId || item.user_id || item.studentId || item.agentId,
  ownerEmail: item.ownerEmail || item.owner_email || item.email,
})

export default function ApartmentsAllScopeView({ mockItems = [] }) {
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
    const localProperties = readLocalJson('properties', []).map(mapLocalProperty)
    const allItems = [...mockItems, ...localProperties]

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

  return (
    <ApartmentsFilterWrapper
      items={userScopedItems}
      scope={scope}
      onScopeChange={setScope}
    />
  )
}
