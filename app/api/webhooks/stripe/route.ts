// POST /api/webhooks/stripe - Handle Stripe webhook events
// FR-15 & FR-16: Webhook order capture with signature verification + audit trail
// NFR-9: Webhook audit trail

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/db'
import { sendOrderConfirmationEmail, sendEmail } from '@/lib/email'

/**
 * Get Stripe client at runtime (not module scope)
 * This ensures env vars are read when the function is called, not at module load time
 */
function getStripeClient(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-04-10',
  })
}

/**
 * Get webhook secret at runtime (not module scope)
 */
function getWebhookSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET!
}

export async function POST(request: NextRequest) {
  // Get Stripe client and webhook secret at runtime
  const stripe = getStripeClient()
  const webhookSecret = getWebhookSecret()
  
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
    // FR-25 & NFR-6: Verify webhook signature using HMAC
    // Stripe.webhooks.constructEvent validates the signature
    // and throws if invalid/tampered
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
        const cartItemsJson = session.metadata?.cartItems
        
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

        // Parse cart items for stock decrementing
        let cartItems: Array<{productId: string, variantId: string | null, quantity: number}> = []
        if (cartItemsJson) {
          try {
            cartItems = JSON.parse(cartItemsJson)
          } catch (e) {
            console.error('Failed to parse cartItems metadata:', e)
          }
        }

        // Create order with items (use transaction for atomicity)
        // FR-24: Atomic stock validation + decrement
        const order = await prisma.$transaction(async (tx) => {
          // First, validate stock availability for all items
          for (const item of cartItems) {
            if (item.variantId) {
              // Check variant stock
              const variant = await tx.productVariant.findUnique({
                where: { id: item.variantId },
                select: { stock: true, name: true, value: true, product: { select: { title: true } } },
              })
              
              if (!variant) {
                throw new Error(`Variant ${item.variantId} not found`)
              }
              
              if (variant.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${variant.product.title} - ${variant.name}: ${variant.value}. Available: ${variant.stock}, requested: ${item.quantity}`)
              }
            } else {
              // Check product stock
              const product = await tx.product.findUnique({
                where: { id: item.productId },
                select: { stock: true, title: true },
              })
              
              if (!product) {
                throw new Error(`Product ${item.productId} not found`)
              }
              
              if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.title}. Available: ${product.stock}, requested: ${item.quantity}`)
              }
            }
          }

          // All stock checks passed - create order
          const newOrder = await tx.order.create({
            data: {
              shopId,
              customerEmail,
              customerName,
              status: 'paid', // Start as paid since checkout completed
              total,
              stripePaymentId: session.payment_intent as string,
              items: {
                create: lineItems.map((item, idx) => ({
                  productId: cartItems[idx]?.productId || 'unknown', // Use our DB product ID
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

          // Atomically decrement stock after order creation
          for (const item of cartItems) {
            if (item.variantId) {
              // Decrement variant stock atomically
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                },
              })
            } else {
              // Decrement product stock atomically
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                },
              })
            }
          }

          return newOrder
        })

        console.log(`Order created: ${order.id} for shop ${shopId}`)

        // FR-15 & FR-16: Send order confirmation emails
        try {
          // Fetch shop details and seller email
          const shop = await prisma.shop.findUnique({
            where: { id: shopId },
            include: {
              seller: true,
            },
          })

          if (shop) {
            // Build order summary
            const orderSummary = `Order ID: ${order.id.slice(0, 8).toUpperCase()}
Total: ${(total / 100).toFixed(2)}

Items:
${lineItems.map((item) => `- ${item.description} x${item.quantity} - ${((item.price?.unit_amount || 0) / 100).toFixed(2)}`).join('\n')}

Customer: ${customerName || customerEmail}`;

            const trackingUrl = `${process.env.APP_URL || 'http://localhost:3000'}/track/${order.id}`

            // FR-16: Send confirmation email to customer
            await sendOrderConfirmationEmail(
              customerEmail,
              customerName || 'Customer',
              shop.name,
              orderSummary,
              trackingUrl,
              shop.emailTemplateBody || null
            )

            // FR-15: Send notification email to seller
            await sendEmail({
              to: shop.seller.email,
              subject: `New Order #${order.id.slice(0, 8)} - ${shop.name}`,
              text: `You have a new order!

${orderSummary}

View and manage this order at: ${process.env.APP_URL || 'http://localhost:3000'}/dashboard/orders`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #10B981;">New Order Received!</h2>
                  <div style="background-color: #F9FAFB; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <pre style="margin: 0; white-space: pre-wrap; font-family: monospace; font-size: 14px;">${orderSummary}</pre>
                  </div>
                  <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard/orders" style="display: inline-block; background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">
                    View Order
                  </a>
                </div>
              `,
            })

            console.log(`Order confirmation emails sent for order ${order.id}`)
          }
        } catch (emailError: any) {
          // Don't fail the webhook if email fails
          console.error('Failed to send order confirmation emails:', emailError)
        }

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
