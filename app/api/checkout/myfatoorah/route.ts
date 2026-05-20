// MyFatoorah checkout API route
// Creates a payment session with MyFatoorah and returns payment URL

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { shopSlug, items, customerEmail } = await req.json()

    if (!shopSlug || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Shop slug and items are required' },
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

    // Calculate total
    let total = 0
    const productIds = items.map((item: any) => item.productId)

    // Fetch products to validate prices
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        shopId: shop.id,
      },
    })

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: 'Some products not found' },
        { status: 404 }
      )
    }

    // Validate and calculate total
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }
      total += product.price * item.quantity
    }

    // Determine base URL from environment or request headers
    let appUrl = process.env.APP_URL
    if (!appUrl) {
      // Fallback: construct from request headers
      const host = req.headers.get('host')
      const protocol = req.headers.get('x-forwarded-proto') || 'https'
      appUrl = `${protocol}://${host}`
    }
    
    // Create payment request with MyFatoorah
    const myfatoorahApiKey = process.env.MYFATOORAH_API_KEY
    const myfatoorahApiUrl = process.env.MYFATOORAH_API_URL || 'https://apitest.myfatoorah.com'

    if (!myfatoorahApiKey) {
      return NextResponse.json(
        { error: 'MyFatoorah API key not configured' },
        { status: 500 }
      )
    }

    // Create pending order FIRST to get order ID for UserDefinedField
    const pendingOrder = await prisma.order.create({
      data: {
        shopId: shop.id,
        customerEmail: customerEmail || '', // Store real email from form
        status: 'pending',
        total: total,
        metadata: JSON.stringify({
          shopId: shop.id,
          shopSlug: shopSlug,
          items: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            title: products.find(p => p.id === item.productId)?.title || 'Unknown',
            price: products.find(p => p.id === item.productId)?.price || 0,
          })),
        }),
      },
    })

    // Create order items
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        await prisma.orderItem.create({
          data: {
            orderId: pendingOrder.id,
            productId: product.id,
            productTitle: product.title,
            quantity: item.quantity,
            price: product.price,
          },
        })
      }
    }

    // Create payment with MyFatoorah (v3 API with UserDefinedField for idempotency)
    const paymentResponse = await fetch(`${myfatoorahApiUrl}/v3/payments`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${myfatoorahApiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        PaymentMethod: 'CARD',
        Customer: customerEmail ? { Email: customerEmail } : undefined,
        Order: {
          Amount: total / 100, // Convert cents to dollars
          UserDefinedField: pendingOrder.id, // Store our order ID for easy lookup in callback
        },
        IntegrationUrls: {
          Redirection: `${appUrl}/api/checkout/myfatoorah/callback`,
        },
      }),
    })

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json()
      console.error('MyFatoorah payment creation failed:', errorData)
      return NextResponse.json(
        { error: 'Failed to create payment session' },
        { status: 500 }
      )
    }

    const paymentData = await paymentResponse.json()

    if (!paymentData.IsSuccess || !paymentData.Data?.PaymentURL) {
      // Clean up pending order if payment creation failed
      await prisma.order.delete({ where: { id: pendingOrder.id } })
      return NextResponse.json(
        { error: 'Invalid payment response from MyFatoorah' },
        { status: 500 }
      )
    }

    // Store InvoiceId as the canonical payment reference (per new docs)
    const invoiceId = paymentData.Data.InvoiceId
    
    // Update pending order with MyFatoorah InvoiceId (canonical reference per new docs)
    await prisma.order.update({
      where: { id: pendingOrder.id },
      data: {
        stripePaymentId: invoiceId, // Store InvoiceId for lookup in callback
        metadata: JSON.stringify({
          ...JSON.parse(pendingOrder.metadata || '{}'),
          myfatoorah: {
            invoiceId: invoiceId,
            userDefinedField: pendingOrder.id, // Our order ID for cross-reference
          },
        }),
      },
    })

    console.log('Created pending order:', pendingOrder.id, 'for MyFatoorah invoice:', invoiceId)

    return NextResponse.json({
      paymentUrl: paymentData.Data.PaymentURL,
      invoiceId: paymentData.Data.InvoiceId,
      paymentId: paymentData.Data.PaymentId,
      orderId: pendingOrder.id,
    })

  } catch (error) {
    console.error('MyFatoorah checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
