'use client'

// FR-14: Customer order tracking page
// Customer can view order status and tracking info via public link

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'

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

export default function TrackOrderPage() {
  const params = useParams()
  const orderId = params.orderId as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (!response.ok) {
          throw new Error('Order not found')
        }
        const data = await response.json()
        setOrder(data.order)
      } catch (err: any) {
        setError(err.message || 'Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'pending':
        return { emoji: '⏳', text: 'Payment Pending', color: 'text-slate', step: 0 }
      case 'paid':
        return { emoji: '✅', text: 'Payment Confirmed', color: 'text-emerald', step: 1 }
      case 'in_progress':
        return { emoji: '📦', text: 'In Progress', color: 'text-amber', step: 2 }
      case 'shipped':
        return { emoji: '🚚', text: 'Shipped', color: 'text-slate-blue', step: 3 }
      case 'delivered':
        return { emoji: '🏠', text: 'Delivered', color: 'text-emerald', step: 4 }
      case 'canceled':
        return { emoji: '❌', text: 'Canceled', color: 'text-rose', step: -1 }
      default:
        return { emoji: '📋', text: 'Processing', color: 'text-slate', step: 0 }
    }
  }

  const timelineSteps = [
    { label: 'Order Placed', icon: '✓', key: 'pending' },
    { label: 'Payment Confirmed', icon: '✓', key: 'paid' },
    { label: 'Order Confirmed', icon: '✓', key: 'confirmed' },
    { label: 'In Progress', icon: '📦', key: 'in_progress' },
    { label: 'Shipped', icon: '🚚', key: 'shipped' },
    { label: 'Delivered', icon: '🏠', key: 'delivered' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="text-slate">Loading order...</div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <Card padding="lg" variant="elevated" className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">😕</div>
          <h1 className="text-3xl font-bold text-charcoal mb-4">Order Not Found</h1>
          <p className="text-slate">{error || 'This order does not exist or has been deleted.'}</p>
        </Card>
      </div>
    )
  }

  const statusDetails = getStatusDetails(order.status)

  return (
    <div className="min-h-screen bg-cream py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 pt-6">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Track Your Order</h1>
          <p className="text-slate">Your order is on its way. Check the status below.</p>
        </div>

        <Card padding="lg" variant="elevated">
          {/* Order Meta */}
          <div className="border-b border-whisper pb-6 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1">
                  Order Number
                </label>
                <div className="text-base font-semibold text-charcoal">
                  #{order.id.slice(0, 8).toUpperCase()}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1">
                  Order Date
                </label>
                <div className="text-base font-semibold text-charcoal">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mb-8">
            {timelineSteps.map((step, index) => {
              const isCompleted = statusDetails.step >= index
              const isCurrent = statusDetails.step === index
              const isLast = index === timelineSteps.length - 1

              return (
                <div key={step.key} className="relative">
                  <div className="flex gap-4 mb-6">
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          isCurrent
                            ? 'bg-slate-blue text-white animate-pulse'
                            : isCompleted
                            ? 'bg-emerald text-white'
                            : 'bg-whisper text-slate'
                        }`}
                      >
                        {step.icon}
                      </div>
                      {!isLast && (
                        <div
                          className={`absolute left-1/2 top-10 w-0.5 h-6 -ml-px ${
                            isCompleted ? 'bg-emerald' : 'bg-whisper'
                          }`}
                        />
                      )}
                    </div>
                    <div className="pt-1">
                      <div
                        className={`text-sm font-semibold ${
                          isCurrent ? 'text-slate-blue' : 'text-charcoal'
                        }`}
                      >
                        {step.label}
                      </div>
                      <div className="text-xs text-slate">
                        {isCompleted && !isCurrent
                          ? 'Completed'
                          : isCurrent
                          ? 'Current Status'
                          : 'Coming soon'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Items Section */}
          <div className="bg-cream rounded-lg p-5 mb-7">
            <h3 className="text-xs font-semibold text-slate uppercase tracking-wider mb-4">
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-3 border-b border-whisper last:border-b-0 last:pb-0">
                  <div className="w-15 h-15 bg-gradient-to-br from-whisper to-cream flex items-center justify-center rounded text-3xl flex-shrink-0">
                    💎
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-charcoal">{item.productTitle}</div>
                    <div className="text-xs text-slate">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-semibold text-charcoal">
                    ${(item.price / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Section */}
          {order.trackingId && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5 mb-7">
              <h3 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
                Tracking Number
              </h3>
              <div className="text-base font-semibold text-emerald-900 font-mono break-all mb-3">
                {order.trackingId}
              </div>
              {order.trackingUrl && (
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  Track with carrier →
                </a>
              )}
            </div>
          )}

          {/* Total Section */}
          <div className="border-t border-whisper pt-5 mt-5">
            <div className="flex justify-between text-sm text-slate mb-2">
              <span>Subtotal</span>
              <span>${(order.total / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-charcoal">
              <span>Total</span>
              <span className="text-emerald text-xl">${(order.total / 100).toFixed(2)}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="border-t border-whisper pt-7 mt-7 text-center">
            <p className="text-sm text-slate mb-4">
              Have questions about your order? Contact the seller directly.
            </p>
            <a
              href={`/shop/${order.shop.slug}`}
              className="inline-block bg-emerald text-white px-8 py-3 rounded-md hover:bg-emerald-600 transition font-semibold text-sm"
            >
              Visit Shop
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
