'use client'

// FR-9: Product creation UI
// Seller creates a new product with title, description, price, category, stock

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PRODUCT_CATEGORIES, parsePriceToCents } from '@/lib/product'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'

export default function NewProductPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priceDisplay, setPriceDisplay] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState<string>('')
  const [stock, setStock] = useState('0')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Parse price to cents
      let priceInCents: number
      try {
        priceInCents = parsePriceToCents(priceDisplay)
      } catch (err) {
        setError('Invalid price format. Use format: 45.00')
        setLoading(false)
        return
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          price: priceInCents,
          imageUrl: imageUrl || null,
          category: category || null,
          stock: parseInt(stock),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create product')
        setLoading(false)
        return
      }

      // Redirect to products list
      router.push('/dashboard/products')
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <Card padding="lg" variant="elevated" className="max-w-2xl w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Add Product</h1>
          <p className="text-slate">Create a new product for your shop</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-4 mb-6 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-6">
            <FormField
              label="Product Title"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Gold Minimalist Necklace"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A delicate, handcrafted necklace..."
              maxLength={5000}
              rows={5}
              className="w-full px-4 py-3 text-base border border-whisper rounded-md focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10 transition"
            />
            <p className="text-xs text-slate mt-1">
              {description.length} / 5000 characters
            </p>
          </div>

          {/* Price */}
          <div className="mb-6">
            <label htmlFor="price" className="block text-sm font-medium text-charcoal mb-2">
              Price (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate">$</span>
              <input
                type="text"
                id="price"
                value={priceDisplay}
                onChange={(e) => setPriceDisplay(e.target.value)}
                placeholder="45.00"
                required
                pattern="^\d+\.?\d{0,2}$"
                className="w-full pl-8 pr-4 py-3 text-base border border-whisper rounded-md focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10 transition"
              />
            </div>
            <p className="text-xs text-slate mt-1">Enter price in dollars (e.g., 45.00)</p>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-charcoal mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 text-base border border-whisper rounded-md focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10 transition"
            >
              <option value="">— Select Category —</option>
              {PRODUCT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Image URL (temporary until we implement upload) */}
          <div className="mb-6">
            <label htmlFor="imageUrl" className="block text-sm font-medium text-charcoal mb-2">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              maxLength={500}
              className="w-full px-4 py-3 text-base border border-whisper rounded-md focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10 transition"
            />
            <p className="text-xs text-slate mt-1">
              Optional: paste an image URL (image upload coming soon)
            </p>
          </div>

          {/* Stock */}
          <div className="mb-8">
            <label htmlFor="stock" className="block text-sm font-medium text-charcoal mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              required
              className="w-full px-4 py-3 text-base border border-whisper rounded-md focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10 transition"
            />
            <p className="text-xs text-slate mt-1">How many units do you have available?</p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="secondary"
              size="lg"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              Create Product
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
