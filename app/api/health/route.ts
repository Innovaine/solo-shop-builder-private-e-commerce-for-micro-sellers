// Health check endpoint for Docker and load balancers
// Includes database connectivity check for production readiness

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const startTime = Date.now()
  
  try {
    // Quick database ping to verify connectivity
    await prisma.$queryRaw`SELECT 1`
    
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      responseTime: `${responseTime}ms`,
    })
  } catch (error) {
    console.error('[HEALTH CHECK FAILED]', error)
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
