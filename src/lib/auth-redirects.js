const normalizeRole = (role = '') => String(role).trim().toLowerCase()

export const getDashboardPathByRole = (role) => {
  const normalizedRole = normalizeRole(role)

  if (['admin', 'subadmin', 'sub_admin', 'support'].includes(normalizedRole)) {
    return '/admin'
  }
  if (normalizedRole === 'agent') return '/agent'
  if (normalizedRole === 'artisan') return '/artisan'
  if (normalizedRole === 'student') return '/student'

  return '/'
}
