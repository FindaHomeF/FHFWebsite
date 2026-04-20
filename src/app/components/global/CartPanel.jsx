"use client"
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Plus, Minus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import ConfirmActionDialog from "@/components/ui/confirm-action-dialog";

const CartPanel = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal } = useCart();
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative rounded-full w-10 h-10 p-0 border-none shadow-none">
          <ShoppingCart className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            <span>Cart ({cartCount} items)</span>
            {cartCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsClearConfirmOpen(true)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Clear All
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt- space-y-4 flex-1 overflow-y-auto">
          {cartCount === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-2">
                Add items to get started
              </p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={`${item.type}-${item.id}`} className="border border-black10 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image || '/declutter1.png'}
                        alt={item.title || item.category}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <Link href={
                            item.type === 'decluttered' ? `/decluttering/${item.itemId || item.id}` :
                            `/sp/${item.itemId || item.serviceId || item.id}`
                          }>
                            <h4 className="font-semibold text-sm truncate hover:text-primary">
                              {item.title || item.category}
                            </h4>
                          </Link>
                          <p className="text-xs text-gray-500">{item.category}</p>
                          {item.condition && (
                            <p className="text-xs text-gray-400">Condition: {item.condition}</p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id, item.type)}
                          className="h-6 w-6 p-0 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        <span className="font-bold text-primary text-sm">
                          ₦{(item.price || 0).toLocaleString()}
                        </span>
                        
                        <div className="flex items-center gap-2 border border-black33 rounded-full">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                            className="h-6 w-6 p-0 rounded-full"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                            className="h-6 w-6 p-0 rounded-full"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mt-1">
                        Subtotal: ₦{((item.price || 0) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Cart Summary */}
        {cartCount > 0 && (
          <div className="border-t pt-4 mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-xl text-primary">
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              <Link href="/checkout" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/cart" className="block">
                <Button variant="outline" className="w-full">
                  View Full Cart
                </Button>
              </Link>
            </div>
          </div>
        )}
      </SheetContent>

      <ConfirmActionDialog
        open={isClearConfirmOpen}
        onOpenChange={setIsClearConfirmOpen}
        title="Clear cart?"
        description="This will remove all items from your cart."
        confirmText="Clear cart"
        onConfirm={() => {
          clearCart()
          setIsClearConfirmOpen(false)
        }}
      />
    </Sheet>
  );
};

export default CartPanel;

