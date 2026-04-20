'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { useStudent } from '../context/StudentContext'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { validateStudentId, formatStudentId } from '@/lib/studentIdValidation'
import StudentIdInput from '@/components/ui/student-id-input'
import { useUploadStudentIdDocument } from '@/lib/mutations'

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (error) => reject(error)
  })
}

export default function StudentProfilePage() {
  const { studentProfile, setStudentProfile, isProfileComplete, isStudentIdUploaded, isStudentIdApproved } = useStudent()
  const [profileImage, setProfileImage] = useState(null)
  const [studentIdDocument, setStudentIdDocument] = useState(null)
  const { mutateAsync: uploadStudentIdDocument, isPending: isUploadingStudentId } = useUploadStudentIdDocument()

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      description: '',
      location: '',
      phone: '',
      email: '',
      studentIdNumber: '',
    }
  })

  const [studentIdValidation, setStudentIdValidation] = useState(null)
  const studentIdValue = watch('studentIdNumber')

  useEffect(() => {
    if (studentProfile) {
      reset({
        description: studentProfile.description || '',
        location: studentProfile.location || '',
        phone: studentProfile.phone || '',
        email: studentProfile.email || '',
        studentIdNumber: studentProfile.studentIdNumber || '',
      })
      if (studentProfile.profilePicture) {
        setProfileImage(studentProfile.profilePicture)
      }
      if (studentProfile.studentIdDocument) {
        setStudentIdDocument(studentProfile.studentIdDocument)
      }
    }
  }, [studentProfile, reset])

  // Validation is handled by StudentIdInput component

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      const base64 = await fileToBase64(file)
      setProfileImage(base64)
      setStudentProfile({ profilePicture: base64 })
    }
  }

  const handleStudentIdDocumentUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Document size should be less than 10MB')
        return
      }
      try {
        const response = await uploadStudentIdDocument({ studentIdDocument: file })
        const uploadedDocument =
          response?.student_id_document || response?.studentIdDocument || file.name
        const approvalStatus =
          response?.student_id_approval_status || response?.studentIdApprovalStatus || 'pending'

        setStudentIdDocument(uploadedDocument)
        setStudentProfile({
          studentIdDocument: uploadedDocument,
          studentIdApprovalStatus: approvalStatus,
        })
      } catch {
        // Error handled in mutation.
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      // Validate student ID before submission
      if (data.studentIdNumber) {
        const validation = validateStudentId(data.studentIdNumber)
        if (!validation.isValid) {
          toast.error(validation.error)
          return
        }
        
        // Store validation info for admin review
        const profileData = {
          description: data.description,
          location: data.location,
          phone: data.phone,
          email: data.email,
          studentIdNumber: formatStudentId(data.studentIdNumber),
          studentIdValidation: {
            admissionYear: validation.admissionYear,
            yearsSinceAdmission: validation.yearsSinceAdmission,
            isExpired: validation.isExpired,
            flagged: validation.isExpired
          }
        }
        
        setStudentProfile(profileData)
        
        if (validation.isExpired) {
          toast.warning(validation.warning, { duration: 6000 })
        } else {
          toast.success('Profile updated successfully!')
        }
      } else {
        setStudentProfile({
          description: data.description,
          location: data.location,
          phone: data.phone,
          email: data.email,
          studentIdNumber: data.studentIdNumber,
        })
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    }
  }

  const getApprovalStatusBadge = () => {
    if (!isStudentIdUploaded) {
      return (
        <Badge className="bg-gray-500 text-white">
          <AlertCircle className="w-3 h-3 mr-1" />
          Not Uploaded
        </Badge>
      )
    }
    if (isStudentIdApproved) {
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      )
    }
    return (
      <Badge className="bg-orange-500 text-white">
        <Clock className="w-3 h-3 mr-1" />
        Pending Approval
      </Badge>
    )
  }

  return (
    <div className="space-y-6 px-6 pb-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Management</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture */}
            <div className="border-b border-black10 pb-6">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Profile Picture *
              </label>
              <div className="flex items-center gap-6">
                <div className="relative">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={120}
                      height={120}
                      className="w-30 h-30 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <div className="w-30 h-30 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <label className="absolute inset-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Upload a clear profile picture. This will be displayed to users when they view your listings.
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      className="text-sm"
                    >
                      <span>{profileImage ? 'Change Picture' : 'Upload Picture'}</span>
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <Input
                  {...register('phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                  placeholder="08012345678"
                  className="w-full border-black10"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  placeholder="email@example.com"
                  className="w-full border-black10"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID Number
                </label>
                <StudentIdInput
                  value={studentIdValue || ''}
                  onChange={(e) => {
                    setValue('studentIdNumber', e.target.value)
                  }}
                  onValidationChange={setStudentIdValidation}
                  placeholder="ABC/14/0000"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Description About Yourself *
              </label>
              <Textarea
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 50, message: 'Description must be at least 50 characters' }
                })}
                placeholder="Tell users about yourself, your interests, and what makes you trustworthy..."
                rows={5}
                className="w-full border-black10"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                This description will be shown to users when they view your listings.
                Minimum 50 characters required.
              </p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <Input
                {...register('location', { required: 'Location is required' })}
                placeholder="Enter your location (e.g., North Gate, Akure)"
                className="w-full border-black10"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Student ID Document Upload */}
            <div className="border-t border-black10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID Card Upload *
                  </label>
                  <p className="text-xs text-gray-500">
                    Upload your Student ID card (Required to create listings and use roommate finder)
                  </p>
                </div>
                {getApprovalStatusBadge()}
              </div>

              {studentIdDocument ? (
                <div className="border border-black10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Student ID Card</p>
                        <p className="text-xs text-gray-500">Document uploaded</p>
                      </div>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleStudentIdDocumentUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isUploadingStudentId}
                        asChild
                      >
                        <span>{isUploadingStudentId ? 'Uploading...' : 'Change Document'}</span>
                      </Button>
                    </label>
                  </div>
                  {!isStudentIdApproved && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-700">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Your Student ID is pending admin approval. You'll be able to create listings and use roommate finder once approved.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your Student ID card
                  </p>
                  <label className="cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleStudentIdDocumentUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploadingStudentId}
                      asChild
                    >
                      <span>{isUploadingStudentId ? 'Uploading...' : 'Upload Student ID'}</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>

            {/* Profile Completion Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Profile Completion</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {profileImage ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={profileImage ? 'text-green-700' : 'text-red-700'}>
                    Profile Picture
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {watch('phone') ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={watch('phone') ? 'text-green-700' : 'text-red-700'}>
                    Phone Number
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {watch('description')?.length >= 50 ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={watch('description')?.length >= 50 ? 'text-green-700' : 'text-red-700'}>
                    Description (min 50 characters)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {watch('location') ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={watch('location') ? 'text-green-700' : 'text-red-700'}>
                    Location
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isStudentIdUploaded ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={isStudentIdUploaded ? 'text-green-700' : 'text-red-700'}>
                    Student ID Document Uploaded
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isStudentIdApproved ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={isStudentIdApproved ? 'text-green-700' : 'text-red-700'}>
                    Student ID Document Approved
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button
                type="submit"
                className="px-6 py-2 bg-primary text-white hover:bg-primary/90"
              >
                Save Profile
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

