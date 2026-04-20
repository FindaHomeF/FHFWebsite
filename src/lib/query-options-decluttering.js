import { queryOptions } from '@tanstack/react-query'
import { mockDeclutteredItems } from './mockData'
import { fetchFromStorage } from './query-options'
import { getMyDeclutteringListings } from './auth-api'

const LISTINGS_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fhf-backend.onrender.com'
const LISTINGS_PROPERTIES_ENDPOINT = `${LISTINGS_API_BASE_URL}/api/listings/properties/`

const DECLUTTER_CONDITION_MAP = {
  New: 'NEW',
  'Like New': 'LIKE_NEW',
  Good: 'GOOD',
  Fair: 'FAIR',
  Used: 'POOR',
  Poor: 'POOR',
  'N/A': 'N/A',
}

const DECLUTTER_STATUS_MAP = {
  Available: 'ACTIVE',
  Reserved: 'PENDING_APPROVAL',
  Sold: 'SOLD',
}

const convertMockItemsToDecluttered = () => {
  return mockDeclutteredItems.map((item) => ({
    id: item.itemId || `#D${item.id.toString().padStart(3, '0')}`,
    title: item.title,
    price: `₦${item.price.toLocaleString()}`,
    category: item.category,
    condition: item.condition,
    location: 'North Gate, Akure',
    sellerName: 'Student Seller',
    description: `Quality ${item.title} in ${item.condition} condition`,
    inventory: item.inventory,
    status: item.status,
    images: [item.image, '/declutter1.png', '/declutter1.png', '/declutter1.png', '/declutter1.png'],
    agentId: null,
    studentId: null,
    isPremium: item.featured,
    datePosted: item.datePosted,
  }))
}

const toMinorUnits = (value) => {
  if (value === null || value === undefined || value === '') return null
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return null
  return Math.round(numeric * 100)
}

const normalizeDeclutteringCondition = (value) => {
  if (!value) return null
  return DECLUTTER_CONDITION_MAP[value] || value
}

const normalizeDeclutteringStatus = (value) => {
  if (!value) return null
  return DECLUTTER_STATUS_MAP[value] || value
}

const normalizeBackendPrice = (price) => {
  if (!Number.isFinite(Number(price))) return price
  const numericPrice = Number(price)
  return numericPrice >= 1000 ? Math.round(numericPrice / 100) : numericPrice
}

