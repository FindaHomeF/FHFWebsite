import { queryOptions } from '@tanstack/react-query'
import { mockServices } from './mockData'
import { fetchFromStorage } from './query-options'

const convertMockServicesToServices = () => {
  return mockServices.map((svc) => ({
    id: svc.serviceId || svc.id.toString(),
    artisanId: null,
    serviceName: svc.title,
    category: svc.category,
    description: `Professional ${svc.category.toLowerCase()} services`,
    minPrice: svc.price * 0.8,
    maxPrice: svc.price * 1.2,
    price: svc.price,
    location: `${svc.location}, Akure`,
    phone: '08012345678',
    email: `contact@${svc.title.toLowerCase().replace(/\s+/g, '')}.com`,
    availability: 'available',
    status: 'Active',
    images: ['/hero-image.jpeg', '/hero-image.jpeg', '/hero-image.jpeg', '/hero-image.jpeg', '/hero-image.jpeg'],
    isPremium: svc.featured,
    verified: svc.verified,
    rating: svc.rating,
    datePosted: svc.datePosted,
  }))
}

export const filterServices = (services, filters = {}) => {
  return services.filter((service) => {
    if (
      filters.search &&
      !service.serviceName?.toLowerCase().includes(filters.search.toLowerCase()) &&
      !service.category?.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }
    if (filters.category && filters.category !== 'all' && service.category !== filters.category) {
      return false
    }
    if (filters.status && filters.status !== 'all' && service.status !== filters.status) {
      return false
    }
    if (filters.artisanId && service.artisanId !== filters.artisanId) {
      return false
    }
    return true
  })
}

export const servicesQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: ['services', filters],
    queryFn: () => {
      const stored = fetchFromStorage('services', [])
      let data = stored.length === 0 ? convertMockServicesToServices() : stored

      if (Object.keys(filters).length > 0) {
        data = filterServices(data, filters)
      }

      return data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export const serviceQueryOptions = (id) => {
  return queryOptions({
    queryKey: ['services', id],
    queryFn: async () => {
      const stored = fetchFromStorage('services', [])
      const data = stored.length === 0 ? convertMockServicesToServices() : stored
      return data.find((s) => s.id === id || s.serviceId === id)
    },
  })
}
