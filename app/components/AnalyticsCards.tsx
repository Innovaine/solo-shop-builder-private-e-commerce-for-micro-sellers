'use client'

// FR-29 & FR-30: Analytics dashboard cards
// Shows revenue, orders, and top products

import { useState, useEffect } from 'react'
import { Card } from './ui/Card'
import { formatPrice, type Currency } from '@/lib/currency'

// ASSUMPTION: Interface aligns with Prisma Product model (id, title)
// and Order model aggregation (orderCount = count of Order records)
interface ProductAnalytics {
  id: string
  title: string
  totalQuantity: number
  totalRevenue: number
}

interface Analytics {
  totalRevenue: number
  orderCount: number
  productCount: number // FR-157: total products count
  topProducts: ProductAnalytics[]
  periodDays: number
}

export default function AnalyticsCards() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shopCurrency, setShopCurrency] = useState<Currency>('USD')

  useEffect(() => {
    fetchAnalytics()
    fetchShopCurrency()
  }, [])

  const fetchShopCurrency = async () => {
    try {
      const response = await fetch('/api/shops')
      if (response.ok) {
        const shops = await response.json()
        if (shops.length > 0 && shops[0].currency) {
          setShopCurrency(shops[0].currency as Currency)
        }
      }
    } catch (err) {
      console.error('Failed to fetch shop currency:', err)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card padding="lg">
          <p className="text-slate text-sm">Loading analytics...</p>
        </Card>
      </div>
    )
  }

  if (error || !analytics) {
    return null // Silently fail - analytics are nice-to-have
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Key metrics - FR-157: Added product count */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card padding="lg">
          <div className="text-sm font-semibold text-slate mb-2">
            TOTAL REVENUE (30 DAYS)
          </div>
          <div className="text-3xl font-bold text-emerald">
            {formatPrice(analytics.totalRevenue, shopCurrency)}
          </div>
        </Card>

        {/* Order Count */}
        <Card padding="lg">
          <div className="text-sm font-semibold text-slate mb-2">
            ORDERS (30 DAYS)
          </div>
          <div className="text-3xl font-bold text-slate-blue">
            {analytics.orderCount}
          </div>
        </Card>

        {/* Product Count */}
        <Card padding="lg">
          <div className="text-sm font-semibold text-slate mb-2">
            PRODUCTS
          </div>
          <div className="text-3xl font-bold text-amber">
            {analytics.productCount}
          </div>
        </Card>

        {/* Average Order Value */}
        <Card padding="lg">
          <div className="text-sm font-semibold text-slate mb-2">
            AVG ORDER VALUE
          </div>
          <div className="text-3xl font-bold text-charcoal">
            {analytics.orderCount > 0 
              ? formatPrice(Math.round(analytics.totalRevenue / analytics.orderCount), shopCurrency)
              : formatPrice(0, shopCurrency)}
          </div>
        </Card>
      </div>

      {/* Top Products */}
      {analytics.topProducts.length > 0 && (
        <Card padding="lg">
          <div className="text-lg font-semibold text-charcoal mb-4">
            Top Products (Last 30 Days)
          </div>
          <div className="space-y-3">
            {analytics.topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-3 border-b border-whisper last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald text-white flex items-center justify-center text-sm font-semibold">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-charcoal">
                      {product.title}
                    </div>
                    <div className="text-sm text-slate">
                      {product.totalQuantity} sold
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-emerald">
                    {formatPrice(product.totalRevenue, shopCurrency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
