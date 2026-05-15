// Next.js middleware for observability + performance monitoring
// NFR-11: Every API error includes X-Request-Id header
// NFR-2: Track p95 API response times

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'

export function middleware(request: NextRequest) {
  const startTime = Date.now()
  
  // Generate unique request ID for tracing
  const requestId = nanoid(12)
  
  // Clone request headers and add request ID
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', requestId)
  
  // Continue to the route handler
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  
  // Add request ID to response headers (for debugging)
  response.headers.set('x-request-id', requestId)
  
  // Log performance metrics in production
  if (process.env.NODE_ENV === 'production') {
    const duration = Date.now() - startTime
    const path = request.nextUrl.pathname
    
    // Log slow requests (>500ms - NFR-2 threshold)
    if (duration > 500) {
      console.warn(`[SLOW] ${request.method} ${path} - ${duration}ms [${requestId}]`)
    }
    
    // Log all API requests with timing
    if (path.startsWith('/api/')) {
      console.log(`[API] ${request.method} ${path} - ${duration}ms [${requestId}]`)
    }
  }
  
  return response
}

// Apply middleware to API routes and server-rendered pages
export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
    '/shop/:path*',
  ],
}
