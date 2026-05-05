'use client'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { validateStudentId, formatStudentId } from '@/lib/studentIdValidation'

const StudentIdInput = ({ 
  value, 
  onChange, 
  onValidationChange,
  placeholder = "CYS/19/0575",
  required = false,
  className = "",
  error,
  ...props 
}) => {
  const [validation, setValidation] = useState(null)
  const [localValue, setLocalValue] = useState(value || '')

  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value || '')
    }
  }, [value])

  const handleChange = (e) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    
    if (onChange) {
      onChange(e)
    }

    // Validate if there's a value
    if (newValue && newValue.trim()) {
      const validationResult = validateStudentId(newValue)
      setValidation(validationResult)
      
      // Auto-format if valid
      if (validationResult.isValid) {
        const formatted = formatStudentId(newValue)
        if (formatted !== newValue) {
          // Update with formatted value
          const syntheticEvent = {
            ...e,
            target: { ...e.target, value: formatted }
          }
          setLocalValue(formatted)
          if (onChange) {
            onChange(syntheticEvent)
          }
        }
      }
      
      // Notify parent of validation status
      if (onValidationChange) {
        onValidationChange(validationResult)
      }
    } else {
      setValidation(null)
      if (onValidationChange) {
        onValidationChange(null)
      }
    }
  }

  const inputClassName = `w-full border-black10 ${
    validation && !validation.isValid 
      ? 'border-red-500' 
      : validation?.isExpired 
      ? 'border-yellow-500' 
      : error
      ? 'border-red-500'
      : ''
  } ${className}`

  return (
    <div className="space-y-2">
      <Input
        {...props}
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={inputClassName}
      />
      
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
      
      {validation && !validation.isValid && !error && (
        <p className="text-red-500 text-sm">{validation.error}</p>
      )}
      
      {validation?.isValid && validation.isExpired && (
        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">Flagged for Review</p>
              <p className="text-sm text-yellow-800 mt-1">{validation.warning}</p>
            </div>
          </div>
        </div>
      )}
      
      {validation?.isValid && !validation.isExpired && (
        <p className="text-green-600 text-sm flex items-center gap-1">
          <CheckCircle className="w-4 h-4" />
          Valid Student ID (Admitted {validation.admissionYear})
        </p>
      )}
      
      <p className="text-xs text-gray-500">
        {/* Format: ABC/YY/XXXX (e.g., CYS/19/0575) - 3 letters, last 2 digits of admission year, 4-digit ID */}
      </p>
    </div>
  )
}

export default StudentIdInput

