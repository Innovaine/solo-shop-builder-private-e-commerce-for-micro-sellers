// Shops directory page - browse all active shops
// Task #305: For buyers (clients) - list all shops with search

import { Suspense } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

async function ShopsList({ searchQuery }: { searchQuery: string }) {
  const shops = await prisma.shop.findMany({
    where: {
      status: 'ACTIVE',
      ...(searchQuery && {
        OR: [
          { name: { contains: searchQuery, mode: 'insensitive' } },
          { displayName: { contains: searchQuery, mode: 'insensitive' } },
          { publicDescription: { contains: searchQuery, mode: 'insensitive' } },
        ],
      }),
    },
    select: {
      id: true,
      slug: true,
      name: true,
      displayName: true,
      publicDescription: true,
      logoImageUrl: true,
      primaryColor: true,
      _count: {
        select: {
          products: {
            where: {
              status: 'PUBLISHED',
              stock: { gt: 0 },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  if (shops.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-charcoal mb-2">No shops found</h3>
        <p className="text-slate">
          {searchQuery
            ? `No shops match "${searchQuery}". Try a different search.`
            : 'No active shops yet. Check back soon!'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shops.map((shop) => (
        <Link key={shop.id} href={`/shop/${shop.slug}`}>
          <Card
            variant="interactive"
            padding="md"
            className="h-full hover:shadow-lg transition-shadow duration-200"
          >
            {/* Shop Logo / Header */}
            <div
              className="h-32 rounded-t-lg flex items-center justify-center mb-4"
              style={{
                backgroundColor: shop.primaryColor || '#3B4C63',
              }}
            >
              {shop.logoImageUrl ? (
                <img
                  src={shop.logoImageUrl}
                  alt={shop.name}
                  className="h-20 w-20 object-contain rounded-full bg-white p-2"
                />
              ) : (
                <div className="text-5xl">🏪</div>
              )}
            </div>

            {/* Shop Info */}
            <div className="px-2">
              <h3 className="text-xl font-bold text-charcoal mb-2 line-clamp-1">
                {shop.displayName || shop.name}
              </h3>
              {shop.publicDescription && (
                <p className="text-sm text-slate mb-4 line-clamp-2">
                  {shop.publicDescription}
                </p>
              )}

              {/* Product Count */}
              <div className="flex items-center gap-2 text-sm text-slate">
                <span>📦</span>
                <span>
                  {shop._count.products}{' '}
                  {shop._count.products === 1 ? 'product' : 'products'} available
                </span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default async function ShopsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[]>>
}) {
  const params = await searchParams
  const searchQuery = (params.search as string) || ''
  const session = await getSession()

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-whisper sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-charcoal">
            Solo Shop Builder
          </Link>
          <div className="flex items-center gap-4">
            {session.isLoggedIn ? (
              <Link href="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="primary" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-charcoal mb-3">
            Browse Shops
          </h1>
          <p className="text-lg text-slate max-w-2xl mx-auto">
            Discover unique products from independent sellers
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <form method="GET" action="/shop" className="relative">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search shops by name or description..."
              className="w-full px-6 py-4 border-2 border-whisper rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-blue focus:border-transparent text-charcoal placeholder-slate"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-blue text-white px-6 py-2 rounded-md hover:bg-slate-blue/90 transition-colors font-semibold"
            >
              Search
            </button>
          </form>
          {searchQuery && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-slate">
                Searching for: <strong>{searchQuery}</strong>
              </span>
              <Link href="/shop">
                <Button variant="ghost" size="sm">
                  Clear
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Shops Grid */}
        <Suspense
          fallback={
            <div className="text-center py-16">
              <div className="text-slate">Loading shops...</div>
            </div>
          }
        >
          <ShopsList searchQuery={searchQuery} />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-whisper py-8 px-6 text-center text-sm text-slate mt-16">
        <p>© 2026 Solo Shop Builder. Empowering independent sellers.</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/auth/login" className="hover:text-charcoal transition-colors">
            Become a Seller
          </Link>
          <Link href="/" className="hover:text-charcoal transition-colors">
            About
          </Link>
        </div>
      </footer>
    </div>
  )
}
