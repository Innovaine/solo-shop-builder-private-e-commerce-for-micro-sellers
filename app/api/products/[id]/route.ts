// FR-8: Product CRUD API - individual product operations
// GET /api/products/[id] - fetch single product (public)
// PUT /api/products/[id] - update product (seller only, must own shop)
// DELETE /api/products/[id] - delete product (seller only, must own shop)

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { productSchema } from '@/lib/product'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product. Please try again.' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check auth
    const { sellerId } = await requireAuth()
    const productId = params.id

    // Fetch product with shop
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        shop: true,
      },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Verify ownership
    if (existingProduct.shop.sellerId !== sellerId) {
      return NextResponse.json(
        { error: 'You do not have permission to edit this product.' },
        { status: 403 }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const productData = productSchema.parse(body)

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        title: productData.title,
        description: productData.description,
        price: productData.price,
        imageUrl: productData.imageUrl,
        category: productData.category,
        stock: productData.stock,
      },
    })

    return NextResponse.json(product, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'You must be logged in to update products.' },
        { status: 401 }
      )
    }

    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check auth
    const { sellerId } = await requireAuth()
    const productId = params.id

    // Fetch product with shop
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        shop: true,
      },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Verify ownership
    if (existingProduct.shop.sellerId !== sellerId) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this product.' },
        { status: 403 }
      )
    }

    // Delete product
    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'You must be logged in to delete products.' },
        { status: 401 }
      )
    }

    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product. Please try again.' },
      { status: 500 }
    )
  }
}
