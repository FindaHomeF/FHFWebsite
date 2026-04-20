// Student ID validation utility
// Format: cys/19/0575 (3 letters / 2 digits year / 4 digits ID)

export const validateStudentId = (studentId) => {
  if (!studentId) {
    return {
      isValid: false,
      error: 'Student ID is required'
    }
  }

  // Remove any whitespace and convert to lowercase for validation
  const cleaned = studentId.trim().toLowerCase()
  
  // Pattern: 3 letters / 2 digits / 4 digits
  // Example: cys/19/0575
  const studentIdPattern = /^[a-z]{3}\/\d{2}\/\d{4}$/

  if (!studentIdPattern.test(cleaned)) {
    return {
      isValid: false,
      error: 'Invalid Student ID format. Expected format: ABC/YY/XXXX (e.g., CYS/19/0575)'
    }
  }

  // Extract year from student ID (2 digits after the first slash)
  const parts = cleaned.split('/')
  const yearDigits = parts[1] // e.g., "19"
  
  // Convert 2-digit year to full year
  // FUTA typically uses last 2 digits of admission year
  // e.g., 19 = 2019, 20 = 2020, 21 = 2021, etc.
  // For years 00-99, we assume 2000-2099 range (modern FUTA context)
  const yearNum = parseInt(yearDigits)
  const currentYear = new Date().getFullYear()
  const currentYearLastTwo = currentYear % 100
  
  // Determine full year - if 2-digit year is greater than current year's last 2 digits,
  // assume it's from previous century (very old student), otherwise assume 2000s
  let admissionYear
  if (yearNum > currentYearLastTwo && yearNum >= 70) {
    // Very old admission (e.g., 98 in 2024 context would be 1998)
    admissionYear = 1900 + yearNum
  } else {
    // Recent admission (e.g., 19 = 2019, 20 = 2020)
    admissionYear = 2000 + yearNum
  }

  if (admissionYear > currentYear) {
    return {
      isValid: false,
      error: `Admission year cannot be beyond ${currentYear}`
    }
  }

  // Calculate years since admission
  const yearsSinceAdmission = currentYear - admissionYear
  
  // Flag if more than 5 years (students typically graduate in 4-5 years)
  // Flag if yearsSinceAdmission > 5 (so 6+ years ago)
  const isExpired = yearsSinceAdmission > 5

  return {
    isValid: true,
    admissionYear,
    yearsSinceAdmission,
    isExpired,
    error: null,
    warning: isExpired 
      ? `This student ID indicates admission in ${admissionYear} (${yearsSinceAdmission} years ago). Students typically graduate within 4-5 years. Please verify this is correct.`
      : null
  }
}

// Format student ID with proper capitalization
export const formatStudentId = (studentId) => {
  if (!studentId) return ''
  
  const cleaned = studentId.trim().toUpperCase()
  // Ensure proper format
  const parts = cleaned.split('/')
  if (parts.length === 3) {
    return `${parts[0]}/${parts[1]}/${parts[2]}`
  }
  return cleaned
}

