'use client'

// FR-2: Email verification page
// User clicks magic link, lands here, we verify token and create session

export const dynamic = 'force-dynamic'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setErrorMessage('No verification token provided')
      return
    }

    async function verifyToken() {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Verification failed')
        }

        setStatus('success')
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } catch (err) {
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Verification failed')
      }
    }

    verifyToken()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <Card padding="lg" variant="elevated" className="max-w-md w-full">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <div className="text-6xl mb-6">⏳</div>
              <h1 className="text-3xl font-bold text-charcoal mb-4">Verifying...</h1>
              <p className="text-slate">Please wait while we verify your email</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-6xl mb-6">✅</div>
              <h1 className="text-3xl font-bold text-charcoal mb-4">Email Verified!</h1>
              <p className="text-slate mb-6">
                Your email has been verified successfully. Redirecting to dashboard...
              </p>
              <div className="text-sm text-slate">
                If you&apos;re not redirected,{' '}
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-slate-blue hover:underline font-medium"
                >
                  click here
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-6xl mb-6">❌</div>
              <h1 className="text-3xl font-bold text-charcoal mb-4">Verification Failed</h1>
              <p className="text-rose mb-6">{errorMessage}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push('/auth/login')}
                  variant="primary"
                  className="w-full"
                >
                  Back to Login
                </Button>
                <p className="text-sm text-slate">
                  Need help?{' '}
                  <a href="mailto:support@soloshop.com" className="text-slate-blue hover:underline">
                    Contact support
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <Card padding="lg" variant="elevated" className="max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-6">⏳</div>
            <h1 className="text-3xl font-bold text-charcoal mb-4">Loading...</h1>
            <p className="text-slate">Please wait</p>
          </div>
        </Card>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}
