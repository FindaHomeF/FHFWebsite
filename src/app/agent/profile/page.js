'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { useAgent } from '../context/AgentContext'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import StudentIdInput from '@/components/ui/student-id-input'
import { validateStudentId, formatStudentId } from '@/lib/studentIdValidation'

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (error) => reject(error)
  })
}

export default function AgentProfilePage() {
  const { agentProfile, setAgentProfile, isProfileComplete, isIdUploaded, isIdApproved } = useAgent()
  const [profileImage, setProfileImage] = useState(null)
  const [idDocument, setIdDocument] = useState(null)
  const [userType, setUserType] = useState('student') // 'student' or 'other'

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      description: '',
      location: '',
      studentIdNumber: '',
    }
  })

  const [studentIdValidation, setStudentIdValidation] = useState(null)

  useEffect(() => {
    if (agentProfile) {
      reset({
        description: agentProfile.description || '',
        location: agentProfile.location || '',
        studentIdNumber: agentProfile.studentIdNumber || '',
      })
      if (agentProfile.profilePicture) {
        setProfileImage(agentProfile.profilePicture)
      }
      if (agentProfile.idDocument) {
        setIdDocument(agentProfile.idDocument)
      }
      if (agentProfile.userType) {
        setUserType(agentProfile.userType)
      }
    }
  }, [agentProfile, reset])

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      const base64 = await fileToBase64(file)
      setProfileImage(base64)
      setAgentProfile({ profilePicture: base64 })
    }
  }

  const handleIdDocumentUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Document size should be less than 10MB')
        return
      }
      const base64 = await fileToBase64(file)
      setIdDocument(base64)
      setAgentProfile({ 
        idDocument: base64,
        idApprovalStatus: 'pending' // Reset to pending when new document uploaded
      })
      toast.success('ID document uploaded. Waiting for admin approval.')
    }
  }

  const onSubmit = async (data) => {
    try {
      // Validate student ID if user type is student and ID is provided
      if (userType === 'student' && data.studentIdNumber) {
        const validation = validateStudentId(data.studentIdNumber)
        if (!validation.isValid) {
          toast.error(validation.error)
          return
        }
        
        const profileData = {
          description: data.description,
          location: data.location,
          userType: userType,
          studentIdNumber: formatStudentId(data.studentIdNumber),
          studentIdValidation: {
            admissionYear: validation.admissionYear,
            yearsSinceAdmission: validation.yearsSinceAdmission,
            isExpired: validation.isExpired,
            flagged: validation.isExpired
          }
        }
        
        setAgentProfile(profileData)
        
        if (validation.isExpired) {
          toast.warning(validation.warning, { duration: 6000 })
        } else {
          toast.success('Profile updated successfully!')
        }
      } else {
        setAgentProfile({
          description: data.description,
          location: data.location,
          userType: userType,
          studentIdNumber: data.studentIdNumber || ''
        })
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    }
  }

  const getApprovalStatusBadge = () => {
    if (!isIdUploaded) {
      return (
        <Badge className="bg-gray-500 text-white">
          <AlertCircle className="w-3 h-3 mr-1" />
          Not Uploaded
        </Badge>
      )
    }
    if (isIdApproved) {
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
    <div className="space-y-6 pb-6">
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
                    Upload a clear profile picture. This will be displayed to users when they view your profile.
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
                placeholder="Tell users about yourself, your experience, and what makes you trustworthy..."
                rows={5}
                className="w-full border-black10"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                This description will be shown to users when they click on your profile picture.
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

            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Type *
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full border border-black10 rounded-lg px-3 py-2"
              >
                <option value="student">Student</option>
                <option value="other">Other (Professional, Landlord, etc.)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select based on your ID document type
              </p>
            </div>

            {/* Student ID Number - Only show if user type is student */}
            {userType === 'student' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student ID Number
                </label>
                <StudentIdInput
                  value={watch('studentIdNumber')}
                  onChange={(e) => {
                    setValue('studentIdNumber', e.target.value)
                  }}
                  onValidationChange={setStudentIdValidation}
                  placeholder="CYS/19/0575"
                />
              </div>
            )}

            {/* ID Document Upload */}
            <div className="border-t border-black10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Document Upload *
                  </label>
                  <p className="text-xs text-gray-500">
                    {userType === 'student' 
                      ? 'Upload your Student ID card (Required to manage decluttered items)'
                      : 'Upload your NIN card or Driver\'s License (Required to manage decluttered items)'
                    }
                  </p>
                </div>
                {getApprovalStatusBadge()}
              </div>

              {idDocument ? (
                <div className="border border-black10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {userType === 'student' ? 'Student ID' : 'ID Document'}
                        </p>
                        <p className="text-xs text-gray-500">Document uploaded</p>
                      </div>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleIdDocumentUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <span>Change Document</span>
                      </Button>
                    </label>
                  </div>
                  {!isIdApproved && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-700">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Your ID document is pending admin approval. You'll be able to manage decluttered items once approved.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    {userType === 'student' 
                      ? 'Upload your Student ID card'
                      : 'Upload your NIN card or Driver\'s License'
                    }
                  </p>
                  <label className="cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleIdDocumentUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                    >
                      <span>Upload Document</span>
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
                  {isIdUploaded ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={isIdUploaded ? 'text-green-700' : 'text-red-700'}>
                    ID Document Uploaded
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isIdApproved ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={isIdApproved ? 'text-green-700' : 'text-red-700'}>
                    ID Document Approved
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

