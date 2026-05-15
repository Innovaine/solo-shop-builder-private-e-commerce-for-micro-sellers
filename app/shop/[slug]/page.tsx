// FR-5: Public shop storefront
// GET /shop/[slug] - displays shop name and empty state

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

export default async function ShopPage({
  params,
}: {
  params: { slug: string }
}) {
  const shop = await prisma.shop.findUnique({
    where: { slug: params.slug },
  })

  if (!shop) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-whisper">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-charcoal">{shop.name}</h1>
          <p className="text-slate mt-1">Independent storefront</p>
        </div>
      </header>

      {/* Empty State */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border border-whisper p-12 text-center">
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
      </main>
    </div>
  )
}
