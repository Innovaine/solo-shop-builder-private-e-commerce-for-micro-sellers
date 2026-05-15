// Seller dashboard - shows shop info and management links
// Requires authentication

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function DashboardPage() {
  // Check authentication
  const session = await getSession()
  
  if (!session.isLoggedIn || !session.sellerId) {
    redirect('/auth/login')
  }

  // Get seller's shop
  const shop = await prisma.shop.findFirst({
    where: { sellerId: session.sellerId },
  })

  // If no shop, redirect to create shop
  if (!shop) {
    redirect('/dashboard/create-shop')
  }

  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  const shopUrl = `${appUrl}/shop/${shop.slug}`

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-whisper">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Solo Shop</h1>
            <p className="text-sm text-slate">{session.email}</p>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-slate-blue hover:text-slate-blue-600 font-semibold"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-charcoal mb-2">Dashboard</h2>
          <p className="text-slate">Manage your shop and products</p>
        </div>

        {/* Shop info card */}
        <div className="bg-white rounded-lg border border-whisper p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-charcoal mb-1">{shop.name}</h3>
              <p className="text-sm text-slate">
                Created {new Date(shop.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            <span className="inline-block bg-emerald-50 text-emerald-700 px-3 py-1 rounded text-xs font-semibold">
              ACTIVE
            </span>
          </div>

          <div className="bg-cream border border-whisper rounded-md p-4 mb-6">
            <div className="text-xs font-semibold text-slate mb-1">YOUR SHOP URL</div>
            <a
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-blue hover:underline font-mono text-sm break-all"
            >
              {shopUrl}
            </a>
          </div>

          <div className="flex gap-3">
            <Link
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-slate-blue text-white font-semibold px-6 py-2 rounded-md hover:bg-slate-blue-600 transition text-sm"
            >
              View Storefront
            </Link>
            <button
              disabled
              className="inline-block bg-whisper text-slate font-semibold px-6 py-2 rounded-md cursor-not-allowed text-sm"
              title="Products feature coming soon"
            >
              Add Products (Coming Soon)
            </button>
          </div>
        </div>

        {/* Empty state for products */}
        <div className="bg-white rounded-lg border border-whisper p-12 text-center">
          <div className="text-6xl mb-6">📦</div>
          <h3 className="text-2xl font-semibold text-charcoal mb-3">
            No products yet
          </h3>
          <p className="text-slate max-w-md mx-auto mb-6">
            Product management is coming in the next update. You&apos;ll be able to add products with images, prices, and descriptions.
          </p>
          <div className="text-sm text-slate">
            For now, your shop is live at{' '}
            <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="text-slate-blue hover:underline">
              {shop.slug}
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
