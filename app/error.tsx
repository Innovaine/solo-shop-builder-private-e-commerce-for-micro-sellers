'use client'

// FR-18: Custom error boundary
// Next.js automatically uses this for runtime errors

import { useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <Card padding="lg" variant="elevated" className="max-w-md w-full text-center">
        <div className="text-8xl mb-8">😞</div>
        <h1 className="text-4xl font-bold text-charcoal mb-4">Something Went Wrong</h1>
        <p className="text-slate mb-2">
          We encountered an unexpected error. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-xs text-slate font-mono mb-8">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={() => reset()}>
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </Card>
    </div>
  )
}
