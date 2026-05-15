// Prisma Client singleton for Next.js with connection pooling
// Prevents multiple instances in dev hot-reload
// Optimized for serverless + concurrent request handling

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown - disconnect on process exit in production
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
  process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
  process.on('SIGTERM', async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}
