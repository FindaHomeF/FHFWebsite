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

const request = async (path, options = {}) => {
  const endpoint = buildEndpoint(path)
  let response

  try {
    response = await fetch(endpoint, {
      ...options,
      headers: {
        ...AUTH_JSON_HEADERS,
        ...(options.headers || {}),
      },
    })
  } catch (error) {
    throw new ApiRequestError(
      `Network error: Unable to reach auth service at ${endpoint}. Ensure backend is running and CORS allows this origin.`,
      0
    )
  }

  if (!response.ok) {
    const errorMessage = await parseApiError(response)
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
