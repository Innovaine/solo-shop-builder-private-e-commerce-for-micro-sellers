// Order detail page — FR-11 Order detail view with status updates and refund
// Seller views individual order details, can update status, issue refunds

import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import OrderDetailClient from './OrderDetailClient'

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  // Auth check — require seller to be logged in
  const session = await getSession()
  if (!session.isLoggedIn || !session.sellerId) {
    redirect('/auth/login')
  }

  // Find seller's shop
  const shop = await prisma.shop.findFirst({
    where: { sellerId: session.sellerId },
  })

  if (!shop) {
    redirect('/dashboard/create-shop')
  }

  // Fetch order with items (OrderItem doesn't have product relation - uses denormalized fields)
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
    },
  })

  // If order doesn't exist, show 404
  if (!order) {
    notFound()
  }

  // Cross-tenant check — verify order belongs to this seller's shop
  if (order.shopId !== shop.id) {
    notFound()
  }

  // Format data for client component
  const orderData = {
    id: order.id,
    customerEmail: order.customerEmail,
    customerName: order.customerName,
    status: order.status,
    total: order.total,
    stripePaymentId: order.stripePaymentId,
    trackingId: order.trackingId,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productTitle: item.productTitle,
      quantity: item.quantity,
      price: item.price,
      productId: item.productId,
    })),
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto p-6">
        <OrderDetailClient order={orderData} shopId={shop.id} />
      </div>
    </div>
  )
}
