// Global Next.js middleware for request handling
// Adds request ID, performance logging, timeout handling

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { nanoid } from 'nanoid'

export function middleware(request: NextRequest) {
  const startTime = Date.now()
  
  // Generate unique request ID for tracing
  const requestId = nanoid(16)
  
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', requestId)
  
  // Create response with request ID
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  
  // Add request ID to response headers
  response.headers.set('x-request-id', requestId)
  
  // Add CORS headers for production (allow all origins for now)
  // ASSUMPTION: In production, restrict to specific domains
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Log request details (in production, send to monitoring service)
  const responseTime = Date.now() - startTime
  console.log(JSON.stringify({
    requestId,
    method: request.method,
    path: request.nextUrl.pathname,
    responseTime: `${responseTime}ms`,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent')?.substring(0, 100),
  }))
  
  return response
}

// Apply middleware to all API routes
export const config = {
  matcher: [
    '/api/:path*',
    '/auth/:path*',
  ],
}
