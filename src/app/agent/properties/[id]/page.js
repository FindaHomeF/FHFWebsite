'use client'
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

export default function AgentPropertyDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params?.id
  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && propertyId) {
      const properties = JSON.parse(localStorage.getItem('properties') || '[]')
      const found = properties.find(p => p.id === propertyId)
      setProperty(found)
      setIsLoading(false)
    }
  }, [propertyId])

  const handleDelete = () => {
    const properties = JSON.parse(localStorage.getItem('properties') || '[]')
    const filtered = properties.filter(p => p.id !== propertyId)
    localStorage.setItem('properties', JSON.stringify(filtered))
    setIsDeleteDialogOpen(false)
    router.push('/agent/properties')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="space-y-6 px-6">
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Property not found</p>
          <Link href="/agent/properties">
            <Button className="mt-4">Back to Properties</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusBadgeStyles = {
    'Active': 'bg-[#4EC50E] text-white',
    'Pending': 'bg-[#C5B60E] text-white',
    'Inactive': 'bg-[#E01A1A] text-white'
  }

  return (
    <div className="space-y-6 px-6 pb-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
        </div>
        <Link href={`/agent/properties/edit/${propertyId}`}>
          <Button variant="outline" className="mr-2">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </Link>
        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 hover:text-red-700">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Property Images</h2>
            <div className="grid grid-cols-2 gap-4">
              {property.images?.map((img, index) => (
                <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={img}
                    alt={`Property image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-gray-700">{property.description}</p>
          </div>

          {property.otherFeatures && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Other Features</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.otherFeatures}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Details</h2>
              <Badge className={statusBadgeStyles[property.status]}>
                {property.status}
              </Badge>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-500">Price</span>
                <p className="font-semibold text-lg">{property.price}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Category</span>
                <p className="font-medium">{property.category}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Location</span>
                <p className="font-medium">{property.location}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Condition</span>
                <p className="font-medium">{property.condition}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Inventory</span>
                <p className="font-medium">{property.inventory || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Features</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Rooms</span>
                <span className="font-medium">{property.room || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bathrooms</span>
                <span className="font-medium">{property.bathroom || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kitchens</span>
                <span className="font-medium">{property.kitchen || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Parking</span>
                <span className="font-medium">{property.parking || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Balcony</span>
                <span className="font-medium">{property.balcony || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmActionDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete property?"
        description="This permanently removes the property from your listings."
        confirmText="Delete property"
        onConfirm={handleDelete}
      />
    </div>
  )
}

