// FR-1: Email magic link signup
// POST /api/auth/signup with { email }
// Sends 6-digit magic link token valid for 15 minutes
// Rate limited: 5 attempts per 15 minutes per IP

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/db'
import { sendMagicLinkEmail } from '@/lib/email'
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit'

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientId = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.AUTH_SIGNUP)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetAt).toISOString(),
          }
        }
      )
    }
    
    const body = await request.json()
    const { email } = signupSchema.parse(body)

    // Find or create seller
    let seller = await prisma.seller.findUnique({
      where: { email },
    })

    if (!seller) {
      seller = await prisma.seller.create({
        data: { email },
      })
    }

    // Generate 6-digit token (using nanoid for security, not actual digits to avoid brute force)
    const token = nanoid(32)
    
    // Token expires in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

    // Create auth token
    await prisma.authToken.create({
      data: {
        token,
        sellerId: seller.id,
        expiresAt,
      },
    })

    // Send magic link email
    await sendMagicLinkEmail(email, token)

    return NextResponse.json(
      { message: 'Magic link sent. Check your email.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to send magic link. Please try again.' },
      { status: 500 }
    )
  }
}
