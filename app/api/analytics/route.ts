// FR-29 & FR-30: Basic seller analytics
// GET /api/analytics
// Returns: total revenue (last 30 days), order count, top products

import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/src/lib/db'
import { requireAuth } from '@/src/lib/auth'

interface ProductAnalytics {
  productId: string
  productTitle: string
  totalQuantity: number
  totalRevenue: number
}

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

    // Date 30 days ago
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Fetch orders from last 30 days
    const recentOrders = await prisma.order.findMany({
      where: {
        shopId: shop.id,
        status: {
          in: ['paid', 'in_progress', 'shipped', 'delivered'], // Only count successful orders
        },
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      include: {
        items: true,
      },
    })

    // Calculate total revenue
    const totalRevenue = recentOrders.reduce((sum, order) => sum + order.total, 0)

    // Calculate order count
    const orderCount = recentOrders.length

    // Calculate top products by quantity sold
    const productStats = new Map<string, ProductAnalytics>()

    for (const order of recentOrders) {
      for (const item of order.items) {
        const existing = productStats.get(item.productId)
        
        if (existing) {
          existing.totalQuantity += item.quantity
          existing.totalRevenue += item.price * item.quantity
        } else {
          productStats.set(item.productId, {
            productId: item.productId,
            productTitle: item.productTitle,
            totalQuantity: item.quantity,
            totalRevenue: item.price * item.quantity,
          })
        }
      }
    }

    // Sort products by quantity sold (top 5)
    const topProducts = Array.from(productStats.values())
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5)

    return NextResponse.json({
      analytics: {
        totalRevenue, // in cents
        orderCount,
        topProducts,
        periodDays: 30,
      },
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
