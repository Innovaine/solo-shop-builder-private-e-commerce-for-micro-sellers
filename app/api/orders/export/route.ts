// FR-27 & FR-28: Order CSV export
// GET /api/orders/export
// Returns CSV file of all orders for the authenticated seller's shop

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const { sellerId } = await requireAuth()
    
    // Get seller's shop
    const shop = await prisma.shop.findFirst({
      where: { sellerId },
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Fetch all orders with items
    const orders = await prisma.order.findMany({
      where: { shopId: shop.id },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Build CSV content
    const csvRows: string[] = []
    
    // CSV header
    csvRows.push([
      'Order ID',
      'Customer Email',
      'Customer Name',
      'Status',
      'Total (cents)',
      'Total ($)',
      'Stripe Payment ID',
      'Tracking ID',
      'Tracking URL',
      'Items',
      'Created At',
      'Updated At',
    ].join(','))

    // CSV data rows
    for (const order of orders) {
      const itemsSummary = order.items
        .map(item => `${item.quantity}x ${item.productTitle} ($${(item.price / 100).toFixed(2)})`)
        .join('; ')

      const row = [
        escapeCSV(order.id),
        escapeCSV(order.customerEmail),
        escapeCSV(order.customerName || ''),
        escapeCSV(order.status),
        order.total.toString(),
        (order.total / 100).toFixed(2),
        escapeCSV(order.stripePaymentId || ''),
        escapeCSV(order.trackingId || ''),
        escapeCSV(order.trackingUrl || ''),
        escapeCSV(itemsSummary),
        order.createdAt.toISOString(),
        order.updatedAt.toISOString(),
      ].join(',')

      csvRows.push(row)
    }

    const csvContent = csvRows.join('\n')

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="orders-${shop.slug}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.error('Order CSV export error:', error)
    return NextResponse.json(
      { error: 'Failed to export orders' },
      { status: 500 }
    )
  }
}

/**
 * Escape CSV field value (handle commas, quotes, newlines)
 */
function escapeCSV(value: string): string {
  if (!value) return ''
  
  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  
  return value
}
