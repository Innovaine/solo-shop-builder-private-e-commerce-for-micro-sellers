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

    // Store pending order data in session or database
    // For now, we'll rely on the callback to create the order
    // In production, you'd want to store this in a pending_orders table

    return NextResponse.json({
      paymentUrl: paymentData.Data.PaymentURL,
      invoiceId: paymentData.Data.InvoiceId,
      paymentId: paymentData.Data.PaymentId,
    })

  } catch (error) {
    console.error('MyFatoorah checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
