// FR-5: Public shop storefront - displays shop products in grid
// Updated Day 15: Show products, not just empty state

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function ShopPage({
  params,
}: {
  params: { slug: string }
}) {
  const shop = await prisma.shop.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!shop) {
    notFound()
  }

  const hasProducts = shop.products.length > 0

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-whisper sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">{shop.name}</h1>
            <p className="text-slate text-sm mt-0.5">Independent storefront</p>
          </div>
          <button className="px-4 py-2 border border-whisper rounded-md text-sm font-semibold text-charcoal hover:bg-cream transition-colors">
            🛒 Cart (0)
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-slate text-white py-16 px-6 text-center">
        <h2 className="text-4xl font-bold mb-2">Welcome to {shop.name}</h2>
        <p className="text-lg opacity-90">
          {hasProducts
            ? 'Browse our collection and add items to your cart'
            : 'Shop coming soon'}
        </p>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {hasProducts ? (
          <>
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
    </div>
  )
}
