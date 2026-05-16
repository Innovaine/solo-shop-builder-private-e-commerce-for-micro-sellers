'use client'

// FR-29 & FR-30: Analytics dashboard cards
// Shows revenue, orders, and top products

import { useState, useEffect } from 'react'
import { Card } from './ui/Card'

interface ProductAnalytics {
  productId: string
  productTitle: string
  totalQuantity: number
  totalRevenue: number
}

interface Analytics {
  totalRevenue: number
  orderCount: number
  topProducts: ProductAnalytics[]
  periodDays: number
}

export default function AnalyticsCards() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [])

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
      {/* Key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <Card padding="lg">
          <div className="text-sm font-semibold text-slate mb-2">
            TOTAL REVENUE (30 DAYS)
          </div>
          <div className="text-3xl font-bold text-emerald">
            ${(analytics.totalRevenue / 100).toFixed(2)}
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

        {/* Average Order Value */}
        <Card padding="lg">
          <div className="text-sm font-semibold text-slate mb-2">
            AVG ORDER VALUE
          </div>
          <div className="text-3xl font-bold text-charcoal">
            ${analytics.orderCount > 0 
              ? ((analytics.totalRevenue / 100) / analytics.orderCount).toFixed(2) 
              : '0.00'}
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
                key={product.productId}
                className="flex items-center justify-between py-3 border-b border-whisper last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-sage text-white flex items-center justify-center text-sm font-semibold">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-charcoal">
                      {product.productTitle}
                    </div>
                    <div className="text-sm text-slate">
                      {product.totalQuantity} sold
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-emerald">
                    ${(product.totalRevenue / 100).toFixed(2)}
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
