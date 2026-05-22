'use client'

// Signup page matching design/pages/signup.html
// FR-1: Email magic link signup form
// Separate from login page for clearer UX

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

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
        setError(data.error || 'Failed to send magic link')
        setLoading(false)
        return
      }

      // Show success message
      setSubmitted(true)
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{
      backgroundColor: '#FAF9F7'
    }}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">Get Started</h1>
          <p className="text-slate">Enter your email to sign in with a magic link. No password needed.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-4 mb-6 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <FormField
              label="Email Address"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />

            <Button
              type="submit"
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full"
            >
              Send Magic Link
            </Button>

            <div className="mt-6 text-center text-sm text-slate">
              Already have an account? <Link href="/auth/login" className="text-slate-blue font-semibold hover:underline">Sign in</Link>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">✓</div>
            <div className="text-2xl font-bold text-charcoal mb-3">Check Your Email</div>
            <div className="text-sm text-slate leading-relaxed mb-5">
              We&apos;ve sent a magic link to:
            </div>
            <div className="bg-green-50 border border-green-200 rounded px-4 py-3 font-semibold text-green-800 mb-6 break-all text-sm">
              {email}
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-md p-4 text-left">
              <h3 className="text-sm font-semibold text-sky-900 mb-2">What happens next?</h3>
              <p className="text-sm text-sky-800 leading-relaxed">
                Click the link in your email to log in and create your first shop. The link expires in 24 hours. If you don&apos;t see it, check your spam folder.
              </p>
            </div>

            <div className="mt-5 text-sm text-center">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setEmail('')
                }}
                className="text-slate-blue font-semibold hover:underline"
              >
                Didn&apos;t receive an email? Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
