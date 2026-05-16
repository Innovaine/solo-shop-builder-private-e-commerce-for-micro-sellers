'use client'

// Seller order dashboard - view and manage orders
// FR-17: Order dashboard with status updates

import { useState, useEffect } from 'react'
import Header from '@/app/components/ui/Header'
import Card from '@/app/components/ui/Card'
import Button from '@/app/components/ui/Button'
import EmptyState from '@/app/components/ui/EmptyState'

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
      setOrders(data.orders)
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
      case 'canceled':
        return 'bg-rose text-white'
      default:
        return 'bg-slate text-white'
    }
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
        </div>

        {orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Orders will appear here when customers complete checkout."
          />
        ) : (
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
                  {orders.map((order) => (
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
                        <Button
                          variant="ghost"
                          onClick={() => setEditingOrder(order.id === editingOrder ? null : order.id)}
                          disabled={updatingStatus[order.id]}
                        >
                          {editingOrder === order.id ? 'Cancel' : 'Edit'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