const toNumericListingId = (id) => {
  if (id === null || id === undefined) return null
  const normalized = String(id).trim().replace(/^#D/i, '')
  if (!/^\d+$/.test(normalized)) return null
  const parsed = Number(normalized)
  return Number.isInteger(parsed) ? parsed : null
}

const extractListingImages = (images) => {
  if (!Array.isArray(images)) return []
  return images
    .map((entry) => {
      if (typeof entry === 'string') return entry
      if (!entry || typeof entry !== 'object') return null
      return entry.image || entry.url || entry.src || null
    })
    .filter(Boolean)
}

const normalizeDeclutteringListing = (listing = {}) => {
  const normalizedPrice = normalizeBackendPrice(listing.price)
  const normalizedImages = extractListingImages(listing.images)
  return {
    ...listing,
    id: listing.id || listing.item_id || listing.property_id,
    itemId: listing.item_id || listing.id || listing.property_id,
    title: listing.title || listing.name || 'Untitled Item',
    category: listing.category || listing.property_type || 'Others',
    condition: listing.condition || 'N/A',
    status: listing.status || 'ACTIVE',
    location: listing.location || '',
    price: Number.isFinite(Number(normalizedPrice)) ? Number(normalizedPrice) : normalizedPrice,
    priceDisplay: listing.price_display || null,
    contactInfo: listing.contact_info || '',
    ownerId: listing.owner ?? null,
    ownerName: listing.owner_name || '',
    ownerEmail: listing.owner_email || '',
    features: listing.features || {},
    viewStats: listing.view_stats || {},
    priceHistory: Array.isArray(listing.price_history) ? listing.price_history : [],
    createdAt: listing.created_at || null,
    updatedAt: listing.updated_at || null,
    deletedAt: listing.deleted_at || null,
    isDeleted: Boolean(listing.is_deleted),
    daysSinceDeletion:
      listing.days_since_deletion !== undefined && listing.days_since_deletion !== null
        ? Number(listing.days_since_deletion)
        : null,
    featured: listing.is_featured ?? listing.featured ?? false,
    isNegotiable: listing.is_negotiable ?? false,
    images: normalizedImages.length > 0 ? normalizedImages : listing.image ? [listing.image] : [],
  }
}

const buildDeclutteringQueryParams = (filters = {}) => {
  const params = new URLSearchParams()
  params.set('property_type', 'ITEM')

  if (filters.page) params.set('page', String(filters.page))
  if (filters.currency) params.set('currency', String(filters.currency))
  if (typeof filters.is_featured === 'boolean') params.set('is_featured', String(filters.is_featured))
  if (typeof filters.is_negotiable === 'boolean') params.set('is_negotiable', String(filters.is_negotiable))

  if (filters.location) {
    params.set('location', String(filters.location))
  } else if (filters.search) {
    params.set('location', String(filters.search))
  }

  const selectedCondition = Array.isArray(filters.condition) ? filters.condition[0] : filters.condition
  const normalizedCondition = normalizeDeclutteringCondition(selectedCondition)
  if (normalizedCondition) params.set('condition', normalizedCondition)

  const selectedStatus = Array.isArray(filters.status)
    ? filters.status[0]
    : Array.isArray(filters.availability)
    ? filters.availability[0]
    : filters.status || filters.availability
  const normalizedStatus = normalizeDeclutteringStatus(selectedStatus)
  if (normalizedStatus) params.set('status', normalizedStatus)

  const minFromRange = Array.isArray(filters.priceRange) ? filters.priceRange[0] : null
  const maxFromRange = Array.isArray(filters.priceRange) ? filters.priceRange[1] : null
  const minMinorUnits = toMinorUnits(filters.min_price ?? minFromRange)
  const maxMinorUnits = toMinorUnits(filters.max_price ?? maxFromRange)

  if (minMinorUnits !== null) params.set('min_price', String(minMinorUnits))
  if (maxMinorUnits !== null) params.set('max_price', String(maxMinorUnits))

  return params
}

const fetchDeclutteringListings = async (filters = {}) => {
  const params = buildDeclutteringQueryParams(filters)
  const endpoint = `${LISTINGS_PROPERTIES_ENDPOINT}?${params.toString()}`
  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error(`Failed to fetch decluttering listings (${response.status})`)
  }
  const payload = await response.json()
  const listings = Array.isArray(payload) ? payload : Array.isArray(payload?.results) ? payload.results : []
  return listings.map(normalizeDeclutteringListing)
}

const fetchMyDeclutteringListings = async (filters = {}) => {
  const payload = await getMyDeclutteringListings(filters)
  const listings = Array.isArray(payload) ? payload : Array.isArray(payload?.results) ? payload.results : []
  return listings.map(normalizeDeclutteringListing)
}

const normalizeViewStats = (stats = {}) => {
  return {
    total_views: Number(stats?.total_views ?? 0),
    unique_viewers: Number(stats?.unique_viewers ?? 0),
    views_24h: Number(stats?.views_24h ?? 0),
    unique_viewers_24h: Number(stats?.unique_viewers_24h ?? 0),
  }
}

const fetchDeclutteringListingViewStats = async (id) => {
  const listingId = toNumericListingId(id)
  if (listingId === null) {
    throw new Error('Invalid listing id for view stats')
  }

  const endpoint = `${LISTINGS_PROPERTIES_ENDPOINT}${listingId}/view_stats/`
  const response = await fetch(endpoint)
  if (!response.ok) {
    throw new Error(`Failed to fetch listing view stats (${response.status})`)
  }
  const payload = await response.json()
  return normalizeViewStats(payload)
}

