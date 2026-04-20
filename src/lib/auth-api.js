const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fhf-backend.onrender.com'

const AUTH_JSON_HEADERS = {
  'Content-Type': 'application/json',
}

export const AUTH_STORAGE_KEYS = [
  'fhf-access-token',
  'fhf-refresh-token',
  'access_token',
  'refresh_token',
  'authToken',
  'refreshToken',
  'token',
  'user',
  'currentUser',
]

const buildEndpoint = (path) => `${API_BASE_URL}${path}`

export const getStoredAccessToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('fhf-access-token') || localStorage.getItem('access_token')
}

export const getStoredRefreshToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('fhf-refresh-token') || localStorage.getItem('refresh_token')
}

class ApiRequestError extends Error {
  constructor(message, status, meta = {}) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.meta = meta
  }
}

const parseApiError = async (response) => {
  try {
    const errorData = await response.json()
    const firstError = Object.values(errorData || {})[0]
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0]
    }
    if (typeof firstError === 'string') {
      return firstError
    }
    if (typeof errorData?.detail === 'string') {
      return errorData.detail
    }
    return 'Request failed. Please try again.'
  } catch {
    return 'Request failed. Please try again.'
  }
}

const performFetch = async (endpoint, options = {}) => {
  let response
  try {
    response = await fetch(endpoint, options)
  } catch (error) {
    throw new ApiRequestError(
      `Network error: Unable to reach auth service at ${endpoint}. Ensure backend is running and CORS allows this origin.`,
      0
    )
  }
  return response
}

const withJsonHeaders = (headers = {}) => ({
  ...AUTH_JSON_HEADERS,
  ...(headers || {}),
})

const request = async (path, options = {}) => {
  const { skipAuthRefresh, useJsonHeaders = true, ...fetchOptions } = options
  const endpoint = buildEndpoint(path)
  const baseHeaders = useJsonHeaders ? withJsonHeaders(fetchOptions.headers) : { ...(fetchOptions.headers || {}) }
  let response = await performFetch(endpoint, {
    ...fetchOptions,
    headers: baseHeaders,
  })

  const isAuthRequest = typeof baseHeaders.Authorization === 'string'
  const isRefreshEndpoint = path === '/api/auth/token/refresh/'
  const canAttemptRefresh = skipAuthRefresh !== true && isAuthRequest && !isRefreshEndpoint

  if (response.status === 401 && canAttemptRefresh) {
    try {
      const refreshedTokens = await refreshAuthToken(getStoredRefreshToken(), true)
      persistRefreshedAuthTokens(refreshedTokens)

      const retryHeaders = {
        ...baseHeaders,
        Authorization: `Bearer ${getStoredAccessToken()}`,
      }

      response = await performFetch(endpoint, {
        ...fetchOptions,
        headers: retryHeaders,
      })
    } catch (refreshError) {
      clearAuthStorage()
      throw refreshError
    }
  }

  if (!response.ok) {
    const errorMessage = await parseApiError(response)
    if (response.status === 401 && canAttemptRefresh) {
      clearAuthStorage()
    }
    throw new ApiRequestError(errorMessage, response.status, {
      retryAfter: response.headers.get('retry-after'),
    })
  }

  if (response.status === 204) return null
  return response.json()
}

export const registerUser = async (payload) => {
  return request('/api/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const verifyEmailOtp = async ({ email, otpCode }) => {
  return request('/api/auth/verify-email/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      otp_code: otpCode,
    }),
  })
}

export const resendEmailOtp = async ({
  email,
  otp_type = 'email_verification',
}) => {
  return request('/api/auth/resend-otp/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      otp_type,
    }),
  })
}

export const logoutUser = async ({ accessToken, refreshToken }) => {
  return request('/api/auth/logout/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  })
}

export const clearAuthStorage = () => {
  if (typeof window === 'undefined') return
  AUTH_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))
  window.dispatchEvent(new CustomEvent('fhf-auth-cleared'))
}

export const loginUser = async (payload) => {
  return request('/api/auth/login/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const persistAuthSession = (loginResponse = {}) => {
  if (typeof window === 'undefined') return

  const accessToken = loginResponse.access || loginResponse.access_token || null
  const refreshToken = loginResponse.refresh || loginResponse.refresh_token || null
  const user = loginResponse.user || loginResponse.profile || null

  if (accessToken) {
    localStorage.setItem('fhf-access-token', accessToken)
    localStorage.setItem('access_token', accessToken)
  }
  if (refreshToken) {
    localStorage.setItem('fhf-refresh-token', refreshToken)
    localStorage.setItem('refresh_token', refreshToken)
  }
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
  }
}

