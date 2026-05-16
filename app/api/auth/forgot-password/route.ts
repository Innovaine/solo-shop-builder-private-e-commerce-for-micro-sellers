// FR-23: Forgot password - send reset link
// POST /api/auth/forgot-password with { email }
// Sends email with password reset link valid for 1 hour

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { nanoid } from 'nanoid'
import { prisma } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientId = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.AUTH_SIGNUP)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many reset requests. Please try again later.' },
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
    const { email } = forgotPasswordSchema.parse(body)

    // Find seller - don't reveal if account doesn't exist
    const seller = await prisma.seller.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration
    if (!seller) {
      return NextResponse.json(
        { message: 'If that email exists, a reset link has been sent.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const resetToken = nanoid(32)
    
    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // Save reset token to seller
    await prisma.seller.update({
      where: { id: seller.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: expiresAt,
      },
    })

    // Send reset email
    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json(
      { message: 'If that email exists, a reset link has been sent.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}
