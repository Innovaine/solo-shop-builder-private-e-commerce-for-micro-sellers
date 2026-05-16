'use client'

// FR-3: Product edit form
// Seller can edit existing product details

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'

const CATEGORIES = ['Handmade', 'Vintage', 'Supplies', 'Other']

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Other')
  const [stock, setStock] = useState('0')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error('Product not found')
        }

        const product = await response.json()
        setTitle(product.title)
        setDescription(product.description || '')
        setPrice((product.price / 100).toFixed(2))
        setCategory(product.category || 'Other')
        setStock(String(product.stock || 0))
        setImageUrl(product.imageUrl || '')
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const priceInCents = Math.round(parseFloat(price) * 100)

      if (isNaN(priceInCents) || priceInCents <= 0) {
        throw new Error('Please enter a valid price')
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          price: priceInCents,
          category,
          stock: parseInt(stock, 10),
          imageUrl: imageUrl || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update product')
      }

      router.push('/dashboard/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-slate">Loading product...</div>
      </div>
    )
  }

  if (error && !title) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-6">
        <Card padding="lg" variant="elevated" className="max-w-md w-full text-center">
          <div className="text-rose mb-4">{error}</div>
          <Button onClick={() => router.push('/dashboard/products')} variant="primary">
            Back to Products
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto p-6">
        <Card padding="lg" variant="elevated">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-charcoal mb-2">Edit Product</h1>
            <p className="text-slate">Update product details</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose/10 border border-rose rounded-md">
              <p className="text-rose text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Product Title"
              htmlFor="title"
              required
              error=""
              help="A clear, descriptive name for your product"
            >
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Handmade Ceramic Mug"
                required
              />
            </FormField>

            <FormField
              label="Description"
              htmlFor="description"
              required={false}
              error=""
              help="Tell customers about your product"
            >
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe materials, dimensions, care instructions..."
                rows={4}
                className="w-full px-4 py-2 border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue text-charcoal"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="Price (USD)"
                htmlFor="price"
                required
                error=""
                help="Price in dollars"
              >
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="19.99"
                  required
                />
              </FormField>

              <FormField label="Category" htmlFor="category" required error="" help="Product type">
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue text-charcoal"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField
              label="Stock Quantity"
              htmlFor="stock"
              required
              error=""
              help="Number of items available"
            >
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                required
              />
            </FormField>

            <FormField
              label="Image URL"
              htmlFor="imageUrl"
              required={false}
              error=""
              help="Optional: Link to product image"
            >
              <Input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </FormField>

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="primary" disabled={saving} fullWidth>
                {saving ? 'Saving...' : 'Update Product'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/dashboard/products')}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
