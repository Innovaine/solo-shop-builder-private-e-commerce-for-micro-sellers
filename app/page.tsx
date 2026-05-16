// Landing page with sign-up link
// Day 17: Integrated UI components (Button)

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-blue to-[#2C3A4F]">
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Solo Shop Builder
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto">
            Your own storefront. No marketplace fees. Just you and your customers.
          </p>
          <Link href="/auth/login">
            <Button variant="primary" size="lg" className="text-lg px-8">
              Start selling today
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur rounded-lg p-8 text-white">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold mb-3">Your branded shop</h3>
            <p className="text-white/90">
              Get a unique URL for your storefront. No templates. No marketplace branding.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-8 text-white">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-3">Accept payments</h3>
            <p className="text-white/90">
              Stripe integration. Customers pay directly. You keep everything minus processing fees.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-8 text-white">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-3">Manage orders</h3>
            <p className="text-white/90">
              Track every order. Update shipping status. Message customers. All in one dashboard.
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-white/90 mb-4">
            Built for Etsy resellers, local craftspeople, and micro-sellers who want to own their storefront.
          </p>
          <Link href="/auth/login" className="text-white font-semibold hover:underline">
            Create your shop →
          </Link>
        </div>
      </div>
    </div>
  )
}
