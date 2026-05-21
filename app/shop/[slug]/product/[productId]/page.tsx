// Product detail page - customer can view product details
// Day 15: Customer-facing product page
// Day 17: Integrated UI components (Button)

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>
}) {
  const { slug, productId } = await params
  
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      shop: true,
      images: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  })

  // Verify product exists, belongs to the correct shop, and is published
  if (!product || product.shop.slug !== slug || product.status !== 'PUBLISHED') {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
