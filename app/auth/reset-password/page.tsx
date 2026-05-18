'use client'

// FR-22: Reset password page
// Seller sets new password with reset token
// Design: matches design/pages/reset-password.html with strength indicator

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

// Password strength calculation
function calculatePasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }
  
  const count = Object.values(checks).filter(Boolean).length
  const allMet = Object.values(checks).every(Boolean)
  
  let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
  if (count <= 1) strength = 'weak'
  else if (count <= 2) strength = 'fair'
  else if (count <= 3) strength = 'good'
  else strength = 'strong'
  
  return { checks, strength, allMet }
}

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showStrength, setShowStrength] = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{
        background: 'linear-gradient(135deg, #3B4C63 0%, #2C3A4F 100%)'
      }}>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-12 text-center">
          <div className="text-charcoal text-lg mb-4">Invalid reset link</div>
          <Link href="/auth/forgot-password" className="text-sm text-slate-blue hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    )
  }

  const passwordStrength = calculatePasswordStrength(newPassword)
  const isFormValid = passwordStrength.allMet && newPassword === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!passwordStrength.allMet) {
      setError('Password does not meet all requirements')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to reset password')
        setLoading(false)
        return
      }

      setSuccess(true)
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
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
          <h1 className="text-3xl font-bold text-charcoal mb-2">Reset Password</h1>
          <p className="text-sm text-slate">
            Enter your new password below
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-4 mb-6 text-sm text-rose-700">
            {error}
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit}>
            {/* New Password Field with Strength Indicator */}
            <div className="mb-6">
              <label htmlFor="newPassword" className="block text-sm font-medium text-charcoal mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setShowStrength(e.target.value.length > 0)
                }}
                onFocus={() => setShowStrength(newPassword.length > 0)}
                placeholder="Enter new password"
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all"
              />
              
              {/* Password Strength Indicator */}
              {showStrength && (
                <div className="mt-2">
                  <div className="h-1 bg-whisper rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.strength === 'weak' ? 'w-1/4 bg-rose' :
                        passwordStrength.strength === 'fair' ? 'w-1/2 bg-amber' :
                        passwordStrength.strength === 'good' ? 'w-3/4 bg-amber' :
                        'w-full bg-emerald'
                      }`}
                    />
                  </div>
                  <div className="text-xs text-slate mb-2">
                    {passwordStrength.strength === 'weak' && '⚠️ Weak password'}
                    {passwordStrength.strength === 'fair' && '⚠️ Fair password'}
                    {passwordStrength.strength === 'good' && '✓ Good password'}
                    {passwordStrength.strength === 'strong' && '✓ Strong password'}
                  </div>
                </div>
              )}
              
              {/* Requirements Checklist */}
              <div className="mt-2 bg-cream border border-whisper rounded-md p-3 text-xs">
                <div className={`flex items-center gap-2 mb-1 ${passwordStrength.checks.length ? 'text-emerald' : 'text-slate'}`}>
                  <span>{passwordStrength.checks.length ? '✓' : '○'}</span>
                  <span>At least 8 characters</span>
                </div>
                <div className={`flex items-center gap-2 mb-1 ${passwordStrength.checks.uppercase ? 'text-emerald' : 'text-slate'}`}>
                  <span>{passwordStrength.checks.uppercase ? '✓' : '○'}</span>
                  <span>One uppercase letter (A–Z)</span>
                </div>
                <div className={`flex items-center gap-2 mb-1 ${passwordStrength.checks.lowercase ? 'text-emerald' : 'text-slate'}`}>
                  <span>{passwordStrength.checks.lowercase ? '✓' : '○'}</span>
                  <span>One lowercase letter (a–z)</span>
                </div>
                <div className={`flex items-center gap-2 ${passwordStrength.checks.number ? 'text-emerald' : 'text-slate'}`}>
                  <span>{passwordStrength.checks.number ? '✓' : '○'}</span>
                  <span>One number (0–9)</span>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
                autoComplete="new-password"
                className="w-full px-4 py-3 border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent transition-all"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!isFormValid}
            >
              Reset Password
            </Button>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-slate-blue hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">✓</div>
            <div className="text-lg font-semibold text-charcoal mb-2">Password reset successful!</div>
            <div className="text-sm text-slate leading-relaxed mb-4">
              Redirecting you to sign in...
            </div>
            <Link
              href="/auth/login"
              className="text-sm text-slate-blue hover:underline"
            >
              Sign in now
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
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
      <ResetPasswordForm />
    </Suspense>
  )
}
