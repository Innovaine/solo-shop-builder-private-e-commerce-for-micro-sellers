// Seller dashboard - shows shop info and management links
// Requires authentication

export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Header } from '@/components/ui/Header'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import AnalyticsCards from '@/components/AnalyticsCards'

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
      <Header
        leftContent={
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Solo Shop</h1>
            <p className="text-sm text-slate">{session.email}</p>
          </div>
        }
        rightContent={
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-sm text-slate-blue hover:text-slate-blue-600 font-semibold"
            >
              Logout
            </button>
          </form>
        }
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-charcoal mb-2">Dashboard</h2>
          <p className="text-slate">Manage your shop and products</p>
        </div>

        {/* Analytics */}
        <AnalyticsCards />

        {/* Shop info card */}
        <Card padding="lg" className="mb-6">
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
            >
              <Button variant="primary">
                View Storefront
              </Button>
            </Link>
            <Link href="/dashboard/products">
              <Button variant="secondary">
                Manage Products
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quick actions grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Link href="/dashboard/products" className="block">
            <Card padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📦</div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-1">Products</h3>
                  <p className="text-sm text-slate">Manage your shop inventory</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/orders" className="block">
            <Card padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📋</div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-1">Orders</h3>
                  <p className="text-sm text-slate">View and manage orders</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/analytics" className="block">
            <Card padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📊</div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-1">Analytics</h3>
                  <p className="text-sm text-slate">Sales and performance metrics</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/branding" className="block">
            <Card padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎨</div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-1">Branding</h3>
                  <p className="text-sm text-slate">Customize shop colors and logo</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/profile" className="block">
            <Card padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">👤</div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-1">Profile</h3>
                  <p className="text-sm text-slate">Seller bio and contact info</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/billing" className="block">
            <Card padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💳</div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-1">Billing</h3>
                  <p className="text-sm text-slate">Payment methods and invoices</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/email-template" className="block">
            <Card padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">✉️</div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-1">Email Templates</h3>
                  <p className="text-sm text-slate">Customize order confirmation emails</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/settings" className="block">
            <Card padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">⚙️</div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-1">Settings</h3>
                  <p className="text-sm text-slate">Account and shop settings</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/products/import" className="block">
            <Card padding="lg" className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="text-4xl">📥</div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal mb-1">CSV Import</h3>
                  <p className="text-sm text-slate">Bulk import products</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
