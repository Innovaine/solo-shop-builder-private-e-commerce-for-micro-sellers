// POST /api/checkout - Create Stripe checkout session
// FR-13 & FR-14: Stripe Checkout integration

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/src/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shopSlug, customerEmail } = body

    // Validate request
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    if (!shopSlug) {
      return NextResponse.json(
        { error: 'Shop slug is required' },
        { status: 400 }
      )
    }

    // Verify shop exists
    const shop = await prisma.shop.findUnique({
      where: { slug: shopSlug },
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Verify all products exist and prices match (prevent price manipulation)
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        shopId: shop.id,
      },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Some products not found or not from this shop' },
        { status: 400 }
      )
    }

    // Build line items for Stripe checkout
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId)
      
      if (!product) {
        throw new Error(`Product ${item.productId} not found`)
      }

      // Verify price matches (prevent client-side price tampering)
      if (product.price !== item.price) {
        throw new Error(`Price mismatch for product ${product.title}`)
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            description: product.description || undefined,
            images: product.imageUrl ? [product.imageUrl] : undefined,
          },
          unit_amount: product.price, // Price in cents
        },
        quantity: item.quantity,
      }
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customerEmail || undefined,
      success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/shop/${shopSlug}`,
      metadata: {
        shopId: shop.id,
        shopSlug: shop.slug,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('Checkout session creation failed:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
