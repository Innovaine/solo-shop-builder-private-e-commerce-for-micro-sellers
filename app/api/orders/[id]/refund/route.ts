// POST /api/orders/[id]/refund — Issue refund for order (FR-24)
// Seller initiates refund, customer notified

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'
import { sendEmail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const sessionCookie = cookies().get('session')
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await prisma.authToken.findUnique({
      where: { token: sessionCookie.value },
      include: { seller: { include: { shops: true } } },
    })

    if (!session || session.expiresAt < new Date() || session.used) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 })
    }

    const shop = session.seller.shops[0]
    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 })
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify order belongs to this shop
    if (order.shopId !== shop.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if already refunded
    if (order.status === 'refunded') {
      return NextResponse.json(
        { error: 'Order already refunded' },
        { status: 400 }
      )
    }

    // Check if order is paid
    if (order.status !== 'paid' && order.status !== 'in_progress' && order.status !== 'shipped' && order.status !== 'delivered') {
      return NextResponse.json(
        { error: 'Only paid orders can be refunded' },
        { status: 400 }
      )
    }

    if (!order.stripePaymentId) {
      return NextResponse.json(
        { error: 'No payment ID found for this order' },
        { status: 400 }
      )
    }

    // Issue Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentId,
      reason: 'requested_by_customer',
    })

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'refunded',
        updatedAt: new Date(),
      },
    })

    // Send refund notification email to customer
    try {
      await sendEmail({
        to: order.customerEmail,
        subject: `Refund Issued for Order #${order.id.slice(0, 8)}`,
        text: `Hi ${order.customerName || 'there'},\n\nYour refund of $${(order.total / 100).toFixed(2)} has been processed.\n\nRefund ID: ${refund.id}\nOrder ID: ${order.id}\n\nPlease allow 5-10 business days for the refund to appear in your account.\n\nBest regards,\n${shop.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Refund Issued</h2>
            <p>Hi ${order.customerName || 'there'},</p>
            <p>Your refund of <strong>$${(order.total / 100).toFixed(2)}</strong> has been processed.</p>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 4px; margin: 16px 0;">
              <p style="margin: 4px 0;"><strong>Refund ID:</strong> ${refund.id}</p>
              <p style="margin: 4px 0;"><strong>Order ID:</strong> ${order.id}</p>
            </div>
            <p>Please allow 5-10 business days for the refund to appear in your account.</p>
            <p>Best regards,<br>${shop.name}</p>
          </div>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send refund notification:', emailError)
      // Don't fail the refund if email fails
    }

    return NextResponse.json({
      message: 'Refund issued successfully',
      order: updatedOrder,
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
      },
    })
  } catch (error: any) {
    console.error('Refund error:', error)
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: `Stripe error: ${error.message}` },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process refund' },
      { status: 500 }
    )
  }
}