export const requestPasswordReset = async ({ email }) => {
  return request('/api/auth/request-password-reset/', {
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
  })
}

export const resetPasswordWithOtp = async ({
  email,
  otpCode,
  newPassword,
  newPasswordConfirm,
}) => {
  return request('/api/auth/reset-password/', {
    method: 'POST',
    body: JSON.stringify({
      email,
      otp_code: otpCode,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    }),
  })
}

export const changePassword = async ({
  accessToken,
  oldPassword,
  newPassword,
  newPasswordConfirm,
}) => {
  return request('/api/auth/change-password/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    }),
  })
}

export const getCurrentUserProfile = async (accessToken = getStoredAccessToken()) => {
  if (!accessToken) {
    return null
  }

  return request('/api/auth/profile/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const updateCurrentUserProfile = async (
  payload,
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const profilePayload = {
    ...(payload?.student_id_number !== undefined
      ? { student_id_number: payload.student_id_number }
      : {}),
    ...(payload?.artisan_nin !== undefined
      ? { artisan_nin: payload.artisan_nin }
      : {}),
    ...(payload?.profile_picture !== undefined
      ? { profile_picture: payload.profile_picture }
      : {}),
  }

  return request('/api/auth/profile/', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(profilePayload),
  })
}

export const getStudentIdStatus = async (accessToken = getStoredAccessToken()) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  return request('/api/auth/student-id-status/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const uploadStudentIdDocument = async (
  { studentIdDocument },
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const formData = new FormData()
  formData.append('student_id_document', studentIdDocument)

  return request('/api/auth/student-id-upload/', {
    method: 'POST',
    useJsonHeaders: false,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })
}

const DECLUTTER_POST_CONDITION_MAP = {
  NEW: 'NEW',
  LIKE_NEW: 'LIKE_NEW',
  GOOD: 'GOOD',
  FAIR: 'FAIR',
  POOR: 'POOR',
  'N/A': 'N/A',
  New: 'NEW',
  'Like New': 'LIKE_NEW',
  Good: 'GOOD',
  Fair: 'FAIR',
  Poor: 'POOR',
  Used: 'POOR',
  Excellent: 'LIKE_NEW',
}

const toMinorPriceParts = (priceValue) => {
  const numeric = Number(priceValue || 0)
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return { price: 0, price_decimal: '00' }
  }
  const [majorPart, decimalPart = ''] = numeric.toFixed(2).split('.')
  return {
    price: Number(majorPart) * 100 + Number(decimalPart),
    price_decimal: decimalPart.padEnd(2, '0').slice(0, 2),
  }
}

const normalizeDeclutterPostCondition = (value) => {
  if (!value) return 'GOOD'
  return DECLUTTER_POST_CONDITION_MAP[value] || 'GOOD'
}

const normalizeDeclutterImageEntries = (images = []) => {
  return (images || []).map((entry, index) => ({
    image: entry?.image || entry,
    caption: entry?.caption || `Image ${index + 1}`,
    is_featured: Boolean(entry?.is_featured ?? index === 0),
  }))
}

