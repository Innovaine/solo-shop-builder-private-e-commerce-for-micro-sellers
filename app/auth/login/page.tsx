'use client'

// Login page matching design/pages/login.html
// FR-1: Email magic link signup form

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// Force dynamic rendering because we use searchParams
export const dynamic = 'force-dynamic'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  const errorParam = searchParams.get('error')
  const errorMessages: Record<string, string> = {
    missing_token: 'No login link provided.',
    invalid_token: 'Invalid login link.',
    token_already_used: 'This login link has already been used.',
    token_expired: 'Login link expired. Request a new one.',
    server_error: 'Server error. Please try again.',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to send login link')
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{
      background: 'linear-gradient(135deg, #3B4C63 0%, #2C3A4F 100%)'
    }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-12">
        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-slate-blue mb-4">Solo Shop</div>
          <h1 className="text-3xl font-bold text-charcoal mb-2">Sign In</h1>
          <p className="text-slate">or create a new account</p>
        </div>

        {errorParam && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-4 mb-6 text-sm text-rose-700">
            {errorMessages[errorParam] || 'An error occurred.'}
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-4 mb-6 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div className="bg-cream border border-whisper rounded-md p-4 mb-6 text-sm text-slate leading-relaxed">
              <strong className="text-slate-blue">No password needed.</strong> We&apos;ll send you a login link via email.
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 text-base border border-whisper rounded-md focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald text-white font-semibold py-3 rounded-md hover:bg-emerald-600 active:transform active:translate-y-0 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Sending...' : 'Send Login Link'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">✓</div>
            <div className="text-lg font-semibold text-charcoal mb-2">Check your email</div>
            <div className="text-sm text-slate leading-relaxed">
              We&apos;ve sent a login link to <strong>{email}</strong>.<br />
              Click the link to sign in or create your shop.
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-whisper text-center text-sm text-slate">
          New to Solo Shop? <a href="/" className="text-slate-blue font-semibold hover:underline">Learn more</a>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-6" style={{
        background: 'linear-gradient(135deg, #3B4C63 0%, #2C3A4F 100%)'
      }}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-12 text-center">
          <div className="text-slate">Loading...</div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
