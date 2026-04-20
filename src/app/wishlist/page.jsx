'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Trash2, MessageCircle, ShoppingCart } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'
import Header from '@/app/components/global/Header'
import Footer from '@/app/components/global/Footer'
import ListingBox from '@/app/components/global/ListingBox'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

const WishlistPage = () => {
  const router = useRouter()
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState('all')
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)

  const properties = wishlist.filter(item => item.type === 'apartment' || item.type === 'property')
  const items = wishlist.filter(item => item.type === 'item' || item.type === 'decluttered')
  const services = wishlist.filter(item => item.type === 'service')

  const handleRemove = (itemId, itemType) => {
    removeFromWishlist(itemId, itemType)
    toast.success('Removed from wishlist')
  }

  const handleClearAll = () => {
    clearWishlist()
    setIsClearDialogOpen(false)
    toast.success('Wishlist cleared')
  }


  const getFilteredItems = () => {
    switch (activeTab) {
      case 'properties':
        return properties
      case 'items':
        return items
      case 'services':
        return services
      default:
        return wishlist
    }
  }

  const filteredItems = getFilteredItems()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-start gap-2">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h3>
                  <span className="text-gray-600 text-sm">
                    {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                  </span>
                </div>
              </div>
            </div>
            {wishlist.length > 0 && (
              <Button variant="outline" onClick={() => setIsClearDialogOpen(true)} className="text-red-600 border-red-200 hover:bg-red-50">
                Clear All
              </Button>
            )}
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-black33">
            <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start saving your favorite properties, items, and services</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => window.location.href = '/apartments/all'}>
                Browse Properties
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/decluttering/all'}>
                Browse Items
              </Button>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-4">
              <TabsTrigger value="all">
                All ({wishlist.length})
              </TabsTrigger>
              <TabsTrigger value="properties">
                Properties ({properties.length})
              </TabsTrigger>
              <TabsTrigger value="items">
                Items ({items.length})
              </TabsTrigger>
              <TabsTrigger value="services">
                Services ({services.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <WishlistGrid items={wishlist} onRemove={handleRemove} />
            </TabsContent>

            <TabsContent value="properties" className="mt-6">
              <WishlistGrid items={properties} onRemove={handleRemove} type="property" />
            </TabsContent>

            <TabsContent value="items" className="mt-6">
              <WishlistGrid items={items} onRemove={handleRemove} type="item" />
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <WishlistGrid items={services} onRemove={handleRemove} type="service" />
            </TabsContent>
          </Tabs>
        )}

        <ConfirmActionDialog
          open={isClearDialogOpen}
          onOpenChange={setIsClearDialogOpen}
          title='Clear wishlist?'
          description='This will remove all saved items from your wishlist.'
          confirmText='Clear wishlist'
          onConfirm={handleClearAll}
        />
      </main>
      <Footer />
    </div>
  )
}

const WishlistGrid = ({ items, onRemove, type = null, addToCart }) => {
  const router = useRouter?.() || (() => {}); // fallback

  if (items.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-lg border border-black10 w-fit mx-auto">
        <p className="text-gray-500">No items in this category</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {items.map((item) => {
        const itemId = item.id || item.propertyId || item.itemId || item.serviceId
        const itemType = item.type || type || 'apartment'

        if (itemType === 'apartment' || itemType === 'property') {
          return (
            <div key={itemId} className="relative group bg-white rounded-lg border border-black33 overflow-hidden hover:shadow-lg transition-shadow">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => onRemove(itemId, itemType)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Link href={`/apartments/${item.propertyId || item.id}`}>

                <div className="h-32 md:h-40 relative overflow-hidden">
                  <Image
                    src={item.image || '/default-apt.png'}
                    alt={item.title || 'Property'}
                    width={350}
                    height={160}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <Link href={`/apartments/${item.propertyId || item.id}`}>
                      <h4 className="font-semibold text-sm md:text-base truncate hover:text-primary">
                        {item.title}
                      </h4>
                    </Link>
                    {item.location && (
                      <p className="text-xs text-gray-500 mt-1 truncate">{item.location}</p>
                    )}
                    <div className="mt-2 flex items-center">
                      <span className="text-primary font-bold text-base md:text-lg">
                        {item.price
                          ? `₦${item.price.toLocaleString()}`
                          : ""}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push('/messages')}
                    size="icon"
                    className="ml-1 mt-1 text-white bg-secondary hover:bg-secondary/15"
                    title="Message/Contact"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )
        }

        if (itemType === 'item' || itemType === 'decluttered') {
          const handleAddToCart = (evt) => {
            evt.preventDefault()
            if (typeof addToCart === 'function') {
              addToCart(item)
              toast.success('Added to cart')
            }
          }

          return (
            <div key={itemId} className="relative group max-h-fit bg-white rounded-lg border border-black33 overflow-hidden hover:shadow-lg transition-shadow">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => onRemove(itemId, itemType)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <Link href={`/decluttering/${item.itemId || item.id}`}>
                <div className="h-32 md:h-40 relative overflow-hidden">
                  <Image
                    src={item.image || '/declutter1.png'}
                    alt={item.title || 'Item'}
                    width={300}
                    height={160}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>
              
              <div className="p-3 space-y-2">
                <Link href={`/decluttering/${item.itemId || item.id}`}>
                  <h4 className="font-semibold text-sm md:text-base truncate hover:text-primary">
                    {item.title}
                  </h4>
                </Link>
                
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold text-base md:text-lg">
                    ₦{(item.price || 10000).toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleAddToCart}
                      size="sm"
                      className="h-8 w-8 p-0 bg-secondary hover:bg-secondary/90"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        if (itemType === 'service') {
          return (
            <div key={itemId} className="relative group bg-white rounded-lg border border-black33 p-4 hover:shadow-lg transition-shadow max-h-fit">
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onRemove(itemId, itemType)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-lighterGray rounded-full flex-shrink-0">
                    <div className="w-4 h-4 bg-primary rounded-full ml-auto mt-1 mr-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{item.title || item.name}</h3>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    {item.location && (
                      <p className="text-xs text-gray-500 mt-1">{item.location}</p>
                    )}
                    {item.price && (
                      <p className="text-primary font-semibold mt-2">
                        Starting at ₦{item.price.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => router.push('/messages')}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Provider
                </Button>
              </div>
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

export default WishlistPage