const toNumericPropertyId = (id) => {
  if (id === null || id === undefined) return null
  const normalized = String(id).trim().replace(/^#D/i, '')
  if (!/^\d+$/.test(normalized)) return null
  const parsed = Number(normalized)
  return Number.isInteger(parsed) ? parsed : null
}

const isFileLike = (value) => {
  if (!value || typeof value !== 'object') return false
  if (typeof File !== 'undefined' && value instanceof File) return true
  if (typeof Blob !== 'undefined' && value instanceof Blob) return true
  return false
}

const hasFileImages = (images = []) => {
  return (images || []).some((entry) => isFileLike(entry?.image || entry))
}

const buildDeclutteringListingPayload = ({
  property_type = 'ITEM',
  title,
  description,
  price,
  currency = 'NGN',
  condition,
  status = 'DRAFT',
  location,
  contactInfo,
  features = {},
  images = [],
} = {}) => {
  const normalizedImages = normalizeDeclutterImageEntries(images)
  const { price: priceInMinorUnits, price_decimal } = toMinorPriceParts(price)

  return {
    property_type,
    title,
    description,
    price: priceInMinorUnits,
    price_decimal,
    currency,
    condition: normalizeDeclutterPostCondition(condition),
    status,
    location,
    contact_info: contactInfo,
    features: {
      is_negotiable: Boolean(features.is_negotiable),
      is_delivery_available: Boolean(features.is_delivery_available),
      is_featured: Boolean(features.is_featured),
      ...features,
    },
    images: normalizedImages,
  }
}

const normalizeDeclutteringFeatures = (features = {}, isPartial = false) => {
  const normalized = { ...(features || {}) }

  if (isPartial) {
    if (Object.prototype.hasOwnProperty.call(features, 'is_negotiable')) {
      normalized.is_negotiable = Boolean(features.is_negotiable)
    }
    if (Object.prototype.hasOwnProperty.call(features, 'is_delivery_available')) {
      normalized.is_delivery_available = Boolean(features.is_delivery_available)
    }
    if (Object.prototype.hasOwnProperty.call(features, 'is_featured')) {
      normalized.is_featured = Boolean(features.is_featured)
    }
    return normalized
  }

  normalized.is_negotiable = Boolean(features.is_negotiable)
  normalized.is_delivery_available = Boolean(features.is_delivery_available)
  normalized.is_featured = Boolean(features.is_featured)
  return normalized
}

const buildDeclutteringListingFormData = (payload = {}, isPartial = false) => {
  const formData = new FormData()

  const appendIfDefined = (key, value) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  }

  if (!isPartial || payload.property_type !== undefined) appendIfDefined('property_type', payload.property_type || 'ITEM')
  if (!isPartial || payload.title !== undefined) appendIfDefined('title', payload.title)
  if (!isPartial || payload.description !== undefined) appendIfDefined('description', payload.description)
  if (!isPartial || payload.currency !== undefined) appendIfDefined('currency', payload.currency || 'NGN')
  if (!isPartial || payload.condition !== undefined) appendIfDefined('condition', normalizeDeclutterPostCondition(payload.condition))
  if (!isPartial || payload.status !== undefined) appendIfDefined('status', payload.status || 'DRAFT')
  if (!isPartial || payload.location !== undefined) appendIfDefined('location', payload.location)
  if (!isPartial || payload.contactInfo !== undefined) appendIfDefined('contact_info', payload.contactInfo)

  if (!isPartial || payload.price !== undefined) {
    const { price: priceInMinorUnits, price_decimal } = toMinorPriceParts(payload.price)
    appendIfDefined('price', priceInMinorUnits)
    appendIfDefined('price_decimal', price_decimal)
  }

  if (!isPartial || payload.features !== undefined) {
    const normalizedFeatures = normalizeDeclutteringFeatures(payload.features || {}, isPartial)
    formData.append('features', JSON.stringify(normalizedFeatures))
  }

  if (!isPartial || payload.images !== undefined) {
    const normalizedImages = normalizeDeclutterImageEntries(payload.images || [])
    normalizedImages.forEach((imageEntry, index) => {
      const imageValue = imageEntry?.image
      if (imageValue !== undefined && imageValue !== null) {
        if (isFileLike(imageValue)) {
          formData.append(`images[${index}][image]`, imageValue)
        } else {
          formData.append(`images[${index}][image]`, String(imageValue))
        }
      }
      formData.append(`images[${index}][caption]`, imageEntry?.caption || `Image ${index + 1}`)
      formData.append(`images[${index}][is_featured]`, String(Boolean(imageEntry?.is_featured)))
    })
  }

  return formData
}

const buildDeclutteringPartialPayload = (payload = {}) => {
  const partialPayload = {}

  if (payload.property_type !== undefined) {
    partialPayload.property_type = payload.property_type
  }
  if (payload.title !== undefined) {
    partialPayload.title = payload.title
  }
  if (payload.description !== undefined) {
    partialPayload.description = payload.description
  }
  if (payload.price !== undefined) {
    const { price: priceInMinorUnits, price_decimal } = toMinorPriceParts(payload.price)
    partialPayload.price = priceInMinorUnits
    partialPayload.price_decimal = price_decimal
  }
  if (payload.currency !== undefined) {
    partialPayload.currency = payload.currency
  }
  if (payload.condition !== undefined) {
    partialPayload.condition = normalizeDeclutterPostCondition(payload.condition)
  }
  if (payload.status !== undefined) {
    partialPayload.status = payload.status
  }
  if (payload.location !== undefined) {
    partialPayload.location = payload.location
  }
  if (payload.contactInfo !== undefined) {
    partialPayload.contact_info = payload.contactInfo
  }
  if (payload.features !== undefined) {
    const features = payload.features || {}
    const partialFeatures = { ...features }
    if (Object.prototype.hasOwnProperty.call(features, 'is_negotiable')) {
      partialFeatures.is_negotiable = Boolean(features.is_negotiable)
    }
    if (Object.prototype.hasOwnProperty.call(features, 'is_delivery_available')) {
      partialFeatures.is_delivery_available = Boolean(features.is_delivery_available)
    }
    if (Object.prototype.hasOwnProperty.call(features, 'is_featured')) {
      partialFeatures.is_featured = Boolean(features.is_featured)
    }
    partialPayload.features = partialFeatures
  }
  if (payload.images !== undefined) {
    partialPayload.images = normalizeDeclutterImageEntries(payload.images || [])
  }

  return partialPayload
}

export const createDeclutteringListing = async (
  {
    title,
    description,
    price,
    currency = 'NGN',
    condition,
    status = 'DRAFT',
    location,
    contactInfo,
    features = {},
    images = [],
  },
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const payload = {
    property_type: 'ITEM',
    title,
    description,
    price,
    currency,
    condition,
    status,
    location,
    contactInfo,
    features,
    images,
  }

  const shouldUseMultipart = hasFileImages(images)

  return request('/api/listings/properties/', {
    method: 'POST',
    useJsonHeaders: !shouldUseMultipart,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: shouldUseMultipart
      ? buildDeclutteringListingFormData(payload, false)
      : JSON.stringify(buildDeclutteringListingPayload(payload)),
  })
}

export const updateDeclutteringListing = async (
  id,
  {
    property_type = 'ITEM',
    title,
    description,
    price,
    currency = 'NGN',
    condition,
    status = 'DRAFT',
    location,
    contactInfo,
    features = {},
    images = [],
  },
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const propertyId = toNumericPropertyId(id)
  if (propertyId === null) {
    throw new ApiRequestError('Invalid property id provided for update', 400)
  }

  const payload = {
    property_type,
    title,
    description,
    price,
    currency,
    condition,
    status,
    location,
    contactInfo,
    features,
    images,
  }

  const shouldUseMultipart = hasFileImages(images)

  return request(`/api/listings/properties/${propertyId}/`, {
    method: 'PUT',
    useJsonHeaders: !shouldUseMultipart,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: shouldUseMultipart
      ? buildDeclutteringListingFormData(payload, false)
      : JSON.stringify(buildDeclutteringListingPayload(payload)),
  })
}

export const partiallyUpdateDeclutteringListing = async (
  id,
  payload = {},
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const propertyId = toNumericPropertyId(id)
  if (propertyId === null) {
    throw new ApiRequestError('Invalid property id provided for partial update', 400)
  }

  const hasImages = payload?.images !== undefined
  const shouldUseMultipart = hasImages && hasFileImages(payload.images || [])
  const partialPayload = buildDeclutteringPartialPayload(payload)

  return request(`/api/listings/properties/${propertyId}/`, {
    method: 'PATCH',
    useJsonHeaders: !shouldUseMultipart,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: shouldUseMultipart
      ? buildDeclutteringListingFormData(payload, true)
      : JSON.stringify(partialPayload),
  })
}

export const getDeclutteringListingById = async (
  id,
  accessToken = getStoredAccessToken()
) => {
  const propertyId = toNumericPropertyId(id)
  if (propertyId === null) {
    throw new ApiRequestError('Invalid property id provided for retrieval', 400)
  }

  const headers = accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : undefined

  return request(`/api/listings/properties/${propertyId}/`, {
    method: 'GET',
    headers,
  })
}

export const deleteDeclutteringListing = async (
  id,
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const propertyId = toNumericPropertyId(id)
  if (propertyId === null) {
    throw new ApiRequestError('Invalid property id provided for deletion', 400)
  }

  return request(`/api/listings/properties/${propertyId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const reorderDeclutteringListingImages = async (
  id,
  imageOrder = [],
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const propertyId = toNumericPropertyId(id)
  if (propertyId === null) {
    throw new ApiRequestError('Invalid property id provided for image reorder', 400)
  }

  return request(`/api/listings/properties/${propertyId}/reorder_images/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      image_order: Array.isArray(imageOrder) ? imageOrder : [],
    }),
  })
}

const normalizePropertyImagesPayload = (payload) => {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.results)) return payload.results
  return []
}

export const getDeclutteringListingImages = async (
  id,
  accessToken = getStoredAccessToken(),
  page
) => {
  const propertyId = toNumericPropertyId(id)
  if (propertyId === null) {
    throw new ApiRequestError('Invalid property id provided for image retrieval', 400)
  }

  const headers = accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : undefined

  const query = page ? `?page=${encodeURIComponent(page)}` : ''
  const response = await request(`/api/listings/properties/${propertyId}/images/${query}`, {
    method: 'GET',
    headers,
  })

  return normalizePropertyImagesPayload(response)
}

export const getDeclutteringListingImageById = async (
  propertyId,
  imageId,
  accessToken = getStoredAccessToken()
) => {
  const normalizedPropertyId = toNumericPropertyId(propertyId)
  if (normalizedPropertyId === null) {
    throw new ApiRequestError('Invalid property id provided for image retrieval', 400)
  }

  const normalizedImageId = Number(imageId)
  if (!Number.isInteger(normalizedImageId) || normalizedImageId <= 0) {
    throw new ApiRequestError('Invalid image id provided for image retrieval', 400)
  }

  const headers = accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : undefined

  return request(
    `/api/listings/properties/${normalizedPropertyId}/images/${normalizedImageId}/`,
    {
      method: 'GET',
      headers,
    }
  )
}

export const createDeclutteringListingImage = async (
  id,
  { image, caption = '', is_featured = false } = {},
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const propertyId = toNumericPropertyId(id)
  if (propertyId === null) {
    throw new ApiRequestError('Invalid property id provided for image upload', 400)
  }

  const isBinaryImage = isFileLike(image)
  const body = isBinaryImage
    ? (() => {
        const formData = new FormData()
        formData.append('image', image)
        formData.append('caption', caption || '')
        formData.append('is_featured', String(Boolean(is_featured)))
        return formData
      })()
    : JSON.stringify({
        image,
        caption,
        is_featured: Boolean(is_featured),
      })

  return request(`/api/listings/properties/${propertyId}/images/`, {
    method: 'POST',
    useJsonHeaders: !isBinaryImage,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  })
}

export const setDeclutteringListingImageFeatured = async (
  propertyId,
  imageId,
  payload = {},
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const normalizedPropertyId = toNumericPropertyId(propertyId)
  if (normalizedPropertyId === null) {
    throw new ApiRequestError('Invalid property id provided for featured image update', 400)
  }

  const normalizedImageId = Number(imageId)
  if (!Number.isInteger(normalizedImageId) || normalizedImageId <= 0) {
    throw new ApiRequestError('Invalid image id provided for featured image update', 400)
  }

  return request(
    `/api/listings/properties/${normalizedPropertyId}/images/${normalizedImageId}/set_featured/`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...(Object.prototype.hasOwnProperty.call(payload, 'image')
          ? { image: payload.image }
          : {}),
        ...(Object.prototype.hasOwnProperty.call(payload, 'caption')
          ? { caption: payload.caption }
          : {}),
        is_featured: true,
      }),
    }
  )
}

export const updateDeclutteringListingImage = async (
  propertyId,
  imageId,
  { image, caption = '', is_featured = false } = {},
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const normalizedPropertyId = toNumericPropertyId(propertyId)
  if (normalizedPropertyId === null) {
    throw new ApiRequestError('Invalid property id provided for image update', 400)
  }

  const normalizedImageId = Number(imageId)
  if (!Number.isInteger(normalizedImageId) || normalizedImageId <= 0) {
    throw new ApiRequestError('Invalid image id provided for image update', 400)
  }

  const isBinaryImage = isFileLike(image)
  const body = isBinaryImage
    ? (() => {
        const formData = new FormData()
        formData.append('image', image)
        formData.append('caption', caption || '')
        formData.append('is_featured', String(Boolean(is_featured)))
        return formData
      })()
    : JSON.stringify({
        image,
        caption,
        is_featured: Boolean(is_featured),
      })

  return request(
    `/api/listings/properties/${normalizedPropertyId}/images/${normalizedImageId}/`,
    {
      method: 'PUT',
      useJsonHeaders: !isBinaryImage,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    }
  )
}

