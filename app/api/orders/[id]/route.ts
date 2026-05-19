// PATCH /api/orders/[id] - Update order status and tracking info
// FR-17: Seller order management

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check using canonical requireAuth() pattern
    const { sellerId } = await requireAuth()

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

    if (order.shop.sellerId !== sellerId) {
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

    // Update order and log history (FR-154)
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Log status change if status is being updated
      if (status && status !== order.status) {
        await tx.orderHistory.create({
          data: {
            orderId,
            statusFrom: order.status,
            statusTo: status
          }
        })
      }

      // Update order
      return await tx.order.update({
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
    })

    // TODO: Send notification email to customer when status changes to 'shipped'

    return NextResponse.json({ order: updatedOrder })
  } catch (error: any) {
    // Handle auth errors with 401, not 500
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    console.error('Failed to update order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
