// MyFatoorah checkout API route
// Creates a payment session with MyFatoorah and returns payment URL

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { shopSlug, items } = await req.json()

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

    // Create payment with MyFatoorah
    const paymentResponse = await fetch(`${myfatoorahApiUrl}/v3/payments`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${myfatoorahApiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        PaymentMethod: 'CARD',
        Order: {
          Amount: total / 100, // Convert cents to dollars
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
      return NextResponse.json(
        { error: 'Invalid payment response from MyFatoorah' },
        { status: 500 }
      )
    }

    // Create pending order in database with payment ID
    // This will be completed when the callback receives payment confirmation
    const invoiceId = paymentData.Data.InvoiceId
    
    // Store cart items and shop context as JSON metadata
    const orderMetadata = {
      shopId: shop.id,
      shopSlug: shopSlug,
      items: items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        title: products.find(p => p.id === item.productId)?.title || 'Unknown',
        price: products.find(p => p.id === item.productId)?.price || 0,
      })),
    }

    // Create a pending order with the MyFatoorah invoice ID as the payment ID
    // This allows us to find and complete it in the callback
    const pendingOrder = await prisma.order.create({
      data: {
        shopId: shop.id,
        customerEmail: '', // Will be updated in callback
        status: 'pending',
        total: total,
        stripePaymentId: invoiceId, // Store invoice ID to match in callback
        metadata: JSON.stringify(orderMetadata),
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
            productTitle: product.title, // Match schema field name
            quantity: item.quantity,
            price: product.price,
          },
        })
      }
    }

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
