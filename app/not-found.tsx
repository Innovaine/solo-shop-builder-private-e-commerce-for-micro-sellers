// FR-18: Custom 404 page
// Next.js automatically uses this for any route that doesn't exist

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6">
      <Card padding="lg" variant="elevated" className="max-w-md w-full text-center">
        <div className="text-8xl mb-8">404</div>
        <h1 className="text-4xl font-bold text-charcoal mb-4">Page Not Found</h1>
        <p className="text-slate mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary">Dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
