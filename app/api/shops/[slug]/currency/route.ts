// GET /api/shops/[slug]/currency - Fetch shop currency
// Used by checkout page to determine which payment provider to show

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
