// FR-24: Reset password with token
// POST /api/auth/reset-password with { token, newPassword }
// Validates token and sets new password

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = resetPasswordSchema.parse(body)

    // Find seller by reset token
    const seller = await prisma.seller.findUnique({
      where: { passwordResetToken: token },
    })

    if (!seller || !seller.passwordResetExpires) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (seller.passwordResetExpires < new Date()) {
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Hash new password (12 rounds per NFR-4)
    const passwordHash = await bcrypt.hash(newPassword, 12)

    // Update seller: set new password and clear reset token
    await prisma.seller.update({
      where: { id: seller.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    })

    return NextResponse.json(
      { message: 'Password reset successful. You can now sign in.' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    )
  }
}
