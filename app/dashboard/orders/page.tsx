'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/ui/Header'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Order {
  id: string
  createdAt: string
  customerEmail: string
  status: 'pending' | 'paid' | 'in_progress' | 'shipped' | 'delivered'
  total: number
  items: { title: string; quantity: number }[]
  trackingId?: string
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
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [orderCounts, setOrderCounts] = useState<OrderCount>({ paid: 0, in_progress: 0, shipped: 0, delivered: 0 })
  const [error, setError] = useState('')

  // Fetch orders and analytics on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [ordersRes, analyticsRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/analytics'),
        ])

        if (!ordersRes.ok || !analyticsRes.ok) {
          setError('Failed to load data')
          return
        }

        const ordersData = await ordersRes.json()
        const analyticsData = await analyticsRes.json()

        // Sort orders by date (most recent first)
        const sortedOrders = (ordersData || []).sort((a: Order, b: Order) => {
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

  const applyFilter = (orderList: Order[], filter: typeof selectedFilter) => {
    if (filter === 'all') {
      setFilteredOrders(orderList)
    } else {
      const filtered = orderList.filter(order => order.status === filter)
      setFilteredOrders(filtered)
    }
  }

  const handleFilterChange = (filter: typeof selectedFilter) => {
    setSelectedFilter(filter)
    applyFilter(orders, filter)
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
    return colors[status] || 'bg-gray-100 text-gray-800'
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
          <p className="text-gray-600">Loading orders...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-charcoal">Orders</h1>
          <Button onClick={() => window.location.href = '/dashboard/orders?export=csv'}>
            📥 Export as CSV
          </Button>
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
                <div className="text-sm font-semibold text-gray-600 uppercase">Total Products</div>
                <div className="text-3xl font-bold text-charcoal mt-2">{analytics.totalProducts}</div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="text-sm font-semibold text-gray-600 uppercase">Total Revenue</div>
                <div className="text-3xl font-bold text-charcoal mt-2">${analytics.totalRevenue.toFixed(2)}</div>
              </div>
            </Card>
            <Card>
              <div className="p-6">
                <div className="text-sm font-semibold text-gray-600 uppercase">Total Orders</div>
                <div className="text-3xl font-bold text-charcoal mt-2">{orders.length}</div>
              </div>
            </Card>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>{orders.length}</strong> total orders · <strong>{orderCounts.paid}</strong> paid · <strong>{orderCounts.in_progress}</strong> in progress · <strong>{orderCounts.shipped}</strong> shipped · <strong>{orderCounts.delivered}</strong> delivered
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'all'
                ? 'bg-emerald text-white'
                : 'bg-white text-charcoal border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('paid')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'paid'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-charcoal border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Paid ({orderCounts.paid})
          </button>
          <button
            onClick={() => handleFilterChange('in_progress')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'in_progress'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-charcoal border border-gray-300 hover:bg-gray-50'
            }`}
          >
            In Progress ({orderCounts.in_progress})
          </button>
          <button
            onClick={() => handleFilterChange('shipped')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'shipped'
                ? 'bg-green-500 text-white'
                : 'bg-white text-charcoal border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Shipped ({orderCounts.shipped})
          </button>
          <button
            onClick={() => handleFilterChange('delivered')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              selectedFilter === 'delivered'
                ? 'bg-emerald text-white'
                : 'bg-white text-charcoal border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Delivered ({orderCounts.delivered})
          </button>
        </div>

        {/* Orders Table */}
        <Card>
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">No orders yet</h3>
              <p className="text-gray-600">Share your shop link and wait for customers to place their first orders.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-charcoal">{order.id.substring(0, 8)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.customerEmail}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {order.items.map(item => `${item.title} (${item.quantity})`).join(', ')}
                      </td>
                      <td className="px-6 py-4 font-semibold text-charcoal">${order.total.toFixed(2)}</td>
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
