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
        return { emoji: '⏳', text: 'Payment Pending', color: 'text-slate' }
      case 'paid':
        return { emoji: '✅', text: 'Payment Confirmed', color: 'text-emerald' }
      case 'in_progress':
        return { emoji: '📦', text: 'Being Prepared', color: 'text-amber' }
      case 'shipped':
        return { emoji: '🚚', text: 'Shipped', color: 'text-slate-blue' }
      case 'delivered':
        return { emoji: '🎉', text: 'Delivered', color: 'text-emerald' }
      case 'canceled':
        return { emoji: '❌', text: 'Canceled', color: 'text-rose' }
      default:
        return { emoji: '📋', text: 'Processing', color: 'text-slate' }
    }
  }

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
        <Card padding="xl" variant="elevated" className="max-w-md w-full text-center">
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
      <div className="max-w-3xl mx-auto">
        <Card padding="xl" variant="elevated">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{statusDetails.emoji}</div>
            <h1 className={`text-4xl font-bold mb-2 ${statusDetails.color}`}>
              {statusDetails.text}
            </h1>
            <p className="text-slate">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          </div>

          <div className="border-t border-whisper pt-8 mb-8">
            <h2 className="text-2xl font-bold text-charcoal mb-6">Order Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate">Shop</span>
                <span className="font-semibold text-charcoal">{order.shop.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate">Order Date</span>
                <span className="font-semibold text-charcoal">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate">Customer</span>
                <span className="font-semibold text-charcoal">
                  {order.customerName || order.customerEmail}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate">Total</span>
                <span className="font-bold text-emerald text-xl">
                  ${(order.total / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-whisper pt-8 mb-8">
            <h2 className="text-2xl font-bold text-charcoal mb-6">Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-charcoal">{item.productTitle}</div>
                    <div className="text-sm text-slate">Quantity: {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-charcoal">
                    ${(item.price / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {order.trackingId && (
            <div className="border-t border-whisper pt-8">
              <h2 className="text-2xl font-bold text-charcoal mb-6">Tracking Information</h2>
              <div className="bg-whisper rounded-lg p-6">
                <div className="font-mono text-charcoal mb-2 text-lg">{order.trackingId}</div>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-slate-blue text-white px-6 py-3 rounded-md hover:bg-slate-blue/90 transition font-medium"
                  >
                    Track Package →
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-whisper pt-8 mt-8">
            <p className="text-center text-sm text-slate">
              Questions about your order?{' '}
              <a href={`mailto:${order.shop.name.toLowerCase().replace(/\s+/g, '')}@example.com`} className="text-slate-blue hover:underline">
                Contact the seller
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
