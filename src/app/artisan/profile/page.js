'use client'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, X, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { useArtisan } from '../context/ArtisanContext'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (error) => reject(error)
  })
}

export default function ArtisanProfilePage() {
  const { artisanProfile, setArtisanProfile, isProfileComplete, isNinUploaded, isNinApproved } = useArtisan()
  const [profileImage, setProfileImage] = useState(null)
  const [ninDocument, setNinDocument] = useState(null)

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      description: '',
      location: '',
      phone: '',
      email: '',
    }
  })

  useEffect(() => {
    if (artisanProfile) {
      reset({
        description: artisanProfile.description || '',
        location: artisanProfile.location || '',
        phone: artisanProfile.phone || '',
        email: artisanProfile.email || '',
      })
      if (artisanProfile.profilePicture) {
        setProfileImage(artisanProfile.profilePicture)
      }
      if (artisanProfile.ninDocument) {
        setNinDocument(artisanProfile.ninDocument)
      }
    }
  }, [artisanProfile, reset])

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      const base64 = await fileToBase64(file)
      setProfileImage(base64)
      setArtisanProfile({ profilePicture: base64 })
    }
  }

  const handleNinDocumentUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Document size should be less than 10MB')
        return
      }
      const base64 = await fileToBase64(file)
      setNinDocument(base64)
      setArtisanProfile({ 
        ninDocument: base64,
        ninApprovalStatus: 'pending' // Reset to pending when new document uploaded
      })
      toast.success('NIN document uploaded. Waiting for admin approval.')
    }
  }

  const onSubmit = async (data) => {
    try {
      setArtisanProfile({
        description: data.description,
        location: data.location,
        phone: data.phone,
        email: data.email,
      })
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    }
  }

  const getApprovalStatusBadge = () => {
    if (!isNinUploaded) {
      return (
        <Badge className="bg-gray-500 text-white">
          <AlertCircle className="w-3 h-3 mr-1" />
          Not Uploaded
        </Badge>
      )
    }
    if (isNinApproved) {
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
                    Upload a clear profile picture. This will be displayed to users when they view your services.
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
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Description About Yourself & Services *
              </label>
              <Textarea
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 50, message: 'Description must be at least 50 characters' }
                })}
                placeholder="Tell users about yourself, your services, experience, and what makes you trustworthy..."
                rows={5}
                className="w-full border-black10"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                This description will be shown to users when they view your services.
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

            {/* NIN Document Upload */}
            <div className="border-t border-black10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIN (National Identification Number) Document Upload *
                  </label>
                  <p className="text-xs text-gray-500">
                    Upload your NIN card (Required to create service listings)
                  </p>
                </div>
                {getApprovalStatusBadge()}
              </div>

              {ninDocument ? (
                <div className="border border-black10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">NIN Document</p>
                        <p className="text-xs text-gray-500">Document uploaded</p>
                      </div>
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleNinDocumentUpload}
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
                  {!isNinApproved && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-700">
                        <Clock className="w-4 h-4 inline mr-2" />
                        Your NIN document is pending admin approval. You'll be able to create service listings once approved.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Upload your NIN card
                  </p>
                  <label className="cursor-pointer inline-block">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleNinDocumentUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                    >
                      <span>Upload NIN Document</span>
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
                  {isNinUploaded ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={isNinUploaded ? 'text-green-700' : 'text-red-700'}>
                    NIN Document Uploaded
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isNinApproved ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                  <span className={isNinApproved ? 'text-green-700' : 'text-red-700'}>
                    NIN Document Approved
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