export const partiallyUpdateDeclutteringListingImage = async (
  propertyId,
  imageId,
  payload = {},
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const normalizedPropertyId = toNumericPropertyId(propertyId)
  if (normalizedPropertyId === null) {
    throw new ApiRequestError('Invalid property id provided for image update', 400)
  }

  const normalizedImageId = Number(imageId)
  if (!Number.isInteger(normalizedImageId) || normalizedImageId <= 0) {
    throw new ApiRequestError('Invalid image id provided for image update', 400)
  }

  const isBinaryImage = isFileLike(payload?.image)
  let body
  if (isBinaryImage) {
    const formData = new FormData()
    formData.append('image', payload.image)
    if (Object.prototype.hasOwnProperty.call(payload, 'caption')) {
      formData.append('caption', payload.caption || '')
    }
    if (Object.prototype.hasOwnProperty.call(payload, 'is_featured')) {
      formData.append('is_featured', String(Boolean(payload.is_featured)))
    }
    body = formData
  } else {
    body = JSON.stringify({
      ...(Object.prototype.hasOwnProperty.call(payload, 'image') ? { image: payload.image } : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'caption') ? { caption: payload.caption } : {}),
      ...(Object.prototype.hasOwnProperty.call(payload, 'is_featured')
        ? { is_featured: Boolean(payload.is_featured) }
        : {}),
    })
  }

  return request(
    `/api/listings/properties/${normalizedPropertyId}/images/${normalizedImageId}/`,
    {
      method: 'PATCH',
      useJsonHeaders: !isBinaryImage,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body,
    }
  )
}

export const deleteDeclutteringListingImage = async (
  propertyId,
  imageId,
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const normalizedPropertyId = toNumericPropertyId(propertyId)
  if (normalizedPropertyId === null) {
    throw new ApiRequestError('Invalid property id provided for image delete', 400)
  }

  const normalizedImageId = Number(imageId)
  if (!Number.isInteger(normalizedImageId) || normalizedImageId <= 0) {
    throw new ApiRequestError('Invalid image id provided for image delete', 400)
  }

  return request(
    `/api/listings/properties/${normalizedPropertyId}/images/${normalizedImageId}/`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
}

const appendQueryParams = (path, params = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, rawValue]) => {
    if (rawValue === undefined || rawValue === null || rawValue === '') return
    if (Array.isArray(rawValue)) {
      if (rawValue.length === 0) return
      searchParams.set(key, String(rawValue[0]))
      return
    }
    searchParams.set(key, String(rawValue))
  })

  const serialized = searchParams.toString()
  return serialized ? `${path}?${serialized}` : path
}

export const getMyDeclutteringListings = async (
  filters = {},
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const endpoint = appendQueryParams('/api/listings/properties/my_properties/', {
    property_type: 'ITEM',
    ...filters,
  })

  return request(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const softDeleteDeclutteringListing = async (
  id,
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const propertyId = toNumericPropertyId(id)
  if (propertyId === null) {
    throw new ApiRequestError('Invalid property id provided for soft delete', 400)
  }

  return request(`/api/listings/properties/${propertyId}/soft_delete/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const restoreDeclutteringListing = async (
  id,
  accessToken = getStoredAccessToken()
) => {
  if (!accessToken) {
    throw new ApiRequestError('Authentication required', 401)
  }

  const propertyId = toNumericPropertyId(id)
  if (propertyId === null) {
    throw new ApiRequestError('Invalid property id provided for restore', 400)
  }

  return request(`/api/listings/properties/${propertyId}/restore/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export const refreshAuthToken = async (
  refreshToken = getStoredRefreshToken(),
  skipAuthRefresh = false
) => {
  if (!refreshToken) {
    throw new ApiRequestError('Refresh token is required', 401)
  }

  return request('/api/auth/token/refresh/', {
    method: 'POST',
    skipAuthRefresh,
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  })
}

export const persistRefreshedAuthTokens = (refreshResponse = {}) => {
  if (typeof window === 'undefined') return

  const newAccessToken = refreshResponse.access || refreshResponse.access_token || null
  const newRefreshToken = refreshResponse.refresh || refreshResponse.refresh_token || null

  if (newAccessToken) {
    localStorage.setItem('fhf-access-token', newAccessToken)
    localStorage.setItem('access_token', newAccessToken)
  }

  if (newRefreshToken) {
    localStorage.setItem('fhf-refresh-token', newRefreshToken)
    localStorage.setItem('refresh_token', newRefreshToken)
  }
}
