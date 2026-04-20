import { queryOptions } from '@tanstack/react-query'
import { mockApartments } from './mockData'
import { fetchFromStorage } from './query-options'

const convertMockApartmentsToProperties = () => {
  return mockApartments.map((apt) => ({
    id: apt.propertyId || apt.id.toString(),
    propertyId: apt.propertyId || apt.id.toString(),
    title: apt.title,
    price: `₦${apt.price.toLocaleString()}`,
    category: apt.category,
    location: apt.location,
    condition: 'Good',
    room: apt.bedrooms,
    bathroom: apt.bathrooms,
    inventory: apt.inventory,
    status: 'Active',
    images: [apt.image, '/listing2.png', '/listing3.png', '/listing4.png', '/listing1.png'],
    featured: apt.featured,
    datePosted: apt.datePosted,
    agentId: null,
    studentId: null,
    isPremium: false,
    roommatesNeeded: null,
    currentRoommates: null,
    totalCapacity: null,
  }))
}

export const filterProperties = (properties, filters = {}) => {
  return properties.filter((prop) => {
    if (
      filters.search &&
      !prop.title?.toLowerCase().includes(filters.search.toLowerCase()) &&
      !prop.location?.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }
    if (filters.category && filters.category !== 'all' && prop.category !== filters.category) {
      return false
    }
    if (filters.status && filters.status !== 'all' && prop.status !== filters.status) {
      return false
    }
    if (filters.agentId && prop.agentId !== filters.agentId) {
      return false
    }
    if (filters.studentId && prop.studentId !== filters.studentId) {
      return false
    }
    return true
  })
}

export const propertiesQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: ['properties', filters],
    queryFn: () => {
      const stored = fetchFromStorage('properties', [])
      let data = stored.length === 0 ? convertMockApartmentsToProperties() : stored

      if (Object.keys(filters).length > 0) {
        data = filterProperties(data, filters)
      }

      return data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export const propertyQueryOptions = (id) => {
  return queryOptions({
    queryKey: ['properties', id],
    queryFn: async () => {
      const stored = fetchFromStorage('properties', [])
      const data = stored.length === 0 ? convertMockApartmentsToProperties() : stored
      return data.find((p) => p.id === id || p.propertyId === id)
    },
  })
}
