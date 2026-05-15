// FR-3: Shop creation API
// POST /api/shops with { name, slug }
// GET /api/shops - fetch seller's shops
// Creates shop for authenticated seller

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

const shopSchema = z.object({
  name: z.string().min(1, 'Shop name is required').max(50, 'Shop name too long'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .max(30, 'Slug must be at most 30 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
})

export async function GET(request: NextRequest) {
  try {
    // Check auth
    const { sellerId } = await requireAuth()

    // Fetch seller's shops
    const shops = await prisma.shop.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(shops, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'You must be logged in to view shops.' },
        { status: 401 }
      )
    }

    console.error('Shop fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shops. Please try again.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check auth
    const { sellerId } = await requireAuth()
    
    // Rate limiting check (prevent shop creation spam)
    const { checkRateLimit, getClientIdentifier, RATE_LIMITS } = await import('@/lib/rate-limit')
    const clientId = getClientIdentifier(request)
    const rateLimitResult = checkRateLimit(clientId, RATE_LIMITS.SHOP_CREATE)
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many shop creation attempts. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetAt).toISOString(),
          }
        }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const { name, slug } = shopSchema.parse(body)

    // Check if slug already exists
    const existingShop = await prisma.shop.findUnique({
      where: { slug },
    })

    if (existingShop) {
      return NextResponse.json(
        { error: 'Slug already taken. Try another.' },
        { status: 400 }
      )
    }

    // Check if seller already has a shop
    const sellerShop = await prisma.shop.findFirst({
      where: { sellerId },
    })

    if (sellerShop) {
      return NextResponse.json(
        { error: 'You already have a shop.' },
        { status: 400 }
      )
    }

    // Create shop
    const shop = await prisma.shop.create({
      data: {
        name,
        slug,
        sellerId,
      },
    })

    return NextResponse.json(shop, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'You must be logged in to create a shop.' },
        { status: 401 }
      )
    }

    console.error('Shop creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create shop. Please try again.' },
      { status: 500 }
    )
  }
}
