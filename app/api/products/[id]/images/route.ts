// Product images API - add/list/delete multiple images for a product
// POST /api/products/[id]/images - Add image to product
// GET /api/products/[id]/images - List all images for product
// DELETE /api/products/[id]/images?imageId=xxx - Delete specific image

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const addImageSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  displayOrder: z.number().int().nonnegative().optional(),
})

// GET /api/products/[id]/images - List all images for product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    const images = await prisma.productImage.findMany({
      where: { productId },
      orderBy: { displayOrder: 'asc' },
    })

    return NextResponse.json({ images }, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch product images:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/products/[id]/images - Add image to product
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { sellerId } = await requireAuth()
    const { id: productId } = await params
    
    // Verify product exists and belongs to seller
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        shop: { sellerId },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { imageUrl, displayOrder } = addImageSchema.parse(body)

    // Get current max display order if not specified
    let order = displayOrder
    if (order === undefined) {
      const maxOrder = await prisma.productImage.aggregate({
        where: { productId },
        _max: { displayOrder: true },
      })
      order = (maxOrder._max.displayOrder ?? -1) + 1
    }

    const image = await prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        displayOrder: order,
      },
    })

    return NextResponse.json({ image }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Failed to add product image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id]/images?imageId=xxx - Delete specific image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { sellerId } = await requireAuth()
    const { id: productId } = await params
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { error: 'imageId query parameter required' },
        { status: 400 }
      )
    }

    // Verify product belongs to seller
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        shop: { sellerId },
      },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Delete image
    const deletedImage = await prisma.productImage.delete({
      where: {
        id: imageId,
        productId, // Ensure image belongs to this product
      },
    })

    return NextResponse.json({ success: true, deletedImage }, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.error('Failed to delete product image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
