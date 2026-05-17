import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Solo Shop Builder',
    default: 'Solo Shop Builder — Your own storefront. No marketplace fees.',
  },
  description: 'Elegant, honest tools for independent sellers who want to own their storefront without the marketplace middleman.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Solo Shop Builder',
    title: 'Solo Shop Builder — Your own storefront. No marketplace fees.',
    description: 'Elegant, honest tools for independent sellers who want to own their storefront without the marketplace middleman.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solo Shop Builder',
    description: 'Your own storefront. No marketplace fees.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-cream text-charcoal">{children}</body>
    </html>
  )
}
