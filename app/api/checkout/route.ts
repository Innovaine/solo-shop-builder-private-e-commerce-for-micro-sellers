// POST /api/checkout - Create Stripe checkout session
// FR-13 & FR-14: Stripe Checkout integration

export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/db'

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

    // Verify shop exists and is active
    const shop = await prisma.shop.findUnique({
      where: { slug: shopSlug },
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Block checkout if shop is inactive
    if (shop.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'This shop is currently inactive and cannot accept orders' },
        { status: 403 }
      )
    }

    // Verify all products exist and prices match (prevent price manipulation)
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        shopId: shop.id,
      },
      include: {
        variants: true,
      },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Some products not found or not from this shop' },
        { status: 400 }
      )
    }

    // Build line items for Stripe checkout
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      
      if (!product) {
        throw new Error(`Product ${item.productId} not found`)
      }

      let finalPrice = product.price
      let productName = product.title
      let stockAvailable = product.stock

      // Handle variant if specified
      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId)
        if (!variant) {
          return NextResponse.json(
            { error: `Variant ${item.variantId} not found for product ${product.title}` },
            { status: 400 }
          )
        }
        
        // Use variant price if set, otherwise fall back to product price
        finalPrice = variant.price ?? product.price
        productName = `${product.title} - ${variant.name}: ${variant.value}`
        stockAvailable = variant.stock
      }

      // FR-24: Atomic inventory validation - check stock BEFORE payment
      // This prevents payment if stock is insufficient
      if (stockAvailable < item.quantity) {
        return NextResponse.json(
          { 
            error: `Insufficient stock for ${productName}`,
            details: {
              product: productName,
              available: stockAvailable,
              requested: item.quantity,
            }
          },
          { status: 400 }
        )
      }

      // Verify price matches (prevent client-side price tampering)
      if (finalPrice !== item.price) {
        throw new Error(`Price mismatch for ${productName}`)
      }

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
            description: product.description || undefined,
            images: product.imageUrl ? [product.imageUrl] : undefined,
          },
          unit_amount: finalPrice, // Price in cents
        },
        quantity: item.quantity,
      })
    }

    // Store cart items in metadata for webhook processing
    // (we'll need product/variant IDs to decrement stock)
    const cartMetadata = items.map((item: any) => ({
      productId: item.productId,
      variantId: item.variantId || null,
      quantity: item.quantity,
    }))

    // Determine base URL from environment or request headers
    let baseUrl = process.env.APP_URL
    if (!baseUrl) {
      // Fallback: construct from request headers
      const host = request.headers.get('host')
      const protocol = request.headers.get('x-forwarded-proto') || 'https'
      baseUrl = `${protocol}://${host}`
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customerEmail || undefined,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop/${shopSlug}`,
      metadata: {
        shopId: shop.id,
        shopSlug: shop.slug,
        cartItems: JSON.stringify(cartMetadata), // Store for stock decrementing
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
