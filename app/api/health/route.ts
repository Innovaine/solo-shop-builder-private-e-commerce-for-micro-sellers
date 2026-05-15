// Health check endpoint for Docker and load balancers
// Includes database connectivity check for production readiness
// Validates all critical services: DB, email (SMTP)

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import nodemailer from 'nodemailer'

export async function GET() {
  const startTime = Date.now()
  const checks: Record<string, { status: string; message?: string; responseTime?: string }> = {}
  
  // Check database connectivity
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    checks.database = {
      status: 'ok',
      responseTime: `${Date.now() - dbStart}ms`,
    }
  } catch (error) {
    checks.database = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
  
  // Check email service connectivity (SMTP)
  try {
    const emailStart = Date.now()
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    
    // Verify SMTP connection (doesn't send email)
    await transporter.verify()
    checks.email = {
      status: 'ok',
      responseTime: `${Date.now() - emailStart}ms`,
    }
  } catch (error) {
    checks.email = {
      status: 'warning',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
  
  const totalResponseTime = Date.now() - startTime
  const allOk = checks.database.status === 'ok' && checks.email.status === 'ok'
  
  if (!allOk) {
    console.error('[HEALTH CHECK FAILED]', checks)
    
    return NextResponse.json(
      {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        responseTime: `${totalResponseTime}ms`,
        checks,
      },
      { status: 503 }
    )
  }
  
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    responseTime: `${totalResponseTime}ms`,
    checks,
  })
}
