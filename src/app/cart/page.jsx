'use client'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import Header from '@/app/components/global/Header'
import Footer from '@/app/components/global/Footer'
import ConfirmActionDialog from '@/components/ui/confirm-action-dialog'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal } = useCart()
  const [removeItemId, setRemoveItemId] = useState(null)
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false)

  const handleRemove = (itemId, itemType) => {
    setRemoveItemId(`${itemId}-${itemType}`)
    setTimeout(() => {
      removeFromCart(itemId, itemType)
      setRemoveItemId(null)
    }, 200)
  }

  const subtotal = cartTotal
  const deliveryFee = cartCount > 0 ? 500 : 0
  const total = subtotal + deliveryFee

  return (
    <div className="bg-white w-full overflow-x-hidden scroll-smooth transition-all ease-linear duration-500">
      <Header />
      <main className="min-h-screen py-8 md:py-12">
        <div className="w-[90%] mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartCount > 0 
                ? `You have ${cartCount} ${cartCount === 1 ? 'item' : 'items'} in your cart`
                : 'Your cart is empty'
              }
            </p>
          </div>

          {cartCount === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Link href="/decluttering">
                <Button className="bg-primary hover:bg-primary/90 px-8">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Items ({cartCount})</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsClearConfirmOpen(true)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className={`bg-white border border-gray-200 rounded-lg p-4 md:p-6 hover:shadow-lg transition-all duration-300 ${
                        removeItemId === `${item.id}-${item.type}` ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Image */}
                        <Link
                          href={
                            item.type === 'decluttered'
                              ? `/decluttering/${item.itemId || item.id}`
                              : `/sp/${item.itemId || item.serviceId || item.id}`
                          }
                          className="w-full sm:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100"
                        >
                          <Image
                            src={item.image || '/declutter1.png'}
                            alt={item.title || item.category}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <Link
                                href={
                                  item.type === 'decluttered'
                                    ? `/decluttering/${item.itemId || item.id}`
                                    : `/sp/${item.itemId || item.serviceId || item.id}`
                                }
                              >
                                <h3 className="font-semibold text-lg text-gray-900 hover:text-primary transition-colors line-clamp-2 mb-1">
                                  {item.title || item.category}
                                </h3>
                              </Link>
                              {item.category && (
                                <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                              )}
                              {item.condition && (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                  {item.condition}
                                </span>
                              )}
                            </div>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(item.id, item.type)}
                              className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                            {/* Price */}
                            <div>
                              <p className="text-2xl font-bold text-primary">
                                ₦{(item.price || 0).toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Subtotal: ₦{((item.price || 0) * item.quantity).toLocaleString()}
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                              <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                                  className="h-9 w-9 p-0 hover:bg-gray-100 rounded-l-lg rounded-r-none"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-base font-semibold w-12 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                                  className="h-9 w-9 p-0 hover:bg-gray-100 rounded-r-lg rounded-l-none"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
                  <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Fee</span>
                      <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">₦{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link href="/checkout" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 h-12 text-base font-semibold mb-3">
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <Link href="/decluttering">
                    <Button variant="outline" className="w-full h-12">
                      Continue Shopping
                    </Button>
                  </Link>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Secure checkout • Easy returns • Buyer protection
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ConfirmActionDialog
        open={isClearConfirmOpen}
        onOpenChange={setIsClearConfirmOpen}
        title='Clear cart?'
        description='This will remove all items from your cart.'
        confirmText='Clear cart'
        onConfirm={() => {
          clearCart()
          setIsClearConfirmOpen(false)
        }}
      />
      <Footer />
    </div>
  )
}
