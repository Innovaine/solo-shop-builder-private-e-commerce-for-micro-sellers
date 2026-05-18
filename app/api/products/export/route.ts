// GET /api/products/export — Export products as CSV (FR-25)
// Seller downloads all products for backup or migration

import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    // Auth check using iron-session
    const { sellerId } = await requireAuth()

    // Find seller's shop
    const shop = await prisma.shop.findFirst({
      where: { sellerId },
    })

    if (!shop) {
      return NextResponse.json({ error: 'No shop found' }, { status: 404 })
    }

    // Get all products for this shop
    const products = await prisma.product.findMany({
      where: { shopId: shop.id },
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Build CSV
    const headers = [
      'Product ID',
      'Title',
      'Description',
      'Price (cents)',
      'Price ($)',
      'Category',
      'Stock',
      'Image URL',
      'Variants',
      'Created',
      'Updated',
    ]

    const rows = products.map((product) => {
      const variantsStr = product.variants
        .map((v) => `${v.name}:${v.value}`)
        .join('; ')

      return [
        product.id,
        `"${product.title.replace(/"/g, '""')}"`, // Escape quotes
        `"${(product.description || '').replace(/"/g, '""')}"`,
        product.price.toString(),
        (product.price / 100).toFixed(2),
        product.category || '',
        product.stock?.toString() || '',
        product.imageUrl || '',
        variantsStr ? `"${variantsStr}"` : '',
        new Date(product.createdAt).toISOString(),
        new Date(product.updatedAt).toISOString(),
      ].join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')

    // Return as downloadable CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="products-${shop.slug}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error: any) {
    console.error('Product export error:', error)
    return NextResponse.json(
      { error: 'Failed to export products' },
      { status: 500 }
    )
  }
}
