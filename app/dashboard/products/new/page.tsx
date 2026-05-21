'use client'

// FR-9: Product creation UI
// Seller creates a new product with title, description, price, category, stock

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PRODUCT_CATEGORIES, parsePriceToCents } from '@/lib/product'
import { getCurrencySymbol, type Currency } from '@/lib/currency'
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
  const [uploading, setUploading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const [shopCurrency, setShopCurrency] = useState<Currency>('USD')

  // Fetch shop currency on mount
  useEffect(() => {
    async function fetchShopCurrency() {
      try {
        const response = await fetch('/api/shops')
        if (response.ok) {
          const shops = await response.json()
          if (shops.length > 0 && shops[0].currency) {
            setShopCurrency(shops[0].currency as Currency)
          }
        }
      } catch (err) {
        console.error('Failed to fetch shop currency:', err)
      }
    }
    fetchShopCurrency()
  }, [])

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

      // Use uploaded image URL if available, otherwise use manual URL
      const finalImageUrl = uploadedImageUrl || imageUrl || null

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: description || null,
          price: priceInCents,
          imageUrl: finalImageUrl,
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
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button - outside Card */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/products')}
            className="inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Button>
        </div>

        <Card padding="lg" variant="elevated">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Add Product</h1>
          <p className="text-slate">Create a new product for your shop</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-4 mb-6 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
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
          <div>
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
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-charcoal mb-2">
              Price ({shopCurrency}) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate">{getCurrencySymbol(shopCurrency)}</span>
              <input
                type="text"
                id="price"
                value={priceDisplay}
                onChange={(e) => setPriceDisplay(e.target.value)}
                placeholder={shopCurrency === 'KWD' ? '45.000' : '45.00'}
                required
                pattern={shopCurrency === 'KWD' ? '^\\d+\\.?\\d{0,3}$' : '^\\d+\\.?\\d{0,2}$'}
                title={shopCurrency === 'KWD' ? 'Enter a valid price with up to 3 decimal places (e.g., 45.000)' : 'Enter a valid price with up to 2 decimal places (e.g., 45.00)'}
                className="w-full pl-8 pr-4 py-3 text-base border border-whisper rounded-md focus:outline-none focus:border-slate-blue focus:ring-4 focus:ring-slate-blue/10 transition"
              />
            </div>
            <p className="text-xs text-slate mt-1">
              Enter price in {shopCurrency === 'KWD' ? 'dinars (e.g., 45.000)' : 'dollars (e.g., 45.00)'}
            </p>
          </div>

          {/* Category */}
          <div>
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

          {/* Image Upload */}
          <div>
            <label htmlFor="imageUpload" className="block text-sm font-medium text-charcoal mb-2">
              Product Image
            </label>
            
            {/* Upload button */}
            <div className="mb-3">
              <input
                type="file"
                id="imageUpload"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className={`inline-flex items-center px-4 py-2 bg-whisper text-charcoal rounded-md cursor-pointer hover:bg-slate/10 transition ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {uploading ? 'Uploading...' : 'Upload Image'}
              </label>
              <p className="text-xs text-slate mt-2">
                Max 5MB • JPEG, PNG, WebP, or GIF
              </p>
            </div>

            {/* Image preview */}
            {uploadedImageUrl && (
              <div className="mb-3">
                <img
                  src={uploadedImageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md border border-whisper"
                />
              </div>
            )}

            {/* Manual URL input (fallback) */}
            <div className="mt-4">
              <label htmlFor="imageUrl" className="block text-xs font-medium text-slate mb-2">
                Or paste image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                maxLength={500}
                disabled={uploading}
                className="w-full px-4 py-2 text-sm border border-whisper rounded-md focus:outline-none focus:border-slate-blue focus:ring-2 focus:ring-slate-blue/10 transition"
              />
            </div>
          </div>

          {/* Stock */}
          <div>
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

          <div className="flex gap-3 pt-2">
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
    </div>
  )
}
