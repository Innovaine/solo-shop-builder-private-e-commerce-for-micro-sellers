// FR-153: Product status toggle API endpoint
// PUT /api/products/[id]/status - Toggle product status between PUBLISHED and DRAFT

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import prisma from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { sellerId } = await requireAuth()
    const { status } = await request.json()
    const productId = params.id

    // Validate status
    if (status !== 'PUBLISHED' && status !== 'DRAFT') {
      return NextResponse.json(
        { error: 'Invalid status. Must be PUBLISHED or DRAFT' },
        { status: 400 }
      )
    }

    // Find product and verify ownership
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        shop: { sellerId }
      },
      include: { shop: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or access denied' },
        { status: 404 }
      )
    }

    // Update product status
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { status }
    })

    return NextResponse.json({
      message: `Product status changed to ${status}`,
      product: {
        id: updatedProduct.id,
        title: updatedProduct.title,
        status: updatedProduct.status
      }
    })

  } catch (error) {
    console.error('[PRODUCT_STATUS_UPDATE]', error)
    return NextResponse.json(
      { error: 'Failed to update product status' },
      { status: 500 }
    )
  }
}
