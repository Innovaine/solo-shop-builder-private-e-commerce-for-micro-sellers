// FR-8: Product CRUD API
// GET /api/products - list products for a shop (query param: ?shopId=xxx or use seller's shop)
// POST /api/products - create new product (seller must be logged in)

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { productSchema } from '@/lib/product'
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shopId = searchParams.get('shopId')

    if (!shopId) {
      return NextResponse.json(
        { error: 'Shop ID is required (query param: shopId)' },
        { status: 400 }
      )
    }

    // Fetch products for shop
    const products = await prisma.product.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products. Please try again.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check auth
    const { sellerId } = await requireAuth()

    // Rate limiting check
    const clientId = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.SHOP_CREATE)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetAt).toISOString(),
          },
        }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const productData = productSchema.parse(body)

    // Get seller's shop (seller must have a shop to create products)
    const shop = await prisma.shop.findFirst({
      where: { sellerId },
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'You must create a shop before adding products.' },
        { status: 400 }
      )
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        shopId: shop.id,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        imageUrl: productData.imageUrl,
        category: productData.category,
        stock: productData.stock,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'You must be logged in to create products.' },
        { status: 401 }
      )
    }

    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product. Please try again.' },
      { status: 500 }
    )
  }
}