export const filterItems = (items, filters = {}) => {
  return items.filter((item) => {
    const normalizedCondition = normalizeDeclutteringCondition(item.condition)
    const normalizedStatus = normalizeDeclutteringStatus(item.status)
    const normalizedPrice = Number.isFinite(Number(item.price)) ? toMinorUnits(Number(item.price)) : null

    if (
      filters.search &&
      !item.title?.toLowerCase().includes(filters.search.toLowerCase()) &&
      !item.location?.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }
    if (filters.category && filters.category !== 'all' && item.category !== filters.category) {
      return false
    }
    if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
      return false
    }
    if (Array.isArray(filters.availability) && filters.availability.length > 0) {
      const statusFilters = filters.availability.map(normalizeDeclutteringStatus)
      if (!statusFilters.includes(normalizedStatus)) {
        return false
      }
    }
    if (Array.isArray(filters.condition) && filters.condition.length > 0) {
      const conditionFilters = filters.condition.map(normalizeDeclutteringCondition)
      if (!conditionFilters.includes(normalizedCondition)) {
        return false
      }
    }
    if (typeof filters.is_featured === 'boolean' && Boolean(item.featured) !== filters.is_featured) {
      return false
    }
    if (typeof filters.is_negotiable === 'boolean' && Boolean(item.isNegotiable) !== filters.is_negotiable) {
      return false
    }
    if (filters.location && !item.location?.toLowerCase().includes(String(filters.location).toLowerCase())) {
      return false
    }
    const minFromRange = Array.isArray(filters.priceRange) ? filters.priceRange[0] : null
    const maxFromRange = Array.isArray(filters.priceRange) ? filters.priceRange[1] : null
    const minMinorUnits = toMinorUnits(filters.min_price ?? minFromRange)
    const maxMinorUnits = toMinorUnits(filters.max_price ?? maxFromRange)
    if (minMinorUnits !== null && normalizedPrice !== null && normalizedPrice < minMinorUnits) {
      return false
    }
    if (maxMinorUnits !== null && normalizedPrice !== null && normalizedPrice > maxMinorUnits) {
      return false
    }
    if (filters.agentId && item.agentId !== filters.agentId) {
      return false
    }
    if (filters.studentId && item.studentId !== filters.studentId) {
      return false
    }
    return true
  })
}

export const itemsQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: ['items', filters],
    queryFn: async () => {
      try {
        return await fetchDeclutteringListings(filters)
      } catch {
        const stored = fetchFromStorage('items', [])
        let data = stored.length === 0 ? convertMockItemsToDecluttered() : stored
        if (Object.keys(filters).length > 0) {
          data = filterItems(data, filters)
        }
        return data
      }
    },
    staleTime: 1000 * 60 * 5,
  })
}

export const myItemsQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: ['items', 'my', filters],
    queryFn: async () => {
      try {
        return await fetchMyDeclutteringListings(filters)
      } catch {
        const stored = fetchFromStorage('items', [])
        let data = stored.length === 0 ? convertMockItemsToDecluttered() : stored
        if (Object.keys(filters).length > 0) {
          data = filterItems(data, filters)
        }
        return data
      }
    },
    staleTime: 1000 * 60,
  })
}

export const itemQueryOptions = (id) => {
  return queryOptions({
    queryKey: ['items', id],
    queryFn: async () => {
      const listingId = toNumericListingId(id)

      if (listingId !== null) {
        try {
          const endpoint = `${LISTINGS_PROPERTIES_ENDPOINT}${listingId}/`
          const response = await fetch(endpoint)
          if (response.ok) {
            const payload = await response.json()
            return normalizeDeclutteringListing(payload)
          }
        } catch {
          // Fall back to local/mock item detail when API is unreachable.
        }
      }

      const stored = fetchFromStorage('items', [])
      const data = stored.length === 0 ? convertMockItemsToDecluttered() : stored
      return data.find(
        (i) =>
          String(i.id) === String(id) ||
          String(i.itemId) === String(id) ||
          toNumericListingId(i.id) === listingId ||
          toNumericListingId(i.itemId) === listingId
      )
    },
  })
}

export const itemViewStatsQueryOptions = (id) => {
  return queryOptions({
    queryKey: ['items', id, 'view-stats'],
    queryFn: async () => {
      const listingId = toNumericListingId(id)

      if (listingId !== null) {
        try {
          return await fetchDeclutteringListingViewStats(listingId)
        } catch {
          // Fall through to listing payload / local fallback.
        }
      }

      try {
        const item = await itemQueryOptions(id).queryFn()
        if (item?.viewStats) {
          return normalizeViewStats(item.viewStats)
        }
      } catch {
        // Fall through to static placeholder values.
      }

      return normalizeViewStats()
    },
    staleTime: 1000 * 60,
  })
}
