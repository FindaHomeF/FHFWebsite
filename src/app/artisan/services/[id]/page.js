'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Eye, MapPin, Phone, Mail, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Image from 'next/image'
import ThumbnailGallery from '@/app/components/global/ThumbnailGallery'
import PremiumToggle from '@/components/ui/premium-toggle'
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

export default function ServiceDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [service, setService] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      const services = JSON.parse(localStorage.getItem('services') || '[]')
      const foundService = services.find(s => s.id === id)
      
      if (foundService) {
        setService(foundService)
      } else {
        toast.error('Service not found')
        router.push('/artisan/services')
      }
      setIsLoading(false)
    }
  }, [id, router])

  const handleBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/artisan/services/edit/${id}`)
  }

  const handleDelete = () => {
    try {
      const services = JSON.parse(localStorage.getItem('services') || '[]')
      const filteredServices = services.filter(s => s.id !== id)
      localStorage.setItem('services', JSON.stringify(filteredServices))
      
      toast.success('Service deleted successfully!')
      setIsDeleteDialogOpen(false)
      router.push('/artisan/services')
    } catch (error) {
      toast.error('Failed to delete service')
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      Active: 'bg-green-600 text-white',
      Pending: 'bg-yellow-600 text-white',
      Inactive: 'bg-red-600 text-white'
    }
    return (
      <Badge className={styles[status] || 'bg-gray-600 text-white'}>
        {status}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="px-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">Service not found</p>
          <Button onClick={() => router.push('/artisan/services')} className="mt-4">
            Back to Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 px-6">
      <div className="bg-white rounded-lg shadow-sm max-h-screen">
        <div className="flex items-center justify-between sticky top-0 bg-white z-10 pb-8 pt-4 border-b backdrop-blur-md px-6 border-b-black10">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleEdit}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-4 py-2"
            >
              <Edit className="w-4 h-4" />
              Edit Service
            </Button>
            
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Images</h2>
            
            <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={service.images?.[selectedImage] || '/hero-image.jpeg'}
                alt={service.serviceName}
                className="w-full h-full object-cover"
              />
            </div>
            
            {service.images && service.images.length > 1 && (
              <ThumbnailGallery
                images={service.images}
                selectedIndex={selectedImage}
                onSelect={setSelectedImage}
              />
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Service Name:</span>
                  <span className="text-gray-900 font-semibold">{service.serviceName}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="text-gray-900">{service.category}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Price Range:</span>
                  <span className="text-gray-900 font-semibold">
                    {service.minPrice && service.maxPrice 
                      ? `₦${parseInt(service.minPrice).toLocaleString()} - ₦${parseInt(service.maxPrice).toLocaleString()}`
                      : service.price 
                      ? `₦${parseInt(service.price).toLocaleString()}`
                      : 'N/A'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Location:</span>
                  <div className="flex items-center gap-1 text-gray-900">
                    <MapPin className="w-4 h-4" />
                    {service.location}
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Phone:</span>
                  <div className="flex items-center gap-1 text-gray-900">
                    <Phone className="w-4 h-4" />
                    {service.phone || 'N/A'}
                  </div>
                </div>
                
                {service.email && (
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                    <span className="font-medium text-gray-700">Email:</span>
                    <div className="flex items-center gap-1 text-gray-900">
                      <Mail className="w-4 h-4" />
                      {service.email}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Availability:</span>
                  <span className="text-gray-900 capitalize">{service.availability || 'Available'}</span>
                </div>
                
                <div className="flex justify-between items-start py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Description:</span>
                  <span className="text-gray-900 text-right max-w-xs">{service.description}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-dashed border-black33">
                  <span className="font-medium text-gray-700">Status:</span>
                  {getStatusBadge(service.status)}
                </div>
                
                {service.createdAt && (
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-gray-700">Created:</span>
                    <div className="flex items-center gap-1 text-gray-900">
                      <Clock className="w-4 h-4" />
                      {new Date(service.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Premium Toggle Section */}
        <div className="px-6 pb-6">
          <PremiumToggle
            listingId={service.id}
            listingType="service"
            currentPremium={service.isPremium || false}
            premiumExpiry={service.premiumExpiry}
            onToggle={(value) => {
              // Update service premium status
              const services = JSON.parse(localStorage.getItem('services') || '[]')
              const updatedServices = services.map(s => 
                s.id === service.id 
                  ? { ...s, isPremium: value, premiumExpiry: value ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() : null }
                  : s
              )
              localStorage.setItem('services', JSON.stringify(updatedServices))
              setService(prev => ({ ...prev, isPremium: value }))
            }}
            isAdmin={false}
            redirectToPayment={false}
          />
        </div>
      </div>

      <ConfirmActionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title='Delete service?'
        description='This action cannot be undone.'
        confirmText='Delete service'
        onConfirm={handleDelete}
      />
    </div>
  )
}

