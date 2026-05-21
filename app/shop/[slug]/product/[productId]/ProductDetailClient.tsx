'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { AddToCartButton } from '@/components/AddToCartButton'
import { CartButton } from '@/components/CartButton'
import { formatPrice, type Currency } from '@/lib/currency'

interface ProductDetailClientProps {
  product: {
    id: string
    title: string
    description: string | null
    price: number
    stock: number
    category: string | null
    imageUrl: string | null
    status: string
    shop: {
      name: string
      slug: string
      status: string
      currency: string | null
    }
    images?: Array<{
      id: string
      imageUrl: string
      displayOrder: number
    }>
  }
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const isShopActive = product.shop.status === 'ACTIVE'
  const shopCurrency = (product.shop.currency || 'USD') as Currency

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= 1 && value <= product.stock) {
      setQuantity(value)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-whisper sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            href={`/shop/${product.shop.slug}`}
            className="text-charcoal text-sm font-semibold hover:text-slate transition-colors"
          >
            ← Back to Shop
          </Link>
          <div className="text-lg font-bold text-charcoal">
            {product.shop.name}
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Shop Inactive Warning */}
        {!isShopActive && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-8 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-2xl font-bold text-charcoal mb-2">
              This shop is currently inactive
            </h2>
            <p className="text-slate mb-4">
              The seller has temporarily paused this shop. You cannot purchase items at this time.
            </p>
            <Link href={`/shop/${product.shop.slug}`}>
              <Button variant="secondary">Back to Shop</Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Gallery */}
          <div className="space-y-3">
            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-br from-whisper to-cream rounded-lg flex items-center justify-center border border-whisper overflow-hidden">
              {product.images?.[0]?.imageUrl ? (
                <img
                  src={product.images[0].imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-slate p-8">
                  <p className="text-sm">No image available</p>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br from-whisper to-cream rounded-md flex items-center justify-center overflow-hidden cursor-pointer ${
                      index === 0 ? 'border-2 border-charcoal' : 'border border-whisper'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={`${product.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="pt-3">
            {product.category && (
              <div className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">
                {product.category}
              </div>
            )}
            <h1 className="text-3xl lg:text-4xl font-bold text-charcoal mb-2">
              {product.title}
            </h1>
            <div className="text-3xl font-bold text-charcoal mb-2">
              {formatPrice(product.price, shopCurrency)}
            </div>
            {product.stock > 0 ? (
              <div className="text-sm text-emerald font-medium mb-6">
                In stock ({product.stock} available)
              </div>
            ) : (
              <div className="text-sm text-rose font-medium mb-6 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-rose rounded-full"></span>
                Out of stock
              </div>
            )}

            {product.description && (
              <p className="text-slate leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Quantity selector */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-semibold text-charcoal">
                Quantity
              </span>
              <div className="flex items-center border border-whisper rounded-md">
                <button 
                  className="px-3 py-2 text-charcoal font-semibold hover:bg-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || !isShopActive || product.stock === 0}
                  type="button"
                >
                  −
                </button>
                <input
                  type="number"
                  className="w-12 text-center border-x border-whisper py-2 text-sm font-semibold focus:outline-none"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={product.stock}
                  disabled={!isShopActive || product.stock === 0}
                />
                <button 
                  className="px-3 py-2 text-charcoal font-semibold hover:bg-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock || !isShopActive || product.stock === 0}
                  type="button"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            {!isShopActive ? (
              <Button
                variant="primary"
                size="lg"
                disabled
                className="w-full opacity-50 cursor-not-allowed"
              >
                Shop Inactive
              </Button>
            ) : product.stock > 0 ? (
              <AddToCartButton
                productId={product.id}
                productTitle={product.title}
                price={product.price}
                shopSlug={product.shop.slug}
                imageUrl={
                  product.images?.[0]?.imageUrl || product.imageUrl || undefined
                }
                quantity={quantity}
              />
            ) : (
              <Button
                variant="primary"
                size="lg"
                disabled
                className="w-full opacity-50 cursor-not-allowed"
              >
                Out of Stock
              </Button>
            )}
            <div className="mt-3">
              <Link href={`/shop/${product.shop.slug}`}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Product Details Accordion */}
            <div className="mt-8 border-t border-whisper pt-6 space-y-4">
              <details className="group">
                <summary className="text-sm font-semibold text-charcoal cursor-pointer flex justify-between items-center py-3">
                  Materials & Care
                  <span className="text-slate group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="text-sm text-slate leading-relaxed pt-2 pb-3">
                  High-quality materials. Handle with care. Store in a cool, dry
                  place.
                </div>
              </details>

              <details className="group border-t border-whisper">
                <summary className="text-sm font-semibold text-charcoal cursor-pointer flex justify-between items-center py-3">
                  Shipping
                  <span className="text-slate group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="text-sm text-slate leading-relaxed pt-2 pb-3">
                  Ships within 3–5 business days. Free shipping on orders over
                  $75.
                </div>
              </details>

              <details className="group border-t border-whisper">
                <summary className="text-sm font-semibold text-charcoal cursor-pointer flex justify-between items-center py-3">
                  Returns
                  <span className="text-slate group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="text-sm text-slate leading-relaxed pt-2 pb-3">
                  30-day returns accepted. Items must be in original condition.
                  Contact the seller for a return label.
                </div>
              </details>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-whisper py-8 px-6 text-center text-xs text-slate mt-12">
        <p>© 2026 {product.shop.name}. Solo Shop Builder. | Secured by Stripe</p>
      </footer>

      {/* Floating cart button - only show if shop is active */}
      {isShopActive && <CartButton shopSlug={product.shop.slug} />}
    </div>
  )
}
