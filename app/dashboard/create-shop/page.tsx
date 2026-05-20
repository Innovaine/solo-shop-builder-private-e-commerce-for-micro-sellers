'use client'

// FR-4: Shop creation form matching design/pages/create-shop.html
// Seller enters shop name + slug, creates shop

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'

export default function CreateShopPage() {
  const router = useRouter()
  const [shopName, setShopName] = useState('')
  const [shopSlug, setShopSlug] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [slugTouched, setSlugTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/shops')
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/login?error=session_expired')
            return
          }
        }
        setAuthChecking(false)
      } catch {
        router.push('/auth/login?error=network_error')
      }
    }
    checkAuth()
  }, [router])

  // Auto-generate slug from shop name
  useEffect(() => {
    if (!slugTouched) {
      const generatedSlug = shopName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 30)
      setShopSlug(generatedSlug)
    }
  }, [shopName, slugTouched])

  const slugValid = /^[a-z0-9-]{3,30}$/.test(shopSlug) && shopSlug.length >= 3

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: shopName, slug: shopSlug, currency }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create shop')
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'soloshop.com'

  if (authChecking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-12">
          <div className="text-center">
            <div className="text-5xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-charcoal mb-2">Loading...</h1>
            <p className="text-slate">Verifying your session</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-12">
        {!success ? (
          <>
            <div className="mb-8">
              <span className="inline-block bg-whisper text-slate px-3 py-1 rounded text-xs font-semibold uppercase mb-3">
                Step 1 of 2
              </span>
              <h1 className="text-4xl font-bold text-charcoal mb-2">Create Your Shop</h1>
              <p className="text-slate">Give your storefront a name and web address.</p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-md p-4 mb-6 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-7">
                <FormField
                  label="Shop Name"
                  type="text"
                  id="shopName"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g., Sarah's Jewelry"
                  required
                  maxLength={50}
                  helpText="This will appear as your storefront title."
                />
              </div>

              <div className="bg-cream border-l-4 border-amber rounded p-4 mb-7 text-sm text-slate leading-relaxed">
                <strong className="text-charcoal">Your web address:</strong><br />
                3–30 characters, letters and numbers only. No spaces or symbols.
              </div>

              <div className="mb-7">
                <FormField
                  label="Web Address"
                  type="text"
                  id="shopSlug"
                  value={shopSlug}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setShopSlug(e.target.value)
                  }}
                  placeholder="sarahs-jewelry"
                  required
                  error={shopSlug && !slugValid ? 'Use 3–30 letters, numbers, hyphens only' : undefined}
                />
                <div className={`mt-2 px-4 py-3 rounded-md font-mono text-sm ${
                  !shopSlug ? 'bg-cream border border-whisper text-slate' :
                  slugValid ? 'bg-emerald-50 border border-emerald-500 text-emerald-700' :
                  'bg-rose-50 border border-rose-500 text-rose-700'
                }`}>
                  {appUrl}/shop/{shopSlug || 'your-shop'}
                </div>
                {shopSlug && slugValid && (
                  <p className="text-xs mt-1 text-emerald">✓ Address available</p>
                )}
              </div>

              <div className="mb-7">
                <label htmlFor="currency" className="block text-sm font-semibold text-charcoal mb-2">
                  Currency
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-whisper rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald text-charcoal"
                  required
                >
                  <option value="USD">USD - United States Dollar</option>
                  <option value="KWD">KWD - Kuwaiti Dinar</option>
                </select>
                <p className="text-xs text-slate mt-2">
                  {currency === 'USD' 
                    ? 'Payments will be processed via Stripe' 
                    : 'Payments will be processed via MyFatoorah'}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!slugValid}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                >
                  Create Shop
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">✓</div>
            <div className="text-2xl font-bold text-charcoal mb-2">Shop Created!</div>
            <div className="text-sm text-slate mb-6">
              Your shop is live and ready for products.
            </div>
            <div className="bg-cream border border-whisper rounded-md p-4 font-mono text-sm text-slate-blue mb-6 break-all">
              {appUrl}/shop/{shopSlug}
            </div>
            <p className="text-xs text-slate">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  )
}
