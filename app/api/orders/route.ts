// GET /api/orders - Fetch all orders for the seller's shops
// FR-17: Seller order dashboard

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const session = await verifySession(sessionCookie.value)
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Get all shops for this seller
    const shops = await prisma.shop.findMany({
      where: { sellerId: session.sellerId },
      select: { id: true },
    })

    const shopIds = shops.map((s) => s.id)

    // Get all orders for these shops
    const orders = await prisma.order.findMany({
      where: {
        shopId: { in: shopIds },
      },
      include: {
        items: true,
        shop: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ orders })
  } catch (error: any) {
    console.error('Failed to fetch orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
