'use client'

// FR-10: Product list UI and management page
// Seller sees all products in table, can create/edit/delete

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/product'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

interface Product {
  id: string
  title: string
  description: string | null
  price: number
  imageUrl: string | null
  category: string | null
  stock: number
  status?: string // FR-153: PUBLISHED or DRAFT
  createdAt: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shopId, setShopId] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())

  const handleStatusToggle = async (productId: string, currentStatus: string) => {
    setStatusUpdating(productId)
    const newStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    
    try {
      const response = await fetch(`/api/products/${productId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update status')
      }
      
      setProducts(products.map(p => p.id === productId ? { ...p, status: newStatus } : p))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setStatusUpdating(null)
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        // First, fetch seller's shop to get shopId
        const shopResponse = await fetch('/api/shops')
        if (!shopResponse.ok) {
          throw new Error('Failed to fetch shop')
        }
        const shops = await shopResponse.json()
        if (shops.length === 0) {
          setError('You must create a shop first')
          setLoading(false)
          return
        }

        const shop = shops[0]
        setShopId(shop.id)

        // Then fetch products for this shop
        const productsResponse = await fetch(`/api/products?shopId=${shop.id}`)
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products')
        }

        const productsData = await productsResponse.json()
        setProducts(productsData)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    setDeleteLoading(productId)
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete product')
      }

      // Remove from UI
      setProducts(products.filter((p) => p.id !== productId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product')
    } finally {
      setDeleteLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-slate">Loading products...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
          <div className="text-rose-600 mb-4">{error}</div>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-slate-blue text-white px-6 py-2 rounded-md hover:bg-slate-blue/90 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto p-6">
        <Card padding="lg" variant="elevated">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-charcoal mb-2">Products</h1>
              <p className="text-slate">Manage your shop inventory</p>
            </div>
            <div className="flex gap-3">
              {products.length > 0 && (
                <a
                  href="/api/products/export"
                  download
                  className="inline-flex items-center px-4 py-2 bg-slate-blue text-white rounded-lg hover:bg-slate-blue/90 transition-colors text-sm font-semibold"
                >
                  Export CSV
                </a>
              )}
              <Button
                onClick={() => router.push('/dashboard/products/new')}
                variant="primary"
                size="lg"
              >
                + Add Product
              </Button>
            </div>
          </div>

          {products.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No products yet"
              description="Add your first product to get started"
              action={
                <Button
                  onClick={() => router.push('/dashboard/products/new')}
                  variant="primary"
                >
                  Add Product
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-whisper">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">
                      Product
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">
                      Stock
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-charcoal">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-charcoal">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-whisper hover:bg-cream">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-whisper rounded flex items-center justify-center text-xl">
                            {product.imageUrl ? '🖼️' : '📦'}
                          </div>
                          <div>
                            <div className="font-medium text-charcoal">{product.title}</div>
                            {product.description && (
                              <div className="text-xs text-slate line-clamp-1">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate">
                        {product.category || '—'}
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-charcoal">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-4 px-4 text-sm text-slate">{product.stock}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleStatusToggle(product.id, product.status || 'PUBLISHED')}
                          disabled={statusUpdating === product.id}
                          className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            (product.status || 'PUBLISHED') === 'PUBLISHED'
                              ? 'bg-sage-50 text-sage-700 hover:bg-sage-100'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          } disabled:opacity-50 transition-colors`}
                        >
                          {statusUpdating === product.id ? '...' : product.status || 'PUBLISHED'}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                            className="text-slate-blue hover:text-slate-blue/80 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleteLoading === product.id}
                            className="text-rose-600 hover:text-rose-700 text-sm font-medium disabled:opacity-50"
                          >
                            {deleteLoading === product.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
