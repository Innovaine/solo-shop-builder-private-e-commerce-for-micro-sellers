// Simple in-memory rate limiting for auth endpoints
// Prevents brute force attacks on magic link generation
// ASSUMPTION: Single-server deployment. For multi-server, use Redis.

type RateLimitStore = {
  [key: string]: {
    count: number
    resetAt: number
  }
}

const store: RateLimitStore = {}

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key]
    }
  })
}, 10 * 60 * 1000)

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyPrefix?: string
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP, email, etc.)
 * @param config - Rate limit configuration
 * @returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const key = `${config.keyPrefix || 'rl'}:${identifier}`
  const now = Date.now()
  
  // Initialize or reset if window expired
  if (!store[key] || store[key].resetAt < now) {
    store[key] = {
      count: 1,
      resetAt: now + config.windowMs,
    }
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: store[key].resetAt,
    }
  }
  
  // Increment count
  store[key].count += 1
  
  const allowed = store[key].count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - store[key].count)
  
  return {
    allowed,
    remaining,
    resetAt: store[key].resetAt,
  }
}

/**
 * Get client identifier from request (IP address fallback chain)
 */
export function getClientIdentifier(request: Request): string {
  // Check common proxy headers
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  
  // Fallback to a generic identifier
  // In serverless, we may not have direct IP access
  return 'unknown-client'
}

// Preset rate limit configs
export const RATE_LIMITS = {
  AUTH_SIGNUP: {
    maxRequests: 5, // 5 signup attempts
    windowMs: 15 * 60 * 1000, // per 15 minutes
    keyPrefix: 'auth:signup',
  },
  AUTH_VERIFY: {
    maxRequests: 10, // 10 verification attempts
    windowMs: 15 * 60 * 1000, // per 15 minutes
    keyPrefix: 'auth:verify',
  },
  SHOP_CREATE: {
    maxRequests: 3, // 3 shop creation attempts
    windowMs: 60 * 60 * 1000, // per hour
    keyPrefix: 'shop:create',
  },
} as const
