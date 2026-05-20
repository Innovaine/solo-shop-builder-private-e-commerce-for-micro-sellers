'use client'

// Client component for order detail page
// Handles status updates, refunds, and UI interactions

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Order, OrderItem } from '@prisma/client'

type OrderWithItems = Order & {
  items: OrderItem[]
}

interface OrderDetailClientProps {
  order: OrderWithItems
  shopId: string
}

export default function OrderDetailClient({ order, shopId }: OrderDetailClientProps) {
  const router = useRouter()
  const [status, setStatus] = useState(order.status)
  const [trackingId, setTrackingId] = useState(order.trackingId || '')
  const [updating, setUpdating] = useState(false)
  const [refunding, setRefunding] = useState(false)

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleStatusUpdate = async () => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update order')
      }

      alert('Order updated successfully')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update order')
    } finally {
      setUpdating(false)
    }
  }

  const handleRefund = async () => {
    if (!confirm('Are you sure you want to refund this order? This cannot be undone.')) {
      return
    }

    setRefunding(true)
    try {
      const response = await fetch(`/api/orders/${order.id}/refund`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to process refund')
      }

      alert('Refund issued successfully')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to process refund')
    } finally {
      setRefunding(false)
    }
  }

  const statusOptions = [
    'pending',
    'paid',
    'in_progress',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700',
    paid: 'bg-emerald-50 text-emerald-700',
    in_progress: 'bg-blue-50 text-blue-700',
    shipped: 'bg-indigo-50 text-indigo-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-gray-50 text-gray-700',
    refunded: 'bg-rose-50 text-rose-700',
  }

  return (
    <>
      {/* Back button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/orders')}
          className="inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Orders
        </Button>
      </div>

      <Card padding="lg" variant="elevated">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-charcoal mb-2">
              Order #{order.id.substring(0, 8)}
            </h1>
            <p className="text-slate">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${statusColors[status] || 'bg-gray-50 text-gray-700'}`}>
            {status.toUpperCase()}
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6 pb-6 border-b border-whisper">
          <h2 className="text-lg font-semibold text-charcoal mb-3">Customer Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-slate mb-1">Name</div>
              <div className="text-charcoal font-medium">{order.customerName || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-slate mb-1">Email</div>
              <div className="text-charcoal font-medium">{order.customerEmail}</div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6 pb-6 border-b border-whisper">
          <h2 className="text-lg font-semibold text-charcoal mb-3">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-whisper rounded flex items-center justify-center text-xl">
                    📦
                  </div>
                  <div>
                    <div className="font-medium text-charcoal">{item.productTitle}</div>
                    <div className="text-sm text-slate">Quantity: {item.quantity}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-charcoal">{formatPrice(item.price)}</div>
                  <div className="text-sm text-slate">each</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-whisper flex justify-between items-center">
            <span className="text-lg font-semibold text-charcoal">Total</span>
            <span className="text-2xl font-bold text-charcoal">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Status Update Section */}
        <div className="mb-6 pb-6 border-b border-whisper">
          <h2 className="text-lg font-semibold text-charcoal mb-3">Update Order</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Order Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-whisper rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue"
                disabled={status === 'refunded'}
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Tracking ID (optional)
              </label>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full px-4 py-2 border border-whisper rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue"
                placeholder="Enter tracking number"
                disabled={status === 'refunded'}
              />
            </div>
            <Button
              onClick={handleStatusUpdate}
              disabled={updating || status === 'refunded'}
              variant="primary"
              className="w-full"
            >
              {updating ? 'Updating...' : 'Update Order'}
            </Button>
          </div>
        </div>

        {/* Refund Section */}
        {status !== 'refunded' && status !== 'pending' && (
          <div>
            <h2 className="text-lg font-semibold text-charcoal mb-3">Refund</h2>
            <p className="text-sm text-slate mb-4">
              Issue a full refund for this order. The customer will be notified and the funds will be returned to their payment method.
            </p>
            <Button
              onClick={handleRefund}
              disabled={refunding}
              variant="secondary"
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              {refunding ? 'Processing...' : 'Issue Refund'}
            </Button>
          </div>
        )}

        {/* Payment Info */}
        {order.stripePaymentId && (
          <div className="mt-6 pt-6 border-t border-whisper">
            <h2 className="text-lg font-semibold text-charcoal mb-3">Payment Information</h2>
            <div className="text-sm text-slate">
              <div className="mb-1">
                <span className="font-medium">Payment ID:</span> {order.stripePaymentId}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {formatDate(order.updatedAt)}
              </div>
            </div>
          </div>
        )}
      </Card>
    </>
  )
}
