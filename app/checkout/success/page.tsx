'use client'

// Checkout success page - shown after Stripe payment
// FR-14
// Task #198: Enhanced with receipt display and back-to-shop option

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { clearCart, getCart } from '@/lib/cart'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

interface OrderDetails {
  id: string
  customerEmail: string
  total: number
  items: Array<{
    productTitle: string
    price: number
    quantity: number
  }>
  shop: {
    name: string
    slug: string
  }
  createdAt: string
}

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id') // Stripe
  const paymentId = searchParams.get('payment_id') // MyFatoorah
  const provider = searchParams.get('provider') || 'stripe'
  const shopSlugParam = searchParams.get('shopSlug') // Shop slug from URL
  const [hasClearedCart, setHasClearedCart] = useState(false)
  const [shopSlugFromCart, setShopSlugFromCart] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  const paymentIdentifier = sessionId || paymentId

  useEffect(() => {
    // Save shop slug from cart BEFORE clearing
    if (paymentIdentifier && !hasClearedCart) {
      const cart = getCart()
      if (cart.shopSlug) {
        setShopSlugFromCart(cart.shopSlug)
      }
      clearCart()
      setHasClearedCart(true)
    }

    // Fetch order details
    const fetchOrderDetails = async () => {
      if (!paymentIdentifier) {
        setLoading(false)
        return
      }

      try {
        // Find order by payment ID
        const response = await fetch(`/api/orders?paymentId=${paymentIdentifier}`)
        if (response.ok) {
          const data = await response.json()
          if (data.orders && data.orders.length > 0) {
            setOrderDetails(data.orders[0])
          }
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [paymentIdentifier, hasClearedCart])

  if (!paymentIdentifier) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-8">
          <h1 className="text-2xl font-bold text-charcoal mb-4">Invalid session</h1>
          <p className="text-slate mb-6">This checkout session could not be found.</p>
          <Button variant="primary" onClick={() => router.push('/')}>
            Go home
          </Button>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <Card className="max-w-2xl w-full text-center p-8">
          <p className="text-slate">Loading your receipt...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <Card className="max-w-2xl w-full p-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-emerald rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-charcoal mb-2">Order Confirmed!</h1>
          <p className="text-slate">
            Thank you for your purchase. You'll receive a confirmation email shortly.
          </p>
        </div>

        {/* Order Receipt */}
        {orderDetails ? (
          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-charcoal mb-2">Order Summary</h2>
              <p className="text-sm text-slate">
                Order ID: <span className="font-mono text-xs">{orderDetails.id.substring(0, 8)}</span>
              </p>
              <p className="text-sm text-slate">
                Date: {new Date(orderDetails.createdAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start py-2">
                  <div className="flex-1">
                    <p className="font-semibold text-charcoal">{item.productTitle}</p>
                    <p className="text-sm text-slate">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-charcoal ml-4">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-charcoal">Total</p>
                <p className="text-2xl font-bold text-emerald">
                  ${(orderDetails.total / 100).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-whisper p-4 rounded-md mb-6">
            <p className="text-sm text-slate">
              Payment ID: <span className="font-mono text-xs text-charcoal">{paymentIdentifier}</span>
            </p>
            {provider && (
              <p className="text-xs text-slate mt-2">
                Provider: {provider === 'myfatoorah' ? 'MyFatoorah' : 'Stripe'}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {(orderDetails || shopSlugFromCart || shopSlugParam) && (
            <Button 
              variant="primary" 
              onClick={() => {
                const slug = orderDetails?.shop.slug || shopSlugParam || shopSlugFromCart
                if (slug) {
                  router.push(`/shop/${slug}`)
                }
              }} 
              className="w-full"
            >
              {orderDetails ? `Back to ${orderDetails.shop.name}` : 'Back to Shop'}
            </Button>
          )}
          <Button 
            variant="secondary" 
            onClick={() => router.push('/')} 
            className="w-full"
          >
            Continue Shopping
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-8">
          <p className="text-slate">Loading...</p>
        </Card>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
