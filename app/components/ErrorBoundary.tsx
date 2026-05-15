'use client'

// Global error boundary for graceful failure handling
// Catches React rendering errors and displays user-friendly fallback

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console (in production, send to monitoring service)
    console.error('[ErrorBoundary caught]', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-charcoal mb-2">
              Something went wrong
            </h1>
            <p className="text-slate mb-6">
              We&apos;re sorry, but something unexpected happened. Please try refreshing
              the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald text-white font-semibold px-6 py-2 rounded-md hover:bg-emerald-600 transition"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-slate cursor-pointer">
                  Error details (dev only)
                </summary>
                <pre className="mt-2 p-4 bg-rose-50 text-rose-700 text-xs overflow-auto rounded">
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
