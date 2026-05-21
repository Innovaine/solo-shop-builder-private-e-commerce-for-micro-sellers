'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/ui/Header'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Order as PrismaOrder, OrderItem } from '@prisma/client'
import { formatPrice, type Currency } from '@/lib/currency'

// Extended Order type that includes the items relation
// Note: API returns JSON-serialized data, so dates are strings
type Order = Omit<PrismaOrder, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
  items: Array<{ productTitle: string; quantity: number }>
}

interface Analytics {
  totalProducts: number
  totalRevenue: number
  totalOrders: number
}

interface OrderCount {
  paid: number
  in_progress: number
  shipped: number
  delivered: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'paid' | 'in_progress' | 'shipped' | 'delivered'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [orderCounts, setOrderCounts] = useState<OrderCount>({ paid: 0, in_progress: 0, shipped: 0, delivered: 0 })
  const [error, setError] = useState('')
  const [shopCurrency, setShopCurrency] = useState<Currency>('USD')

  const goBack = () => {
    window.location.href = '/dashboard'
  }

  // Fetch orders and analytics on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [ordersRes, analyticsRes, shopsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/analytics'),
          fetch('/api/shops'),
        ])

        if (!ordersRes.ok || !analyticsRes.ok || !shopsRes.ok) {
          setError('Failed to load data')
          return
        }

        const ordersData = await ordersRes.json()
        const analyticsResponse = await analyticsRes.json()
        const shopsData = await shopsRes.json()
        
        // Extract analytics object from response (API returns { analytics: {...} })
        const analyticsData = analyticsResponse.analytics || analyticsResponse

        // Extract orders array from response (API returns { orders: [...] })
        const ordersArray = ordersData.orders || []
        
        // Extract shop currency from shops response
        if (Array.isArray(shopsData) && shopsData.length > 0 && shopsData[0].currency) {
          setShopCurrency(shopsData[0].currency as Currency)
        }
        
        // Sort orders by date (most recent first)
        const sortedOrders = ordersArray.sort((a: Order, b: Order) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

        setOrders(sortedOrders)
        setAnalytics(analyticsData)

        // Calculate status counts
        const counts = { paid: 0, in_progress: 0, shipped: 0, delivered: 0 }
        sortedOrders.forEach((order: Order) => {
          if (order.status === 'paid') counts.paid++
          else if (order.status === 'in_progress') counts.in_progress++
          else if (order.status === 'shipped') counts.shipped++
          else if (order.status === 'delivered') counts.delivered++
        })
        setOrderCounts(counts)

        // Apply filter
        applyFilter(sortedOrders, 'all')
      } catch (err) {
        setError('Error loading orders')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const applyFilter = (orderList: Order[], filter: typeof selectedFilter, fromDate?: string, toDate?: string) => {
    let filtered = orderList

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(order => order.status === filter)
    }

    // Apply date range filter
    if (fromDate) {
      const fromTime = new Date(fromDate).getTime()
      filtered = filtered.filter(order => new Date(order.createdAt).getTime() >= fromTime)
    }

    if (toDate) {
      const toTime = new Date(toDate).setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter(order => new Date(order.createdAt).getTime() <= toTime)
    }

    setFilteredOrders(filtered)
  }

  const handleFilterChange = (filter: typeof selectedFilter) => {
    setSelectedFilter(filter)
    applyFilter(orders, filter, dateFrom, dateTo)
  }

  const handleDateChange = (from: string, to: string) => {
    setDateFrom(from)
    setDateTo(to)
    applyFilter(orders, selectedFilter, from, to)
  }

  const clearFilters = () => {
    setSelectedFilter('all')
    setDateFrom('')
    setDateTo('')
    applyFilter(orders, 'all', '', '')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusBadgeColor = (status: Order['status']) => {
    const colors: Record<Order['status'], string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      shipped: 'bg-green-100 text-green-800',
      delivered: 'bg-emerald-100 text-emerald-800',
    }
    return colors[status] || 'bg-whisper text-charcoal'
  }

  const statusLabel: Record<Order['status'], string> = {
    pending: 'Pending',
    paid: 'Paid',
    in_progress: 'In Progress',
    shipped: 'Shipped',
    delivered: 'Delivered',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-slate">Loading orders...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="mb-4 text-sm text-slate hover:text-charcoal transition-colors flex items-center gap-1"
          >
            ← Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-charcoal">Orders</h1>
            <Button onClick={() => window.location.href = '/api/orders/export'}>
              📥 Export as CSV
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">
            {error}
          </div>
        )}

        {/* Dashboard Metrics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <div className="p-6">
                <div className="text-sm font-semibold text-slate uppercase">Total Products</div>
                <div className="text-3xl font-bold text-charcoal mt-2">{analytics.totalProducts}</div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="text-sm font-semibold text-slate uppercase">Total Revenue</div>
                <div className="text-3xl font-bold text-charcoal mt-2">{formatPrice(analytics.totalRevenue || 0, shopCurrency)}</div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="text-sm font-semibold text-slate uppercase">Total Orders</div>
                <div className="text-3xl font-bold text-charcoal mt-2">{orders.length}</div>
              </div>
            </Card>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-whisper">
          <p className="text-sm text-slate">
            <strong>{orders.length}</strong> total orders · <strong>{orderCounts.paid}</strong> paid · <strong>{orderCounts.in_progress}</strong> in progress · <strong>{orderCounts.shipped}</strong> shipped · <strong>{orderCounts.delivered}</strong> delivered
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg border border-whisper p-6 mb-6">
          {/* Date Range Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-charcoal mb-3">Filter by Date Range</label>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-slate mb-1">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => handleDateChange(e.target.value, dateTo)}
                  className="w-full px-3 py-2 border border-whisper rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald text-sm"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-slate mb-1">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => handleDateChange(dateFrom, e.target.value)}
                  className="w-full px-3 py-2 border border-whisper rounded-lg focus:ring-2 focus:ring-emerald focus:border-emerald text-sm"
                />
              </div>
              {(dateFrom || dateTo || selectedFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-whisper/50 text-charcoal rounded-lg hover:bg-whisper transition-colors text-sm font-semibold"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-3">Filter by Status</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                  selectedFilter === 'all'
                    ? 'bg-slate-blue text-white'
                    : 'bg-whisper/50 text-charcoal hover:bg-whisper'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => handleFilterChange('paid')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                  selectedFilter === 'paid'
                    ? 'bg-slate-blue text-white'
                    : 'bg-whisper/50 text-charcoal hover:bg-whisper'
                }`}
              >
                Paid ({orderCounts.paid})
              </button>
              <button
                onClick={() => handleFilterChange('in_progress')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                  selectedFilter === 'in_progress'
                    ? 'bg-slate-blue text-white'
                    : 'bg-whisper/50 text-charcoal hover:bg-whisper'
                }`}
              >
                In Progress ({orderCounts.in_progress})
              </button>
              <button
                onClick={() => handleFilterChange('shipped')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                  selectedFilter === 'shipped'
                    ? 'bg-emerald text-white'
                    : 'bg-whisper/50 text-charcoal hover:bg-whisper'
                }`}
              >
                Shipped ({orderCounts.shipped})
              </button>
              <button
                onClick={() => handleFilterChange('delivered')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                  selectedFilter === 'delivered'
                    ? 'bg-emerald text-white'
                    : 'bg-whisper/50 text-charcoal hover:bg-whisper'
                }`}
              >
                Delivered ({orderCounts.delivered})
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(selectedFilter !== 'all' || dateFrom || dateTo) && (
            <div className="mt-4 pt-4 border-t border-whisper">
              <p className="text-sm text-slate">
                Showing <strong className="text-charcoal">{filteredOrders.length}</strong> of <strong className="text-charcoal">{orders.length}</strong> orders
                {selectedFilter !== 'all' && <> with status <strong className="text-charcoal">{statusLabel[selectedFilter]}</strong></>}
                {dateFrom && <> from <strong className="text-charcoal">{formatDate(dateFrom)}</strong></>}
                {dateTo && <> to <strong className="text-charcoal">{formatDate(dateTo)}</strong></>}
              </p>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <Card>
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">No orders yet</h3>
              <p className="text-slate">Share your shop link and wait for customers to place their first orders.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-whisper/50 border-b border-whisper">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-charcoal uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-whisper hover:bg-whisper/20">
                      <td className="px-6 py-4 font-semibold text-charcoal">{order.id.substring(0, 8)}</td>
                      <td className="px-6 py-4 text-sm text-slate">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-slate">{order.customerEmail}</td>
                      <td className="px-6 py-4 text-sm text-slate">
                        {order.items.map(item => `${item.productTitle} (${item.quantity})`).join(', ')}
                      </td>
                      <td className="px-6 py-4 font-semibold text-charcoal">{formatPrice(order.total, shopCurrency)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(order.status)}`}>
                          {statusLabel[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`/dashboard/orders/${order.id}`} className="text-emerald hover:underline font-semibold text-sm">
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
