'use client'

// Floating cart button with item count badge
// FR-12: Cart UI component

import { useState, useEffect } from 'react'
import { getCartItemCount, getCart, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart, type Cart } from '@/lib/cart'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'
import Link from 'next/link'

export function CartButton({ shopSlug }: { shopSlug?: string }) {
  const [itemCount, setItemCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [cart, setCart] = useState<Cart>({ items: [], shopSlug: undefined })

  // Load cart on mount and listen for storage events
  useEffect(() => {
    const updateCart = () => {
      setItemCount(getCartItemCount())
      setCart(getCart())
    }

    updateCart()

    // Listen for storage events (cart updates from other tabs)
    window.addEventListener('storage', updateCart)
    
    // Custom event for same-tab cart updates
    window.addEventListener('cartUpdated', updateCart)

    return () => {
      window.removeEventListener('storage', updateCart)
      window.removeEventListener('cartUpdated', updateCart)
    }
  }, [])

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
    setCart(getCart())
    setItemCount(getCartItemCount())
    
    // Dispatch custom event
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateCartItemQuantity(productId, quantity)
    setCart(getCart())
    setItemCount(getCartItemCount())
    
    // Dispatch custom event
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const handleClearCart = () => {
    clearCart()
    setCart({ items: [], shopSlug: undefined })
    setItemCount(0)
    
    // Dispatch custom event
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const total = getCartTotal()

  if (itemCount === 0) {
    return null // Hide cart button when empty
  }

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-charcoal text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:bg-slate transition-colors z-50"
        aria-label={`View cart (${itemCount} items)`}
      >
        <span className="text-2xl">🛒</span>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Shopping Cart"
      >
        <div className="space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-8 text-slate">
              <p className="text-lg mb-2">Your cart is empty</p>
              <p className="text-sm">Add some products to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 p-3 bg-cream rounded-md border border-whisper"
                  >
                    {/* Product image placeholder */}
                    <div className="w-16 h-16 bg-gradient-to-br from-whisper to-cream rounded-md flex items-center justify-center text-2xl flex-shrink-0 border border-whisper">
                      💎
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-charcoal text-sm truncate">
                        {item.productTitle}
                      </h3>
                      <p className="text-xs text-slate mb-2">
                        ${(item.price / 100).toFixed(2)} each
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.productId, item.quantity - 1)
                          }
                          className="px-2 py-1 bg-white rounded border border-whisper text-xs font-semibold hover:bg-whisper transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold text-charcoal w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.productId, item.quantity + 1)
                          }
                          className="px-2 py-1 bg-white rounded border border-whisper text-xs font-semibold hover:bg-whisper transition-colors"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          className="ml-auto text-xs text-red-600 hover:text-red-700 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item subtotal */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-charcoal">
                        ${((item.price * item.quantity) / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart total */}
              <div className="border-t border-whisper pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-charcoal">Subtotal</span>
                  <span className="text-lg font-bold text-charcoal">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-slate">
                  Shipping and taxes calculated at checkout
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <Link href="/checkout">
                  <Button variant="primary" size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
                <button
                  onClick={handleClearCart}
                  className="w-full text-xs text-slate hover:text-charcoal transition-colors py-2"
                >
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  )
}
