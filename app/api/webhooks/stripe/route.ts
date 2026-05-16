// POST /api/webhooks/stripe - Handle Stripe webhook events
// FR-15 & FR-16: Webhook order capture with signature verification + audit trail
// NFR-9: Webhook audit trail

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    // Verify webhook signature (NFR-6)
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Log webhook event to audit trail (NFR-17)
  let webhookRecord
  try {
    webhookRecord = await prisma.webhook.create({
      data: {
        stripeEventId: event.id,
        eventType: event.type,
        payload: JSON.stringify(event),
        status: 'pending',
      },
    })
  } catch (err: any) {
    console.error('Failed to log webhook:', err)
    // Continue processing even if logging fails
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Only process payment mode sessions
        if (session.mode !== 'payment') {
          break
        }

        // Extract metadata
        const shopId = session.metadata?.shopId
        if (!shopId) {
          console.error('Missing shopId in session metadata')
          break
        }

        // Retrieve session with line items
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items'],
        })

        const lineItems = fullSession.line_items?.data || []
        const customerEmail = session.customer_email || session.customer_details?.email || 'unknown@example.com'
        const customerName = session.customer_details?.name || null
        const total = session.amount_total || 0

        // Check for idempotency: don't create duplicate orders (NFR-25)
        const existingOrder = await prisma.order.findUnique({
          where: { stripePaymentId: session.payment_intent as string },
        })

        if (existingOrder) {
          console.log(`Order already exists for payment_intent ${session.payment_intent}`)
          break
        }

        // Create order with items
        const order = await prisma.order.create({
          data: {
            shopId,
            customerEmail,
            customerName,
            status: 'paid', // Start as paid since checkout completed
            total,
            stripePaymentId: session.payment_intent as string,
            items: {
              create: lineItems.map((item) => ({
                productId: item.price?.product as string, // Stripe product ID (not our DB ID)
                productTitle: item.description || 'Unknown product',
                price: item.price?.unit_amount || 0,
                quantity: item.quantity || 1,
              })),
            },
          },
          include: {
            items: true,
          },
        })

        console.log(`Order created: ${order.id} for shop ${shopId}`)

        // TODO FR-16: Send order confirmation email to seller
        // TODO FR-16: Send order confirmation email to customer

        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log(`PaymentIntent succeeded: ${paymentIntent.id}`)
        // Order already created in checkout.session.completed
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error(`Payment failed: ${paymentIntent.id}`)
        // TODO: Handle payment failure (update order status if exists)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark webhook as processed
    if (webhookRecord) {
      await prisma.webhook.update({
        where: { id: webhookRecord.id },
        data: {
          status: 'processed',
          processedAt: new Date(),
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook processing error:', err)

    // Mark webhook as failed
    if (webhookRecord) {
      await prisma.webhook.update({
        where: { id: webhookRecord.id },
        data: {
          status: 'failed',
          processedAt: new Date(),
        },
      })
    }

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
