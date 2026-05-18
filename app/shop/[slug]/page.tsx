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

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { category?: string }
}) {
  const shop = await prisma.shop.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        where: searchParams.category 
          ? { category: searchParams.category }
          : {},
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!shop) {
    notFound()
  }

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

  // FR-33: Apply custom branding colors
  const primaryColor = shop.primaryColor || '#3B4C63';
  const accentColor = shop.accentColor || '#10B981';

  return (
    <div className="min-h-screen bg-white">
      {/* Header with custom branding */}
      <header
        className="border-b border-whisper sticky top-0 z-10"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          {(shop.logoImageUrl || shop.logoUrl) && (
            <img
              src={shop.logoImageUrl || shop.logoUrl || ''}
              alt={`${shop.name} logo`}
              className="h-10 w-10 object-contain rounded"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{shop.name}</h1>
            <p className="text-white/80 text-sm mt-0.5">Independent storefront</p>
          </div>
        </div>
      </header>

      {/* Hero with custom colors */}
      <section
        className="text-white py-16 px-6 text-center"
        style={{
          background: `linear-gradient(to bottom right, ${primaryColor}, ${accentColor})`
        }}
      >
        {/* FR-31: Display name (falls back to shop.name if not set) */}
        <h2 className="text-4xl font-bold mb-2">Welcome to {shop.displayName || shop.name}</h2>
        
        {/* FR-26: Tagline display */}
        {shop.tagline ? (
          <p className="text-lg opacity-90 italic">
            {shop.tagline}
          </p>
        ) : (
          <p className="text-lg opacity-90">
            {hasProducts
              ? 'Browse our collection and add items to your cart'
              : 'Shop coming soon'}
          </p>
        )}
        
        {/* FR-31: Public description (falls back to description if not set) */}
        {(shop.publicDescription || shop.description) && (
          <p className="text-base opacity-80 mt-4 max-w-2xl mx-auto">
            {shop.publicDescription || shop.description}
          </p>
        )}
        
        {/* FR-31: Social links */}
        {(shop.instagramUrl || shop.facebookUrl || shop.twitterUrl) && (
          <div className="flex justify-center gap-4 mt-6">
            {shop.instagramUrl && (
              <a
                href={shop.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            )}
            {shop.facebookUrl && (
              <a
                href={shop.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            )}
            {shop.twitterUrl && (
              <a
                href={shop.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-80 transition-opacity"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* FR-7: Category Filter */}
        {categories.length > 0 && (
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            shopSlug={shop.slug}
          />
        )}

        {hasProducts ? (
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
                  href={`/shop/${shop.slug}/product/${product.id}`}
                  className="group"
                >
                  <div className="bg-white border border-whisper rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    {/* Product Image Placeholder */}
                    <div className="aspect-square bg-gradient-to-br from-whisper to-cream flex items-center justify-center text-6xl">
                      💎
                    </div>
                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-charcoal mb-2 line-clamp-2 group-hover:text-slate transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-lg font-bold text-charcoal">
                        ${(product.price / 100).toFixed(2)}
                      </p>
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

      {/* Floating cart button */}
      <CartButton shopSlug={shop.slug} />
    </div>
  )
}
