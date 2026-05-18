'use client'

// Seller order dashboard - view and manage orders
// FR-17: Order dashboard with status updates

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Header from '@/components/ui/Header'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'

interface OrderItem {
  id: string
  productTitle: string
  price: number
  quantity: number
}

interface Order {
  id: string
  customerEmail: string
  customerName: string | null
  status: string
  total: number
  trackingId: string | null
  trackingUrl: string | null
  createdAt: string
  items: OrderItem[]
  shop: {
    name: string
    slug: string
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({})
  const [refunding, setRefunding] = useState<{ [key: string]: boolean }>({})
  const [statusFilter, setStatusFilter] = useState<string>('all') // FR-156: status filter

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      // FR-158: Sort by newest first (smart default)
      const sortedOrders = data.orders.sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setOrders(sortedOrders)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }))
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order')
      }

      const data = await response.json()
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? data.order : order))
      )
      setEditingOrder(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  const updateTracking = async (orderId: string, trackingId: string, trackingUrl: string) => {
    setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }))
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trackingId, trackingUrl }),
      })

      if (!response.ok) {
        throw new Error('Failed to update tracking info')
      }

      const data = await response.json()
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? data.order : order))
      )
      setEditingOrder(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  const refundOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to refund this order? This action cannot be undone.')) {
      return
    }

    setRefunding((prev) => ({ ...prev, [orderId]: true }))
    try {
      const response = await fetch(`/api/orders/${orderId}/refund`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to process refund')
      }

      const data = await response.json()
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? data.order : order))
      )
      alert('Refund processed successfully. Customer will be notified via email.')
    } catch (err: any) {
      alert(`Refund failed: ${err.message}`)
    } finally {
      setRefunding((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald text-white'
      case 'in_progress':
        return 'bg-amber text-white'
      case 'shipped':
        return 'bg-slate-blue text-white'
      case 'delivered':
        return 'bg-emerald text-white'
      case 'refunded':
        return 'bg-slate text-white'
      case 'canceled':
        return 'bg-rose text-white'
      default:
        return 'bg-slate text-white'
    }
  }

  // FR-156: Filter orders by status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter)

  // FR-156: Count orders by status
  const statusCounts = {
    all: orders.length,
    paid: orders.filter(o => o.status === 'paid').length,
    in_progress: orders.filter(o => o.status === 'in_progress').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    refunded: orders.filter(o => o.status === 'refunded').length,
    canceled: orders.filter(o => o.status === 'canceled').length,
  }

  // FR-158: Calculate summary metrics for filtered orders
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0)
  const totalItems = filteredOrders.reduce((sum, order) => sum + order.items.length, 0)

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

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-4 bg-rose-50 border-rose">
            <p className="text-rose">{error}</p>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-charcoal">Orders</h1>
          
          {orders.length > 0 && (
            <a
              href="/api/orders/export"
              download
              className="inline-flex items-center px-4 py-2 bg-slate-blue text-white rounded-lg hover:bg-slate-blue/90 transition-colors text-sm font-semibold"
            >
              Export CSV
            </a>
          )}
        </div>

        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Orders will appear here when customers complete checkout."
          />
        ) : (
          <>
            {/* FR-156: Status filter tabs with counts */}
            <Card className="mb-6">
              <div className="flex flex-wrap gap-2 p-4">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'in_progress', label: 'In Progress' },
                  { value: 'shipped', label: 'Shipped' },
                  { value: 'delivered', label: 'Delivered' },
                  { value: 'refunded', label: 'Refunded' },
                  { value: 'canceled', label: 'Canceled' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setStatusFilter(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      statusFilter === value
                        ? 'bg-slate-blue text-white'
                        : 'bg-whisper text-slate hover:bg-whisper/80'
                    }`}
                  >
                    {label} ({statusCounts[value as keyof typeof statusCounts]})
                  </button>
                ))}
              </div>
            </Card>

            {filteredOrders.length === 0 ? (
              <EmptyState
                title={`No ${statusFilter === 'all' ? '' : statusFilter.replace('_', ' ')} orders`}
                description={`No orders with status "${statusFilter.replace('_', ' ')}" found.`}
              />
            ) : (
              <>
                {/* FR-158: Summary metrics row */}
                <Card className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    <div>
                      <div className="text-sm font-semibold text-slate mb-1">
                        SHOWING ORDERS
                      </div>
                      <div className="text-2xl font-bold text-charcoal">
                        {filteredOrders.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate mb-1">
                        TOTAL ITEMS
                      </div>
                      <div className="text-2xl font-bold text-slate-blue">
                        {totalItems}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate mb-1">
                        TOTAL REVENUE
                      </div>
                      <div className="text-2xl font-bold text-emerald">
                        ${(totalRevenue / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card>
                  <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-whisper">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Tracking</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-whisper">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-whisper/50">
                      <td className="px-4 py-4">
                        <span className="text-sm font-mono text-slate">{order.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="text-sm font-medium text-charcoal">
                            {order.customerName || 'Unknown'}
                          </p>
                          <p className="text-xs text-slate">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-charcoal">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-emerald">
                          ${(order.total / 100).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        {editingOrder === order.id ? (
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            disabled={updatingStatus[order.id]}
                            className="text-xs px-2 py-1 rounded border border-whisper"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="in_progress">In Progress</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="canceled">Canceled</option>
                          </select>
                        ) : (
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {order.trackingId ? (
                          <div>
                            <p className="text-xs font-mono text-charcoal">{order.trackingId}</p>
                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-slate-blue hover:underline"
                              >
                                Track
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-xs text-slate">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => setEditingOrder(order.id === editingOrder ? null : order.id)}
                            disabled={updatingStatus[order.id] || refunding[order.id]}
                          >
                            {editingOrder === order.id ? 'Cancel' : 'Edit'}
                          </Button>
                          {order.status !== 'refunded' && order.status !== 'canceled' && (
                            <Button
                              variant="ghost"
                              onClick={() => refundOrder(order.id)}
                              disabled={refunding[order.id] || updatingStatus[order.id]}
                              className="text-rose hover:bg-rose/10"
                            >
                              {refunding[order.id] ? 'Refunding...' : 'Refund'}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                  </div>
                </Card>
            )}
          </>
        )}
      </main>
    </div>
  )
}
