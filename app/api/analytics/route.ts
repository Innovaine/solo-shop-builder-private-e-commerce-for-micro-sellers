// FR-29 & FR-30: Basic seller analytics
// GET /api/analytics
// Returns: total revenue (last 30 days), order count, top products

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

// Aligns with Prisma Product model (id, title fields)
interface ProductAnalytics {
  id: string
  title: string
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

    // FR-157: Count total products in shop
    const productCount = await prisma.product.count({
      where: {
        shopId: shop.id,
      },
    })

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
            id: item.productId,
            title: item.productTitle,
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

    // FR-36: Calculate daily revenue for chart (last 30 days)
    const dailyRevenueMap = new Map<string, number>()
    
    // Initialize all 30 days with zero revenue
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i)) // Start from 30 days ago
      const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD format
      dailyRevenueMap.set(dateKey, 0)
    }
    
    // Aggregate revenue by day
    for (const order of recentOrders) {
      const dateKey = order.createdAt.toISOString().split('T')[0]
      const currentRevenue = dailyRevenueMap.get(dateKey) || 0
      dailyRevenueMap.set(dateKey, currentRevenue + order.total)
    }
    
    // Convert to array sorted by date
    const dailyRevenue = Array.from(dailyRevenueMap.entries())
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({
      analytics: {
        totalRevenue, // in cents
        orderCount,
        productCount, // FR-157: total products count
        topProducts,
        dailyRevenue, // FR-36: Daily revenue data for chart
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
