// Prisma Client singleton pattern
// Prevents "Too many Prisma Clients" error in development with hot reloading
// CANONICAL: All routes must import { prisma } from '@/lib/db', never create new PrismaClient()

import { PrismaClient } from '@prisma/client'

// Extend NodeJS global type to include prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Singleton instance: reuse in development, fresh in production
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

// In development, store on global to survive hot reloads
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

// Graceful shutdown: close connection on process termination
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
