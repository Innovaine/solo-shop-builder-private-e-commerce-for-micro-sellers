// FR-155: Bulk product status update API endpoint
// POST /api/products/bulk-status - Update status for multiple products at once

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const sellerId = await requireAuth(request)
    const { productIds, status } = await request.json()

    // Validate input
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'productIds must be a non-empty array' },
        { status: 400 }
      )
    }

    if (status !== 'PUBLISHED' && status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Invalid status. Must be PUBLISHED or DRAFT' },
        { status: 400 }
      )
    }

    // Verify all products belong to seller
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        shop: { sellerId }
      }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'Some products not found or access denied' },
        { status: 403 }
      )
    }

    // Update all products
    const result = await prisma.product.updateMany({
      where: {
        id: { in: productIds },
        shop: { sellerId }
      },
      data: { status }
    })

    return NextResponse.json({
      message: `Updated ${result.count} products to ${status}`,
      count: result.count
    })

  } catch (error) {
    console.error('[BULK_PRODUCT_STATUS_UPDATE]', error)
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    )
  }
}
