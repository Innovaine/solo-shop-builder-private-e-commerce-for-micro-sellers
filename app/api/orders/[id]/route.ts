// PATCH /api/orders/[id] - Update order status and tracking info
// FR-17: Seller order management

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import prisma from '@/src/lib/db'
import { verifySession } from '@/src/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const orderId = params.id
    const body = await request.json()
    const { status, trackingId, trackingUrl } = body

    // Verify order belongs to one of seller's shops
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shop: {
          select: {
            sellerId: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    if (order.shop.sellerId !== session.sellerId) {
      return NextResponse.json(
        { error: 'Not authorized to update this order' },
        { status: 403 }
      )
    }

    // Validate status
    const validStatuses = ['pending', 'paid', 'in_progress', 'shipped', 'delivered', 'canceled']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status && { status }),
        ...(trackingId !== undefined && { trackingId }),
        ...(trackingUrl !== undefined && { trackingUrl }),
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
    })

    // TODO: Send notification email to customer when status changes to 'shipped'

    return NextResponse.json({ order: updatedOrder })
  } catch (error: any) {
    console.error('Failed to update order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
