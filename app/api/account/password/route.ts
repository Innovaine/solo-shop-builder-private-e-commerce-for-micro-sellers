// FR-22: Account settings password change
// POST /api/account/password with { currentPassword?, newPassword }
// Allows seller to set or change their password

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

const passwordChangeSchema = z.object({
  currentPassword: z.string().optional(), // Required only if password already set
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const { sellerId } = await requireAuth()
    
    const body = await request.json()
    const { currentPassword, newPassword } = passwordChangeSchema.parse(body)

    // Fetch seller
    const seller = await prisma.seller.findUnique({
      where: { id: sellerId },
    })

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      )
    }

    // If seller already has a password, require current password for verification
    if (seller.passwordHash && currentPassword) {
      const passwordValid = await bcrypt.compare(currentPassword, seller.passwordHash)
      
      if (!passwordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 401 }
        )
      }
    } else if (seller.passwordHash && !currentPassword) {
      // Seller has password but didn't provide current password
      return NextResponse.json(
        { error: 'Current password is required' },
        { status: 400 }
      )
    }

    // Hash new password (12 rounds per NFR-4)
    const passwordHash = await bcrypt.hash(newPassword, 12)

    // Update seller password
    await prisma.seller.update({
      where: { id: sellerId },
      data: { passwordHash },
    })

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.error('Password change error:', error)
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    )
  }
}
