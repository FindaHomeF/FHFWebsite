'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import ImageUpload from '@/app/admin/pages/components/ImageUpload'
import CommissionCalculator from '@/components/ui/commission-calculator'
import PremiumToggle from '@/components/ui/premium-toggle'
import { toast } from 'sonner'
import { useAgent } from '../../context/AgentContext'
import { Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useCreateDeclutteringListing } from '@/lib/mutations'

const DECLUTTER_FORM_CONDITION_MAP = {
  Excellent: 'LIKE_NEW',
  Good: 'GOOD',
  Fair: 'FAIR',
  Poor: 'POOR',
}

const AddItemPage = () => {
  const router = useRouter()
  const { canManageItems, isProfileComplete, isIdUploaded, isIdApproved } = useAgent()
  const createDeclutteringListingMutation = useCreateDeclutteringListing()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
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
      otherImages: [],
      isPremium: false
    }
  })

  const price = watch('price')

  if (!canManageItems) {
    return (
      <div className="space-y-6 px-6 pb-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-8">
          <div className="flex items-start gap-4">
            <Lock className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-orange-900 mb-3">Access Restricted</h2>
              <p className="text-orange-700 mb-4">
                To add decluttered items, you need to complete your profile and get ID approval.
              </p>
              <ul className="space-y-2 mb-6 text-orange-700">
                {!isProfileComplete && (
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Complete your profile</span>
                  </li>
                )}
                {!isIdUploaded && (
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Upload your ID document</span>
                  </li>
                )}
                {!isIdApproved && (
                  <li className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Wait for admin approval</span>
                  </li>
                )}
              </ul>
              <Link href="/agent/profile">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Go to Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const onSubmit = async (data) => {
    let loadingToastId
    try {
      if (!data.featuredImage && (!data.otherImages || data.otherImages.length === 0)) {
        toast.error('Please upload at least one image')
        return
      }

      loadingToastId = toast.loading('Saving item...')
      const images = []

      if (data.featuredImage instanceof File) {
        images.push({ image: data.featuredImage, caption: 'Featured image', is_featured: true })
      } else if (data.otherImages && data.otherImages.length > 0 && data.otherImages[0] instanceof File) {
        images.push({ image: data.otherImages[0], caption: 'Featured image', is_featured: true })
      }

      const startIndex = (data.featuredImage instanceof File ||
                          (data.otherImages && data.otherImages.length > 0 && !data.featuredImage)) &&
                         !data.featuredImage ? 1 : 0

      if (data.otherImages && data.otherImages.length > startIndex) {
        for (let i = startIndex; i < data.otherImages.length; i++) {
          const file = data.otherImages[i]
          if (file instanceof File) {
            images.push({
              image: file,
              caption: `Gallery image ${images.length + 1}`,
              is_featured: false,
            })
          }
        }
      }

      await createDeclutteringListingMutation.mutateAsync({
        payload: {
          title: data.title,
          description: data.description,
          price: data.price,
          currency: 'NGN',
          condition: DECLUTTER_FORM_CONDITION_MAP[data.condition] || 'GOOD',
          status: 'DRAFT',
          location: data.location,
          contactInfo: data.sellerName || '',
          features: {
            is_negotiable: false,
            is_delivery_available: false,
            is_featured: Boolean(data.isPremium),
          },
          images,
        },
      })

      toast.success('Item added successfully! Waiting for admin approval.')
      router.push(`/agent/items`)
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error('Failed to save item. Please try again.')
    } finally {
      if (loadingToastId) {
        toast.dismiss(loadingToastId)
      }
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="space-y-6 px-6 pb-12">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Add Item</h1>
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
                Confirm
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
                  {/* Commission Calculator */}
                  {price && parseFloat(price) > 0 && (
                    <div className="mt-3">
                      <CommissionCalculator 
                        price={parseFloat(price)} 
                        type="decluttering" 
                        isAdmin={false}
                      />
                    </div>
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
                    Upload Other Images *
                  </label>
                  <ImageUpload
                    multiple={true}
                    onUpload={(files) => setValue('otherImages', files)}
                    placeholder="Upload Additional Images"
                    subtitle="First image will be used as featured if none uploaded above"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Select onValueChange={(value) => setValue('category', value)}>
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
                  <Select onValueChange={(value) => setValue('condition', value)}>
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
                    Upload Featured Image
                  </label>
                  <ImageUpload
                    multiple={false}
                    onUpload={(file) => setValue('featuredImage', file)}
                    placeholder="Upload Featured Image"
                    subtitle="At least one image is required (featured or other)"
                    required={false}
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

              <div className="col-span-full mt-6">
                {/* Premium Toggle */}
                <PremiumToggle
                  listingId="new"
                  listingType="item"
                  currentPremium={watch('isPremium')}
                  onToggle={(value) => setValue('isPremium', value)}
                  isAdmin={false}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddItemPage

