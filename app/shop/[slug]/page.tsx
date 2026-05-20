// FR-5: Public shop storefront - displays shop products in grid
// Updated Day 15: Show products, not just empty state
// Day 17: Integrated UI components (Button)
// Day 42: FR-7: Category filter

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CartButton } from '@/components/CartButton'
import CategoryFilter from './CategoryFilter'
import SortDropdown from './SortDropdown'

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { category?: string; sort?: string }
}) {
  const shop = await prisma.shop.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        where: searchParams.category 
          ? { category: searchParams.category }
          : {},
        orderBy: searchParams.sort === 'price-low'
          ? { price: 'asc' }
          : searchParams.sort === 'price-high'
          ? { price: 'desc' }
          : searchParams.sort === 'name'
          ? { title: 'asc' }
          : { createdAt: 'desc' }, // Default: newest first
      },
    },
  })

  if (!shop) {
    notFound()
  }

  // Check if shop is inactive
  const isShopActive = shop.status === 'ACTIVE'

  // Get unique categories for filter
  const allProducts = await prisma.product.findMany({
    where: { shopId: shop.id },
    select: { category: true },
  })
  
  const categories = Array.from(
    new Set(allProducts.map(p => p.category).filter(Boolean))
  ) as string[]

  const hasProducts = shop.products.length > 0
  const selectedCategory = searchParams.category || null
  const selectedSort = searchParams.sort || 'newest'

  // FR-33: Apply custom branding colors
  const primaryColor = shop.primaryColor || '#3B4C63';
  const accentColor = shop.accentColor || '#10B981';

  return (
    <div className="min-h-screen bg-white">
      {/* Section 1: Brand + Cart */}
      <header className="bg-white border-b border-whisper sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(shop.logoImageUrl || shop.logoUrl) && (
              <img
                src={shop.logoImageUrl || shop.logoUrl || ''}
                alt={`${shop.name} logo`}
                className="h-10 w-10 object-contain rounded"
              />
            )}
            <h1 className="text-2xl font-bold text-charcoal">{shop.name}</h1>
          </div>
          {isShopActive && <CartButton shopSlug={shop.slug} />}
        </div>
      </header>

      {/* Section 2: Hero */}
      <section
        className="text-white py-12 px-6 text-center"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`
        }}
      >
        <h2 className="text-3xl font-bold mb-2">Welcome to {shop.displayName || shop.name}</h2>
        {shop.tagline ? (
          <p className="text-base opacity-90">
            {shop.tagline}
          </p>
        ) : (
          <p className="text-base opacity-90">
            {hasProducts
              ? 'Handcrafted pieces made with care'
              : 'Shop coming soon'}
          </p>
        )}
      </section>

      {/* Section 3: Search + Sort + Filter bar */}
      {hasProducts && isShopActive && (
        <div className="bg-whisper border-b border-gray-200 sticky top-16 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 min-w-0 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald"
            />
            <SortDropdown shopSlug={shop.slug} />
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Shop Inactive Warning */}
        {!isShopActive && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6 mb-8 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-2xl font-bold text-charcoal mb-2">
              This shop is currently inactive
            </h2>
            <p className="text-slate">
              The seller has temporarily paused this shop. Please check back later.
            </p>
          </div>
        )}

        {/* FR-7: Category Filter */}
        {categories.length > 0 && isShopActive && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate uppercase tracking-wide mb-4">Browse by Category</h3>
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              shopSlug={shop.slug}
            />
          </div>
        )}

        {hasProducts && isShopActive ? (
          <>
            {/* Results count */}
            <div className="mb-6">
              <p className="text-sm text-slate">
                Showing {shop.products.length} {shop.products.length === 1 ? 'product' : 'products'}
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shop.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${params.slug}/product/${product.id}`}
                  className="group"
                >
                  <div className="bg-white border border-whisper rounded-lg overflow-hidden hover:shadow-xl hover:border-charcoal transition-all duration-200 hover:-translate-y-1">
                    {/* Product Image */}
                    {product.imageUrl ? (
                      <div className="aspect-square overflow-hidden bg-cream relative">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-charcoal opacity-0 group-hover:opacity-5 transition-opacity duration-200"></div>
                      </div>
                    ) : (
                      <div className="aspect-square bg-gradient-to-br from-whisper to-cream flex items-center justify-center text-6xl opacity-60">
                        💎
                      </div>
                    )}
                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-charcoal mb-2 line-clamp-2 leading-tight">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-lg font-bold text-charcoal">
                          ${(product.price / 100).toFixed(2)}
                        </p>
                        {product.category && (
                          <span className="text-xs px-2 py-1 bg-whisper text-slate rounded font-medium">
                            {product.category}
                          </span>
                        )}
                      </div>
                      {/* Stock badge */}
                      {product.stock !== null && product.stock !== undefined && (
                        <div className="mt-2">
                          {product.stock > 0 ? (
                            <span className="text-xs px-2 py-1 bg-emerald/10 text-emerald rounded font-medium inline-block">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded font-medium inline-block">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          // Empty State
          <div className="bg-cream rounded-lg border-2 border-dashed border-whisper p-12 text-center">
            <div className="text-6xl mb-6">🛍️</div>
            <h2 className="text-2xl font-semibold text-charcoal mb-3">
              This shop is empty
            </h2>
            <p className="text-slate max-w-md mx-auto">
              The seller hasn&apos;t added any products yet. Check back soon!
            </p>
            <div className="mt-8 pt-8 border-t border-whisper">
              <p className="text-sm text-slate">
                Shop created{' '}
                {new Date(shop.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-whisper py-8 px-6 text-center text-xs text-slate">
        <p>© 2026 {shop.name}. Solo Shop Builder. | Secured by Stripe</p>
      </footer>
    </div>
  )
}

