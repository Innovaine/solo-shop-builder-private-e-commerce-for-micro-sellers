/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Skip static generation for pages that need runtime DB access
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
