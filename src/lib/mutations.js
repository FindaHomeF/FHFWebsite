// TanStack Query mutations for data mutations
// Centralized mutation functions for create/update/delete operations

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveToStorage } from './query-options'
import { toast } from 'sonner'
import { changePassword, clearAuthStorage, createDeclutteringListing, deleteDeclutteringListing, isEmailUnverifiedAuthError, loginUser, logoutUser, partiallyUpdateDeclutteringListing, persistAuthSession, persistRefreshedAuthTokens, refreshAuthToken, registerUser, reorderDeclutteringListingImages, requestPasswordReset, resendEmailOtp, resetPasswordWithOtp, restoreDeclutteringListing, softDeleteDeclutteringListing, unlockLockedUserAccount, updateCurrentUserProfile, updateDeclutteringListing, uploadStudentIdDocument, verifyEmailOtp } from './auth-api'

// Auth mutations
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success('Registration successful. Check your email for OTP.')
    },
    onError: (error) => {
      toast.error(error?.message || 'Registration failed')
      console.error('Error during registration:', error)
    },
  })
}

export const useVerifyEmailOtp = () => {
  return useMutation({
    mutationFn: verifyEmailOtp,
    onSuccess: () => {
      toast.success('Email verified successfully')
    },
    onError: (error) => {
      toast.error(error?.message || 'OTP verification failed')
      console.error('Error verifying email OTP:', error)
    },
  })
}

export const useResendEmailOtp = () => {
  return useMutation({
    mutationFn: resendEmailOtp,
    onSuccess: () => {
      toast.success('A new OTP has been sent to your email')
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to resend OTP')
      console.error('Error resending email OTP:', error)
    },
  })
}

export const useLogoutUser = () => {
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearAuthStorage()
      toast.success('Logged out successfully')
    },
    onError: (error) => {
      // Security-first fallback: clear local auth state even when token is invalid/expired.
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Logout failed')
      console.error('Error during logout:', error)
    },
  })
}

export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      persistAuthSession(data)
      toast.success('Login successful')
    },
    onError: (error) => {
      if (isEmailUnverifiedAuthError(error)) {
        // Login page resends OTP and redirects to verify-otp; avoid duplicate error toast.
        return
      }
      toast.error(error?.message || 'Login failed')
      console.error('Error during login:', error)
    },
  })
}

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: () => {
      // Intentional generic message to avoid user enumeration.
      toast.success('If the email is registered, a password reset OTP has been sent.')
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to process reset request right now')
      console.error('Error requesting password reset:', error)
    },
  })
}

export const useResetPasswordWithOtp = () => {
  return useMutation({
    mutationFn: resetPasswordWithOtp,
    onSuccess: () => {
      clearAuthStorage()
      toast.success('Password reset successful. Please log in with your new password.')
    },
    onError: (error) => {
      toast.error(error?.message || 'Unable to reset password')
      console.error('Error resetting password:', error)
    },
  })
}

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully')
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Unable to change password')
      console.error('Error changing password:', error)
    },
  })
}

export const useUpdateCurrentUserProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ payload, accessToken }) =>
      updateCurrentUserProfile(payload, accessToken),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
      if (data?.user && typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(data.user))
      }
      toast.success('Profile updated successfully')
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Unable to update profile')
      console.error('Error updating profile:', error)
    },
  })
}

export const useUploadStudentIdDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ studentIdDocument, accessToken }) =>
      uploadStudentIdDocument({ studentIdDocument }, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'student-id-status'] })
      toast.success('Student ID uploaded successfully. Awaiting admin review.')
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Unable to upload Student ID document')
      console.error('Error uploading Student ID document:', error)
    },
  })
}

export const useUnlockLockedUserAccount = () => {
  return useMutation({
    mutationFn: ({ userId, accessToken }) =>
      unlockLockedUserAccount({ userId }, accessToken),
    onSuccess: () => {
      toast.success('Account unlocked successfully')
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Unable to unlock account')
      console.error('Error unlocking account:', error)
    },
  })
}

export const useRefreshAuthToken = () => {
  return useMutation({
    mutationFn: ({ refreshToken }) => refreshAuthToken(refreshToken),
    onSuccess: (data) => {
      persistRefreshedAuthTokens(data)
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      console.error('Error refreshing auth token:', error)
    },
  })
}

export const useCreateDeclutteringListing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ payload, accessToken }) =>
      createDeclutteringListing(payload, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success('Decluttering listing created successfully')
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Failed to create decluttering listing')
      console.error('Error creating decluttering listing:', error)
    },
  })
}

export const useUpdateDeclutteringListing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload, accessToken }) =>
      updateDeclutteringListing(id, payload, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success('Decluttering listing updated successfully')
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Failed to update decluttering listing')
      console.error('Error updating decluttering listing:', error)
    },
  })
}

export const usePartialUpdateDeclutteringListing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload, accessToken }) =>
      partiallyUpdateDeclutteringListing(id, payload, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success('Decluttering listing updated successfully')
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Failed to update decluttering listing')
      console.error('Error partially updating decluttering listing:', error)
    },
  })
}

export const useDeleteDeclutteringListing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, accessToken }) => deleteDeclutteringListing(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success('Decluttering listing deleted successfully')
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Failed to delete decluttering listing')
      console.error('Error deleting decluttering listing:', error)
    },
  })
}

export const useReorderDeclutteringListingImages = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, imageOrder, accessToken }) =>
      reorderDeclutteringListingImages(id, imageOrder, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success('Listing images reordered successfully')
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Failed to reorder listing images')
      console.error('Error reordering listing images:', error)
    },
  })
}

