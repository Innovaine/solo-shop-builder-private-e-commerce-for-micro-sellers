// Request timeout handling for API routes
// Prevents long-running requests from blocking server resources

/**
 * Wraps a promise with a timeout
 * @param promise - Promise to wrap
 * @param timeoutMs - Timeout in milliseconds
 * @param errorMessage - Custom error message
 * @returns Promise that rejects if timeout is exceeded
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 30000,
  errorMessage = 'Request timeout'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ])
}

/**
 * Wrap an API route handler with timeout protection
 * @param handler - Route handler function
 * @param timeoutMs - Timeout in milliseconds (default 30s)
 */
export function withApiTimeout<T extends (...args: unknown[]) => Promise<Response>>(
  handler: T,
  timeoutMs: number = 30000
): T {
  return (async (...args: unknown[]) => {
    try {
      return await withTimeout(
        handler(...args),
        timeoutMs,
        `API request exceeded ${timeoutMs}ms timeout`
      )
    } catch (error) {
      if (error instanceof Error && error.message.includes('timeout')) {
        return new Response(
          JSON.stringify({
            error: 'Request timeout',
            message: 'The request took too long to complete. Please try again.',
            timestamp: new Date().toISOString(),
          }),
          {
            status: 504,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }
      throw error
    }
  }) as T
}

// Preset timeout constants
export const TIMEOUTS = {
  API_DEFAULT: 30000,      // 30 seconds for standard API calls
  AUTH: 15000,             // 15 seconds for auth operations
  DATABASE: 10000,         // 10 seconds for database queries
  EMAIL: 20000,            // 20 seconds for email sending
  HEALTH_CHECK: 5000,      // 5 seconds for health checks
} as const
