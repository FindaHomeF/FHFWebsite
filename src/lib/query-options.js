// TanStack Query options for shared/general data concerns

import { queryOptions } from '@tanstack/react-query'
import { getCurrentUserProfile, getStoredAccessToken, getStudentIdStatus } from './auth-api'

export const fetchFromStorage = (key, fallbackData = []) => {
  if (typeof window === 'undefined') return fallbackData

  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored)
      return Array.isArray(parsed) ? parsed : fallbackData
    }
  } catch (error) {
    console.error(`Error fetching ${key} from localStorage:`, error)
  }

  return fallbackData
}

export const saveToStorage = (key, data) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

export const usersQueryOptions = (filters = {}) => {
  return queryOptions({
    queryKey: ['users', filters],
    queryFn: () => {
      return fetchFromStorage('users', [])
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const transactionsQueryOptions = (userId, userType) => {
  return queryOptions({
    queryKey: ['transactions', userId, userType],
    queryFn: () => {
      const key = `${userType}Transactions-${userId}`
      return fetchFromStorage(key, [])
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const currentUserProfileQueryOptions = () => {
  const accessToken = getStoredAccessToken()

  return queryOptions({
    queryKey: ['auth', 'profile'],
    queryFn: () => getCurrentUserProfile(accessToken),
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60 * 5,
    retry: false,
  })
}

export const studentIdStatusQueryOptions = () => {
  const accessToken = getStoredAccessToken()

  return queryOptions({
    queryKey: ['auth', 'student-id-status'],
    queryFn: () => getStudentIdStatus(accessToken),
    enabled: Boolean(accessToken),
    staleTime: 1000 * 60,
    retry: false,
  })
}