export const useSoftDeleteDeclutteringListing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, accessToken }) => softDeleteDeclutteringListing(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success('Listing archived successfully. You can restore it within 90 days.')
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Failed to archive listing')
      console.error('Error archiving listing:', error)
    },
  })
}

export const useRestoreDeclutteringListing = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, accessToken }) => restoreDeclutteringListing(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success('Listing restored successfully')
    },
    onError: (error) => {
      if (error?.status === 401) {
        clearAuthStorage()
      }
      toast.error(error?.message || 'Failed to restore listing')
      console.error('Error restoring listing:', error)
    },
  })
}

// Property mutations
export const useCreateProperty = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (property) => {
      const stored = JSON.parse(localStorage.getItem('properties') || '[]')
      const newProperty = {
        ...property,
        id: property.id || `prop-${Date.now()}`,
        propertyId: property.propertyId || property.id || `prop-${Date.now()}`,
        datePosted: property.datePosted || new Date().toISOString(),
        status: property.status || 'Active'
      }
      const updated = [...stored, newProperty]
      saveToStorage('properties', updated)
      return newProperty
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Property created successfully!')
    },
    onError: (error) => {
      toast.error('Failed to create property')
      console.error('Error creating property:', error)
    }
  })
}

export const useUpdateProperty = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const stored = JSON.parse(localStorage.getItem('properties') || '[]')
      const updated = stored.map(p => 
        (p.id === id || p.propertyId === id) ? { ...p, ...updates } : p
      )
      saveToStorage('properties', updated)
      return updated.find(p => p.id === id || p.propertyId === id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Property updated successfully!')
    },
    onError: (error) => {
      toast.error('Failed to update property')
      console.error('Error updating property:', error)
    }
  })
}

export const useDeleteProperty = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const stored = JSON.parse(localStorage.getItem('properties') || '[]')
      const updated = stored.filter(p => p.id !== id && p.propertyId !== id)
      saveToStorage('properties', updated)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Property deleted successfully!')
    },
    onError: (error) => {
      toast.error('Failed to delete property')
      console.error('Error deleting property:', error)
    }
  })
}

// Item mutations
export const useCreateItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (item) => {
      const stored = JSON.parse(localStorage.getItem('items') || '[]')
      const newItem = {
        ...item,
        id: item.id || `#D${Date.now().toString().padStart(3, '0')}`,
        itemId: item.itemId || item.id || `#D${Date.now().toString().padStart(3, '0')}`,
        datePosted: item.datePosted || new Date().toISOString(),
        status: item.status || 'Available'
      }
      const updated = [...stored, newItem]
      saveToStorage('items', updated)
      return newItem
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success('Item created successfully!')
    },
    onError: (error) => {
      toast.error('Failed to create item')
      console.error('Error creating item:', error)
    }
  })
}

export const useUpdateItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const stored = JSON.parse(localStorage.getItem('items') || '[]')
      const updated = stored.map(i => 
        (i.id === id || i.itemId === id) ? { ...i, ...updates } : i
      )
      saveToStorage('items', updated)
      return updated.find(i => i.id === id || i.itemId === id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success('Item updated successfully!')
    },
    onError: (error) => {
      toast.error('Failed to update item')
      console.error('Error updating item:', error)
    }
  })
}

export const useDeleteItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const stored = JSON.parse(localStorage.getItem('items') || '[]')
      const updated = stored.filter(i => i.id !== id && i.itemId !== id)
      saveToStorage('items', updated)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
      toast.success('Item deleted successfully!')
    },
    onError: (error) => {
      toast.error('Failed to delete item')
      console.error('Error deleting item:', error)
    }
  })
}

// Service mutations
export const useCreateService = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (service) => {
      const stored = JSON.parse(localStorage.getItem('services') || '[]')
      const newService = {
        ...service,
        id: service.id || `svc-${Date.now()}`,
        serviceId: service.serviceId || service.id || `svc-${Date.now()}`,
        datePosted: service.datePosted || new Date().toISOString(),
        status: service.status || 'Active'
      }
      const updated = [...stored, newService]
      saveToStorage('services', updated)
      return newService
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service created successfully!')
    },
    onError: (error) => {
      toast.error('Failed to create service')
      console.error('Error creating service:', error)
    }
  })
}

export const useUpdateService = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const stored = JSON.parse(localStorage.getItem('services') || '[]')
      const updated = stored.map(s => 
        (s.id === id || s.serviceId === id) ? { ...s, ...updates } : s
      )
      saveToStorage('services', updated)
      return updated.find(s => s.id === id || s.serviceId === id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service updated successfully!')
    },
    onError: (error) => {
      toast.error('Failed to update service')
      console.error('Error updating service:', error)
    }
  })
}

export const useDeleteService = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const stored = JSON.parse(localStorage.getItem('services') || '[]')
      const updated = stored.filter(s => s.id !== id && s.serviceId !== id)
      saveToStorage('services', updated)
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Service deleted successfully!')
    },
    onError: (error) => {
      toast.error('Failed to delete service')
      console.error('Error deleting service:', error)
    }
  })
}

// Transaction mutations
export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ userId, userType, transaction }) => {
      const key = `${userType}Transactions-${userId}`
      const stored = JSON.parse(localStorage.getItem(key) || '[]')
      const newTransaction = {
        ...transaction,
        id: transaction.id || `txn-${Date.now()}`,
        date: transaction.date || new Date().toISOString()
      }
      const updated = [...stored, newTransaction]
      saveToStorage(key, updated)
      return newTransaction
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['transactions', variables.userId, variables.userType] 
      })
      toast.success('Transaction recorded successfully!')
    },
    onError: (error) => {
      toast.error('Failed to create transaction')
      console.error('Error creating transaction:', error)
    }
  })
}

