'use client'

import { useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import DeclutteredFilterWrapper from './DeclutteredFilterWrapper'

const readLocalJson = (key, fallback = []) => {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(stored) ? stored : fallback
  } catch {
    return fallback
  }
}

const mapLocalItem = (item, index) => ({
  id: item.id || item._id || `local-item-${index}`,
  image: item.images?.[0]?.image || item.images?.[0] || item.image || '/declutter1.png',
  itemId: String(item.id || item._id || index + 1),
  title: item.title || 'Untitled Item',
  category: item.category || 'Others',
  featured: Boolean(item.featured || item.is_featured),
  datePosted: item.createdAt ? new Date(item.createdAt) : new Date(),
  price: Number(item.price || 0),
  condition: item.condition || 'Good',
  status: item.status || 'Available',
  inventory: Number(item.inventory || 1),
  ownerId: item.ownerId || item.owner_id || item.userId || item.user_id || item.studentId || item.agentId,
  ownerEmail: item.ownerEmail || item.owner_email || item.email,
})

export default function DeclutteringAllScopeView({ mockItems = [] }) {
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
    const localDeclutterItems = readLocalJson('declutteredItems', []).map(mapLocalItem)
    const allItems = [...mockItems, ...localDeclutterItems]

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
    <DeclutteredFilterWrapper
      items={userScopedItems}
      scope={scope}
      onScopeChange={setScope}
    />
  )
}
