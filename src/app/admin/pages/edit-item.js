'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter, useParams, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from './components/ImageUpload'
import { toast } from 'sonner'
import { usePartialUpdateDeclutteringListing } from '@/lib/mutations'
import {
  createDeclutteringListingImage,
  deleteDeclutteringListingImage,
  getDeclutteringListingById,
  getDeclutteringListingImages,
  setDeclutteringListingImageFeatured,
  updateDeclutteringListingImage,
} from '@/lib/auth-api'

const DECLUTTER_FORM_CONDITION_MAP = {
  Excellent: 'LIKE_NEW',
  Good: 'GOOD',
  Fair: 'FAIR',
  Poor: 'POOR',
}

const DECLUTTER_STATUS_MAP = {
  Pending: 'PENDING_APPROVAL',
  Available: 'ACTIVE',
  Sold: 'SOLD',
  Draft: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  SOLD: 'SOLD',
  DRAFT: 'DRAFT',
  EXPIRED: 'EXPIRED',
}

const BACKEND_CONDITION_TO_FORM_MAP = {
  NEW: 'Excellent',
  LIKE_NEW: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
  'N/A': 'Poor',
}

const toNumericItemId = (id) => {
  if (id === null || id === undefined) return null
  const normalized = String(id).trim().replace(/^#D/i, '')
  if (!/^\d+$/.test(normalized)) return null
  const parsed = Number(normalized)
  return Number.isInteger(parsed) ? parsed : null
}

const extractImageValues = (images = []) => {
  if (!Array.isArray(images)) return []
  return images
    .map((entry) => {
      if (typeof entry === 'string') return entry
      if (!entry || typeof entry !== 'object') return null
      return entry.image || entry.url || entry.src || null
    })
    .filter(Boolean)
}

const normalizeImageRecord = (entry, index) => {
  if (!entry || typeof entry !== 'object') return null
  const imageUrl = entry.image || entry.url || entry.src || null
  if (!imageUrl) return null
  return {
    id: entry.id ?? null,
    image: imageUrl,
    caption: entry.caption || `Image ${index + 1}`,
    display_order:
      entry.display_order !== undefined && entry.display_order !== null
        ? Number(entry.display_order)
        : index,
    is_featured: Boolean(entry.is_featured ?? index === 0),
  }
}

const normalizeListingImageRecords = (images = []) => {
  if (!Array.isArray(images)) return []
  const records = images
    .map(normalizeImageRecord)
    .filter(Boolean)
    .sort((a, b) => {
      const orderA = Number.isFinite(a.display_order) ? a.display_order : Number.MAX_SAFE_INTEGER
      const orderB = Number.isFinite(b.display_order) ? b.display_order : Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })
  const featuredIndex = records.findIndex((record) => record.is_featured)
  if (featuredIndex > 0) {
    const [featured] = records.splice(featuredIndex, 1)
    records.unshift(featured)
  }
  return records
}

const formatPriceInputValue = (listing = {}) => {
  if (listing.price_display) {
    const parsedFromDisplay = String(listing.price_display).replace(/[^\d.]/g, '')
    if (parsedFromDisplay) return parsedFromDisplay
  }
  const numericPrice = Number(listing.price)
  if (!Number.isFinite(numericPrice)) return ''
  return String(Math.max(Math.round(numericPrice / 100), 0))
}

const normalizeBackendListingForEdit = (listing, itemId) => {
  const normalizedImageRecords = normalizeListingImageRecords(listing?.images || [])
  return {
    id: String(listing?.id || itemId),
    title: listing?.title || '',
    price: formatPriceInputValue(listing),
    category: listing?.property_type || '',
    condition: BACKEND_CONDITION_TO_FORM_MAP[listing?.condition] || 'Good',
    location: listing?.location || '',
    sellerName: listing?.contact_info || '',
    description: listing?.description || '',
    inventory: Number(listing?.inventory || 1),
    images: normalizedImageRecords.map((record) => record.image),
    imageRecords: normalizedImageRecords,
    status: listing?.status || 'DRAFT',
    isNegotiable: Boolean(listing?.features?.is_negotiable),
    isPremium: Boolean(listing?.features?.is_featured),
  }
}

const findLocalItemById = (items, itemId) => {
  const numericItemId = toNumericItemId(itemId)
  return items.find((item) => {
    const currentId = item?.id || item?.itemId
    return (
      String(currentId) === String(itemId) ||
      (numericItemId !== null && toNumericItemId(currentId) === numericItemId)
    )
  })
}

const EditItemPage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const itemId = params?.id ? decodeURIComponent(params.id) : null
  const [isLoading, setIsLoading] = useState(true)
  const [existingItem, setExistingItem] = useState(null)
  const [hasTouchedFeaturedImage, setHasTouchedFeaturedImage] = useState(false)
  const [hasTouchedOtherImages, setHasTouchedOtherImages] = useState(false)
  const partialUpdateDeclutteringListingMutation = usePartialUpdateDeclutteringListing()

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
      price: '',
      description: '',
      category: '',
      condition: '',
      location: '',
      sellerName: '',
      inventory: 1,
      featuredImage: null,
      otherImages: []
    }
  })

  // Load item data from localStorage
  useEffect(() => {
    const loadListing = async () => {
      if (typeof window === 'undefined' || !itemId) return
      setIsLoading(true)

      let resolvedItem = null

      try {
        const backendListing = await getDeclutteringListingById(itemId)
        const backendImages = await getDeclutteringListingImages(itemId).catch(() => [])
        const normalizedImageRecords = normalizeListingImageRecords(backendImages)
        resolvedItem = normalizeBackendListingForEdit(
          {
            ...backendListing,
            images: normalizedImageRecords.length > 0 ? normalizedImageRecords : backendListing?.images,
          },
          itemId
        )
      } catch {
        const items = JSON.parse(localStorage.getItem('items') || '[]')
        const localItem = findLocalItemById(items, itemId)
        if (localItem) {
          const imageRecords = normalizeListingImageRecords(localItem?.images || [])
          resolvedItem = {
            ...localItem,
            price: String(localItem?.price || '').replace(/[₦\s,]/g, ''),
            imageRecords,
            images: imageRecords.length > 0 ? imageRecords.map((record) => record.image) : localItem?.images || [],
          }
        }
      }

      if (resolvedItem) {
        setExistingItem(resolvedItem)
        reset({
          title: resolvedItem.title || '',
          price: resolvedItem.price || '',
          description: resolvedItem.description || '',
          category: resolvedItem.category || '',
          condition: resolvedItem.condition || 'Good',
          location: resolvedItem.location || '',
          sellerName: resolvedItem.sellerName || '',
          inventory: resolvedItem.inventory || 1,
          featuredImage: null,
          otherImages: [],
        })
        setValue('category', resolvedItem.category || '')
        setValue('condition', resolvedItem.condition || 'Good')
        setHasTouchedFeaturedImage(false)
        setHasTouchedOtherImages(false)
      } else {
        toast.error('Unable to load listing for editing')
      }

      setIsLoading(false)
    }

    loadListing()
  }, [itemId, reset, setValue])

  const onSubmit = async (data) => {
    console.log('Updated form data:', data)
    let loadingToastId
    try {
      loadingToastId = toast.loading('Updating item...')
      
      const existingItems = JSON.parse(localStorage.getItem('items') || '[]')
      const itemIndex = existingItems.findIndex((item) => {
        const currentId = item?.id || item?.itemId
        return (
          String(currentId) === String(itemId) ||
          (toNumericItemId(currentId) !== null && toNumericItemId(currentId) === toNumericItemId(itemId))
        )
      })
      
      {
        const featuredInput = data.featuredImage
        const otherImagesInput = Array.isArray(data.otherImages) ? data.otherImages : []
        const imageRecords = Array.isArray(existingItem?.imageRecords) ? existingItem.imageRecords : []
        const featuredRecord = imageRecords[0] || null
        const galleryRecords = imageRecords.slice(1)

        const imageUploads = []
        const imageUpdates = []
        const imageDeletes = []

        if (hasTouchedFeaturedImage) {
          if (featuredInput instanceof File) {
            if (featuredRecord?.id) {
              imageUpdates.push({
                imageId: featuredRecord.id,
                payload: {
                  image: featuredInput,
                  caption: featuredRecord.caption || 'Featured image',
                  is_featured: true,
                },
              })
            } else {
              imageUploads.push({
                image: featuredInput,
                caption: 'Featured image',
                is_featured: true,
              })
            }
          } else if (typeof featuredInput === 'string' && featuredInput.trim() !== '') {
            if (!featuredRecord?.id) {
              imageUploads.push({
                image: featuredInput,
                caption: 'Featured image',
                is_featured: true,
              })
            }
          } else if (featuredRecord?.id) {
            imageDeletes.push(featuredRecord.id)
          }
        }

        if (hasTouchedOtherImages) {
          galleryRecords
            .filter((record) => record?.id)
            .forEach((record) => imageDeletes.push(record.id))

          otherImagesInput.forEach((entry, index) => {
            const isUrlString =
              typeof entry === 'string' &&
              entry.trim() !== '' &&
              !entry.startsWith('blob:') &&
              !entry.startsWith('data:')

            if (entry instanceof File || isUrlString) {
              imageUploads.push({
                image: entry,
                caption: `Gallery image ${index + 1}`,
                is_featured: false,
              })
            }
          })
        }

        const fallbackLocalImages = (
          [
            typeof featuredInput === 'string' && !featuredInput.startsWith('blob:') && !featuredInput.startsWith('data:')
              ? featuredInput
              : null,
            ...otherImagesInput.filter(
              (entry) =>
                typeof entry === 'string' &&
                !entry.startsWith('blob:') &&
                !entry.startsWith('data:')
            ),
          ].filter(Boolean)
        )

        const localUpdatedItem = {
          ...existingItems[itemIndex],
          id: itemId,
          title: data.title,
          price: `₦${data.price}`,
          category: data.category,
          condition: data.condition,
          location: data.location,
          sellerName: data.sellerName || '',
          description: data.description,
          inventory: parseInt(data.inventory) || 1,
          images: fallbackLocalImages.length > 0 ? fallbackLocalImages : existingItem?.images || []
        }

        const updatedListing = await partialUpdateDeclutteringListingMutation.mutateAsync({
          id: itemId,
          payload: {
            property_type: 'ITEM',
            title: data.title,
            description: data.description,
            price: data.price,
            currency: 'NGN',
            condition: DECLUTTER_FORM_CONDITION_MAP[data.condition] || 'GOOD',
            status: DECLUTTER_STATUS_MAP[existingItem?.status] || 'DRAFT',
            location: data.location,
            contactInfo: data.sellerName || '',
            features: {
              is_negotiable: Boolean(existingItem?.isNegotiable),
              is_delivery_available: false,
              is_featured: Boolean(existingItem?.isPremium),
            },
          },
        })

        if (imageUpdates.length > 0) {
          await Promise.all(
            imageUpdates.map((entry) =>
              updateDeclutteringListingImage(itemId, entry.imageId, entry.payload)
            )
          )
        }

        if (imageDeletes.length > 0) {
          await Promise.all(
            [...new Set(imageDeletes)].map((imageId) =>
              deleteDeclutteringListingImage(itemId, imageId)
            )
          )
        }

        if (imageUploads.length > 0) {
          await Promise.all(
            imageUploads.map((entry) =>
              createDeclutteringListingImage(itemId, entry)
            )
          )
        }

        let backendImageRecords = await getDeclutteringListingImages(itemId).catch(() => [])
        let normalizedBackendRecords = normalizeListingImageRecords(backendImageRecords)

        // Keep featured-image intent authoritative using backend set_featured endpoint.
        if (hasTouchedFeaturedImage && featuredInput) {
          const targetFeaturedRecord = normalizedBackendRecords[0]
          if (targetFeaturedRecord?.id) {
            await setDeclutteringListingImageFeatured(itemId, targetFeaturedRecord.id, {
              image: targetFeaturedRecord.image,
              caption: targetFeaturedRecord.caption,
            })
            backendImageRecords = await getDeclutteringListingImages(itemId).catch(() => backendImageRecords)
            normalizedBackendRecords = normalizeListingImageRecords(backendImageRecords)
          }
        }

        const backendImages = normalizedBackendRecords.map((record) => record.image)
        if (itemIndex !== -1) {
          existingItems[itemIndex] = localUpdatedItem
        } else {
          existingItems.push(localUpdatedItem)
        }
        if (backendImages.length > 0) {
          existingItems[itemIndex !== -1 ? itemIndex : existingItems.length - 1].images = backendImages
        } else if (updatedListing?.images) {
          existingItems[itemIndex !== -1 ? itemIndex : existingItems.length - 1].images = extractImageValues(updatedListing.images)
        }
        localStorage.setItem('items', JSON.stringify(existingItems))
        
        toast.success('Item updated successfully!')
        
        if (pathname?.startsWith('/student')) {
          router.push('/student/decluttering')
        } else {
          router.push(`/admin/items/${encodeURIComponent(itemId)}`)
        }
      }
    } catch (error) {
      console.error('Error updating item:', error)
      toast.error('Failed to update item. Please try again.')
    } finally {
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
      }
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="space-y-6 px-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Item</h1>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="px-6 py-2 border-black10 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="px-6 py-2 bg-primary text-white hover:bg-primary/90"
              >
                Update Item
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    {...register('title', { required: 'Title is required' })}
                    placeholder="Enter item title"
                    className="w-full border-black10"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₦</span>
                    <Input
                      {...register('price', { required: 'Price is required' })}
                      placeholder="0"
                      className="pl-8 w-full border-black10"
                      type="number"
                    />
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Textarea
                    {...register('description', { required: 'Description is required' })}
                    placeholder="Enter item description"
                    rows={4}
                    className="w-full border-black10"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Other Images
                  </label>
                  <ImageUpload
                    multiple={true}
                    onUpload={(files) => {
                      setHasTouchedOtherImages(true)
                      setValue('otherImages', files)
                    }}
                    placeholder="Upload Image here"
                    subtitle="High quality images only"
                    existingImages={existingItem?.images?.slice(1, 5) || []}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Select onValueChange={(value) => setValue('category', value)} defaultValue={watch('category')}>
                    <SelectTrigger className="w-full border-black10">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Books">Books</SelectItem>
                      <SelectItem value="Appliances">Appliances</SelectItem>
                      <SelectItem value="Room Decor">Room Decor</SelectItem>
                      <SelectItem value="Kitchen Items">Kitchen Items</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <Select onValueChange={(value) => setValue('condition', value)} defaultValue={watch('condition')}>
                    <SelectTrigger className="w-full border-black10">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condition && (
                    <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Featured Image *
                  </label>
                  <ImageUpload
                    multiple={false}
                    onUpload={(file) => {
                      setHasTouchedFeaturedImage(true)
                      setValue('featuredImage', file)
                    }}
                    placeholder="Upload Image here"
                    subtitle="High quality images only"
                    required={true}
                    existingImages={existingItem?.images?.[0] ? [existingItem.images[0]] : []}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <Input
                    {...register('location', { required: 'Location is required' })}
                    placeholder="Enter location"
                    className="w-full border-black10"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seller Name *
                  </label>
                  <Input
                    {...register('sellerName', { required: 'Seller name is required' })}
                    placeholder="Enter seller name"
                    className="w-full border-black10"
                  />
                  {errors.sellerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.sellerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inventory *
                  </label>
                  <Input
                    {...register('inventory', { 
                      required: 'Inventory is required',
                      min: { value: 0, message: 'Inventory cannot be negative' },
                      valueAsNumber: true
                    })}
                    placeholder="Enter inventory quantity"
                    className="w-full border-black10"
                    type="number"
                    min="0"
                  />
                  {errors.inventory && (
                    <p className="text-red-500 text-sm mt-1">{errors.inventory.message}</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditItemPage
