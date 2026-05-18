'use client'

// Checkout success page - shown after Stripe payment
// FR-14

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { clearCart } from '@/lib/cart'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id') // Stripe
  const paymentId = searchParams.get('payment_id') // MyFatoorah
  const provider = searchParams.get('provider') || 'stripe'
  const [hasClearedCart, setHasClearedCart] = useState(false)

  const paymentIdentifier = sessionId || paymentId

  useEffect(() => {
    // Clear cart after successful checkout
    if (paymentIdentifier && !hasClearedCart) {
      clearCart()
      setHasClearedCart(true)
    }
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

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="mb-6">
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
          <h1 className="text-3xl font-bold text-charcoal mb-2">Payment successful!</h1>
          <p className="text-slate">
            Thank you for your order. You'll receive a confirmation email shortly.
          </p>
        </div>

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

        <Button variant="primary" onClick={() => router.push('/')} className="w-full">
          Continue shopping
        </Button>
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
