// FR-154: Order history/timeline API endpoint
// GET /api/orders/[id]/history - Fetch status change history for an order

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sellerId = await requireAuth(request)
    const orderId = params.id

    // Verify order belongs to seller's shop
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        shop: { sellerId }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or access denied' },
        { status: 404 }
      )
    }

    // Fetch order history
    const history = await prisma.orderHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ history })

  } catch (error) {
    console.error('[ORDER_HISTORY_FETCH]', error)
    return NextResponse.json(
      { error: 'Failed to fetch order history' },
      { status: 500 }
    )
  }
}
