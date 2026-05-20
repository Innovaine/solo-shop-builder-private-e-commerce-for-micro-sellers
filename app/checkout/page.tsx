'use client'

// Checkout page - displays cart and triggers Stripe checkout
// FR-13 & FR-14

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCart, getCartTotal, removeFromCart } from '@/lib/cart'
import type { Cart } from '@/lib/cart'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart>({ items: [] })
  const [customerEmail, setCustomerEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'myfatoorah'>('stripe')
  const [shopCurrency, setShopCurrency] = useState<'USD' | 'KWD'>('USD')
  const [myfatoorahMethod, setMyfatoorahMethod] = useState<'CARD' | 'APPLE_PAY' | 'GOOGLE_PAY' | 'KNET'>('CARD')

  useEffect(() => {
    const cartData = getCart()
    setCart(cartData)
    
    // Fetch shop currency if we have a shop slug
    const fetchShopCurrency = async () => {
      if (cartData.shopSlug) {
        try {
          const response = await fetch(`/api/shops/${cartData.shopSlug}/currency`)
          if (response.ok) {
            const data = await response.json()
            setShopCurrency(data.currency || 'USD')
            // Auto-select payment provider based on currency
            if (data.currency === 'KWD') {
              setPaymentProvider('myfatoorah')
            } else {
              setPaymentProvider('stripe')
            }
          }
        } catch (error) {
          console.error('Failed to fetch shop currency:', error)
        }
      }
    }
    
    fetchShopCurrency()
    
    // Check for error in URL query params (from MyFatoorah callback redirect)
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    
    if (errorParam) {
      let errorMessage = 'Payment failed. Please try again.'
      
      // Map error codes to user-friendly messages
      if (errorParam === 'payment_cancelled') {
        errorMessage = 'Payment was cancelled. Please try again when you\'re ready to complete your purchase.'
      } else if (errorParam === 'payment_expired') {
        errorMessage = 'Payment session expired. Please try again.'
      } else if (errorParam.startsWith('payment_declined')) {
        errorMessage = 'Payment was declined by your bank. Please check your card details and try again, or use a different payment method.'
      } else if (errorParam === 'payment_not_completed') {
        errorMessage = 'Payment was not completed. Please try again.'
      } else if (errorParam === 'order_not_found') {
        errorMessage = 'Order not found. Your cart may have expired. Please add items to your cart and try again.'
      } else if (errorParam === 'verification_failed') {
        errorMessage = 'Payment verification failed. If you were charged, please contact support.'
      } else if (errorParam === 'callback_error') {
        errorMessage = 'An error occurred while processing your payment. Please try again or contact support if the issue persists.'
      }
      
      setError(errorMessage)
      
      // Clean up URL by removing error param
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
    }
  }, [])

  const handleRemoveItem = (productId: string) => {
    const updatedCart = removeFromCart(productId)
    setCart(updatedCart)
  }

  const handleCheckout = async () => {
    // Validate email
    if (!customerEmail || !customerEmail.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const endpoint = paymentProvider === 'myfatoorah' 
        ? '/api/checkout/myfatoorah' 
        : '/api/checkout'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.items,
          shopSlug: cart.shopSlug,
          customerEmail: customerEmail,
          paymentMethod: paymentProvider === 'myfatoorah' ? myfatoorahMethod : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to payment provider
      const redirectUrl = paymentProvider === 'myfatoorah' ? data.paymentUrl : data.url
      if (redirectUrl) {
        window.location.href = redirectUrl
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  const total = getCartTotal()

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-8">
          <h1 className="text-2xl font-bold text-charcoal mb-4">Your cart is empty</h1>
          <p className="text-slate mb-6">Add some products to get started.</p>
          <Button variant="primary" onClick={() => router.push('/')}>
            Continue shopping
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-charcoal mb-8">Checkout</h1>

        {error && (
          <Card className="mb-6 p-4 bg-rose-50 border-rose">
            <p className="text-rose text-sm">{error}</p>
          </Card>
        )}

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 pb-4 border-b border-whisper last:border-0">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productTitle}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-charcoal">{item.productTitle}</h3>
                    <p className="text-sm text-slate">Quantity: {item.quantity}</p>
                    <p className="text-sm text-charcoal font-medium">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-rose hover:text-rose-700 text-sm font-medium"
                    disabled={isLoading}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-whisper">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-charcoal">Total</span>
                <span className="text-emerald">${(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Contact Information</h2>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                Email address <span className="text-rose">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue"
                disabled={isLoading}
              />
              <p className="text-xs text-slate mt-2">
                Required for order confirmation and tracking
              </p>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Payment Method</h2>
            
            {/* Currency notice */}
            <div className="mb-4 p-3 bg-whisper rounded-md">
              <p className="text-xs text-slate">
                💡 This shop uses <strong>{shopCurrency}</strong> currency
              </p>
            </div>
            
            <div className="space-y-3">
              {/* Show Stripe only for USD */}
              {shopCurrency === 'USD' && (
                <label className="flex items-center gap-3 p-4 border border-whisper rounded-md cursor-pointer hover:bg-whisper/50">
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={paymentProvider === 'stripe'}
                    onChange={(e) => setPaymentProvider('stripe')}
                    className="text-slate-blue"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-charcoal">Credit Card (Stripe)</div>
                    <div className="text-xs text-slate">Visa, Mastercard, Amex</div>
                  </div>
                </label>
              )}

              {/* Show MyFatoorah only for KWD */}
              {shopCurrency === 'KWD' && (
                <>
                  <div className="text-sm font-medium text-charcoal mb-2">Select Payment Method</div>
                  
                  <label className="flex items-center gap-3 p-4 border border-whisper rounded-md cursor-pointer hover:bg-whisper/50 mb-2">
                    <input
                      type="radio"
                      name="myfatoorah-method"
                      value="CARD"
                      checked={myfatoorahMethod === 'CARD'}
                      onChange={(e) => setMyfatoorahMethod('CARD')}
                      className="text-slate-blue"
                      disabled={isLoading}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-charcoal">💳 Credit/Debit Card</div>
                      <div className="text-xs text-slate">Visa, Mastercard, Amex</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-whisper rounded-md cursor-pointer hover:bg-whisper/50 mb-2">
                    <input
                      type="radio"
                      name="myfatoorah-method"
                      value="APPLE_PAY"
                      checked={myfatoorahMethod === 'APPLE_PAY'}
                      onChange={(e) => setMyfatoorahMethod('APPLE_PAY')}
                      className="text-slate-blue"
                      disabled={isLoading}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-charcoal">🍎 Apple Pay</div>
                      <div className="text-xs text-slate">Fast checkout with Apple Pay</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-whisper rounded-md cursor-pointer hover:bg-whisper/50 mb-2">
                    <input
                      type="radio"
                      name="myfatoorah-method"
                      value="GOOGLE_PAY"
                      checked={myfatoorahMethod === 'GOOGLE_PAY'}
                      onChange={(e) => setMyfatoorahMethod('GOOGLE_PAY')}
                      className="text-slate-blue"
                      disabled={isLoading}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-charcoal">🔵 Google Pay</div>
                      <div className="text-xs text-slate">Quick payment with Google Pay</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-whisper rounded-md cursor-pointer hover:bg-whisper/50">
                    <input
                      type="radio"
                      name="myfatoorah-method"
                      value="KNET"
                      checked={myfatoorahMethod === 'KNET'}
                      onChange={(e) => setMyfatoorahMethod('KNET')}
                      className="text-slate-blue"
                      disabled={isLoading}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-charcoal">🇰🇼 KNET</div>
                      <div className="text-xs text-slate">Kuwait's national payment system</div>
                    </div>
                  </label>
                </>
              )}
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push(cart.shopSlug ? `/shop/${cart.shopSlug}` : '/')}
            disabled={isLoading}
            className="flex-1"
          >
            Continue shopping
          </Button>
          <Button
            variant="primary"
            onClick={handleCheckout}
            disabled={isLoading || !customerEmail || !customerEmail.includes('@')}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : 'Proceed to payment'}
          </Button>
        </div>
      </div>
    </div>
  )
}
