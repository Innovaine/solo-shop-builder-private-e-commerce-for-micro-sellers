'use client'

// Add to Cart button with client-side cart interaction
// FR-11 & FR-12: Shopping cart functionality

import { useState } from 'react'
import { addToCart } from '@/lib/cart'
import { Button } from './ui/Button'

interface AddToCartButtonProps {
  productId: string
  productTitle: string
  price: number
  shopSlug: string
  imageUrl?: string
  quantity?: number
}

export function AddToCartButton({
  productId,
  productTitle,
  price,
  shopSlug,
  imageUrl,
  quantity = 1,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    setError(null)
    setSuccess(false)

    try {
      addToCart({
        productId,
        productTitle,
        price,
        shopSlug,
        imageUrl,
        quantity,
      })

      // Dispatch custom event to update cart count
      window.dispatchEvent(new Event('cartUpdated'))

      setSuccess(true)

      // Reset success message after 2 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={isAdding || success}
      >
        {success ? '✓ Added to Cart!' : isAdding ? 'Adding...' : 'Add to Cart'}
      </Button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
