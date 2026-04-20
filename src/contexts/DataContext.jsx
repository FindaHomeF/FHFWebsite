'use client'
import { createContext, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  usersQueryOptions,
  transactionsQueryOptions,
  currentUserProfileQueryOptions,
  studentIdStatusQueryOptions,
} from '@/lib/query-options'
import {
  propertiesQueryOptions,
  propertyQueryOptions,
} from '@/lib/query-options-housing'
import {
  itemsQueryOptions,
  itemQueryOptions,
  itemViewStatsQueryOptions,
  myItemsQueryOptions,
} from '@/lib/query-options-decluttering'
import {
  servicesQueryOptions,
  serviceQueryOptions,
} from '@/lib/query-options-service-providers'

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {
  // Query all data
  const propertiesQuery = useQuery(propertiesQueryOptions())
  const itemsQuery = useQuery(itemsQueryOptions())
  const servicesQuery = useQuery(servicesQueryOptions())
  const usersQuery = useQuery(usersQueryOptions())
  const currentUserProfileQuery = useQuery(currentUserProfileQueryOptions())
  const studentIdStatusQuery = useQuery(studentIdStatusQueryOptions())

  return (
    <DataContext.Provider value={{
      // Query data
      properties: propertiesQuery.data || [],
      items: itemsQuery.data || [],
      services: servicesQuery.data || [],
      users: usersQuery.data || [],
      currentUserProfile: currentUserProfileQuery.data || null,
      studentIdStatus: studentIdStatusQuery.data || null,
      
      // Loading states
      isLoading: propertiesQuery.isLoading || itemsQuery.isLoading || servicesQuery.isLoading || usersQuery.isLoading,
      
      // Query functions
      propertiesQuery,
      itemsQuery,
      servicesQuery,
      usersQuery,
      currentUserProfileQuery,
      studentIdStatusQuery,
      
      // Query options for use in components
      propertiesQueryOptions,
      itemsQueryOptions,
      myItemsQueryOptions,
      servicesQueryOptions,
      usersQueryOptions,
      transactionsQueryOptions,
      propertyQueryOptions,
      itemQueryOptions,
      serviceQueryOptions,
      currentUserProfileQueryOptions,
      studentIdStatusQueryOptions
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

// Hook to get filtered properties
export const useProperties = (filters = {}) => {
  return useQuery(propertiesQueryOptions(filters))
}

// Hook to get filtered items
export const useItems = (filters = {}) => {
  return useQuery(itemsQueryOptions(filters))
}

export const useMyItems = (filters = {}) => {
  return useQuery(myItemsQueryOptions(filters))
}

// Hook to get filtered services
export const useServices = (filters = {}) => {
  return useQuery(servicesQueryOptions(filters))
}

// Hook to get transactions
export const useTransactions = (userId, userType) => {
  return useQuery(transactionsQueryOptions(userId, userType))
}

// Hook to get single property
export const useProperty = (id) => {
  return useQuery(propertyQueryOptions(id))
}

// Hook to get single item
export const useItem = (id) => {
  return useQuery(itemQueryOptions(id))
}

export const useItemViewStats = (id) => {
  return useQuery(itemViewStatsQueryOptions(id))
}

// Hook to get single service
export const useService = (id) => {
  return useQuery(serviceQueryOptions(id))
}

export const useCurrentUserProfile = () => {
  return useQuery(currentUserProfileQueryOptions())
}

export const useStudentIdStatus = () => {
  return useQuery(studentIdStatusQueryOptions())
}
