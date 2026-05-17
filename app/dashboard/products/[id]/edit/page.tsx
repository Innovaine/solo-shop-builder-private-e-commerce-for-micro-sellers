'use client'

// FR-3: Product edit form
// Seller can edit existing product details

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const CATEGORIES = ['Handmade', 'Vintage', 'Supplies', 'Other']

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/products/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setUploadedImageUrl(data.url)
      setImageUrl(data.url)
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const priceInCents = Math.round(parseFloat(price) * 100)

      if (isNaN(priceInCents) || priceInCents <= 0) {
        throw new Error('Please enter a valid price')
      }

      // Use uploaded image URL if available, otherwise use existing/manual URL
      const finalImageUrl = uploadedImageUrl || imageUrl || null

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
          imageUrl: finalImageUrl,
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
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-charcoal mb-2">
                Product Title <span className="text-rose">*</span>
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Handmade Ceramic Mug"
                required
              />
              <p className="text-xs text-slate mt-1">A clear, descriptive name for your product</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-charcoal mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe materials, dimensions, care instructions..."
                rows={4}
                className="w-full px-4 py-2 border border-whisper rounded-md focus:outline-none focus:ring-2 focus:ring-slate-blue text-charcoal"
              />
              <p className="text-xs text-slate mt-1">Tell customers about your product</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-charcoal mb-2">
                  Price (USD) <span className="text-rose">*</span>
                </label>
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
                <p className="text-xs text-slate mt-1">Price in dollars</p>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-charcoal mb-2">
                  Category <span className="text-rose">*</span>
                </label>
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
                <p className="text-xs text-slate mt-1">Product type</p>
              </div>
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-semibold text-charcoal mb-2">
                Stock Quantity <span className="text-rose">*</span>
              </label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                required
              />
              <p className="text-xs text-slate mt-1">Number of items available</p>
            </div>

            <div>
              <label htmlFor="imageUpload" className="block text-sm font-semibold text-charcoal mb-2">
                Product Image
              </label>
              
              {/* Current image preview */}
              {(uploadedImageUrl || imageUrl) && (
                <div className="mb-3">
                  <img
                    src={uploadedImageUrl || imageUrl}
                    alt="Product"
                    className="w-32 h-32 object-cover rounded-md border border-whisper"
                  />
                </div>
              )}

              {/* Upload button */}
              <div className="mb-3">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageUpload}
                  disabled={uploading || saving}
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className={`inline-flex items-center px-4 py-2 bg-whisper text-charcoal rounded-md cursor-pointer hover:bg-slate/10 transition ${
                    uploading || saving ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {uploading ? 'Uploading...' : 'Upload New Image'}
                </label>
                <p className="text-xs text-slate mt-1">Max 5MB • JPEG, PNG, WebP, or GIF</p>
              </div>

              {/* Manual URL input (fallback) */}
              <div className="mt-4">
                <label htmlFor="imageUrl" className="block text-xs font-medium text-slate mb-2">
                  Or paste image URL
                </label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  disabled={uploading || saving}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="primary" disabled={saving} className="flex-1">
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
