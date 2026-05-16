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

  useEffect(() => {
    setCart(getCart())
  }, [])

  const handleRemoveItem = (productId: string) => {
    const updatedCart = removeFromCart(productId)
    setCart(updatedCart)
  }

  const handleCheckout = async () => {
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
          customerEmail: customerEmail || undefined,
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
                Email address (optional)
              </label>
              <input
                type="email"
                id="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue"
                disabled={isLoading}
              />
              <p className="text-xs text-slate mt-2">
                We'll send your order confirmation to this email.
              </p>
            </div>
          </div>
        </Card>

        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Payment Method</h2>
            <div className="space-y-3">
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

              <label className="flex items-center gap-3 p-4 border border-whisper rounded-md cursor-pointer hover:bg-whisper/50">
                <input
                  type="radio"
                  name="payment"
                  value="myfatoorah"
                  checked={paymentProvider === 'myfatoorah'}
                  onChange={(e) => setPaymentProvider('myfatoorah')}
                  className="text-slate-blue"
                  disabled={isLoading}
                />
                <div className="flex-1">
                  <div className="font-medium text-charcoal">MyFatoorah</div>
                  <div className="text-xs text-slate">KNET, Visa, Mastercard, Apple Pay</div>
                </div>
              </label>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push(`/shop/${cart.shopSlug}`)}
            disabled={isLoading}
            className="flex-1"
          >
            Continue shopping
          </Button>
          <Button
            variant="primary"
            onClick={handleCheckout}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Processing...' : 'Proceed to payment'}
          </Button>
        </div>
      </div>
    </div>
  )
}
