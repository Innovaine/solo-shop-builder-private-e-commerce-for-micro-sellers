// FR-152: Shop status toggle API endpoint
// PUT /api/shops/status - Toggle shop status between ACTIVE and PAUSED

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import prisma from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    let sellerId: string;
    try {
      const auth = await requireAuth();
      sellerId = auth.sellerId;
    } catch (authError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { status } = await request.json()

    // Validate status
    if (status !== 'ACTIVE' && status !== 'PAUSED') {
      return NextResponse.json(
        { error: 'Invalid status. Must be ACTIVE or PAUSED' },
        { status: 400 }
      )
    }

    // Find seller's shop
    const shop = await prisma.shop.findFirst({
      where: { sellerId }
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Update shop status
    const updatedShop = await prisma.shop.update({
      where: { id: shop.id },
      data: { status }
    })

    return NextResponse.json({
      message: `Shop status changed to ${status}`,
      shop: {
        id: updatedShop.id,
        status: updatedShop.status
      }
    })

  } catch (error) {
    console.error('[SHOP_STATUS_UPDATE]', error)
    return NextResponse.json(
      { error: 'Failed to update shop status' },
      { status: 500 }
    )
  }
}
