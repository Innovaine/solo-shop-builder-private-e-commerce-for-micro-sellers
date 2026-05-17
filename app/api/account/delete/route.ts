// FR-20: Seller account deletion
// POST /api/account/delete
// Deletes seller account and all associated data (GDPR compliance)

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const sellerId = session.sellerId

    if (!sellerId || !session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Delete all related data in correct order to respect foreign key constraints
    // 1. Delete order items first
    await prisma.orderItem.deleteMany({
      where: {
        order: {
          shop: {
            sellerId,
          },
        },
      },
    })

    // 2. Delete orders
    await prisma.order.deleteMany({
      where: {
        shop: {
          sellerId,
        },
      },
    })

    // 3. Delete product variants
    await prisma.productVariant.deleteMany({
      where: {
        product: {
          shop: {
            sellerId,
          },
        },
      },
    })

    // 4. Delete products
    await prisma.product.deleteMany({
      where: {
        shop: {
          sellerId,
        },
      },
    })

    // 5. Delete shops (email templates are part of shop table)
    await prisma.shop.deleteMany({
      where: {
        sellerId,
      },
    })

    // 6. Delete auth tokens
    await prisma.authToken.deleteMany({
      where: {
        sellerId,
      },
    })

    // 7. Finally delete the seller account
    await prisma.seller.delete({
      where: {
        id: sellerId,
      },
    })

    // Destroy session
    session.destroy()

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Account deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete account. Please contact support.' },
      { status: 500 }
    )
  }
}
