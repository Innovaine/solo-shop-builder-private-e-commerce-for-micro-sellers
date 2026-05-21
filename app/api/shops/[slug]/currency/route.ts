// GET /api/shops/[slug]/currency - Fetch shop currency
// Used by checkout page to determine which payment provider to show
// PUT /api/shops/[slug]/currency - Update shop currency

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const shop = await prisma.shop.findUnique({
      where: { slug },
      select: { currency: true },
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ currency: shop.currency || 'USD' }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch shop currency:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const seller = await requireAuth()
    if (!seller) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const { currency } = await request.json()

    // Validate currency value
    if (!currency || (currency !== 'USD' && currency !== 'KWD')) {
      return NextResponse.json(
        { error: 'Invalid currency. Must be USD or KWD' },
        { status: 400 }
      )
    }

    // Find shop owned by authenticated seller
    const shop = await prisma.shop.findFirst({
      where: {
        slug,
        sellerId: seller.id,
      },
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found or not owned by you' },
        { status: 404 }
      )
    }

    // Update currency
    const updatedShop = await prisma.shop.update({
      where: { id: shop.id },
      data: { currency },
      select: { currency: true },
    })

    return NextResponse.json(
      { currency: updatedShop.currency },
      { status: 200 }
    )
  } catch (error) {
    console.error('Failed to update shop currency:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
