// Product validation utilities for FR-8 & FR-9
// Shared between API routes and UI form validation

import { z } from 'zod'

// Valid product categories (from product spec F6)
export const PRODUCT_CATEGORIES = [
  'Handmade',
  'Vintage',
  'Supplies',
  'Other',
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]

// Product validation schema for create/update
export const productSchema = z.object({
  title: z
    .string()
    .min(1, 'Product title is required')
    .max(100, 'Product title must be at most 100 characters'),
  description: z
    .string()
    .max(5000, 'Description must be at most 5000 characters')
    .optional()
    .nullable(),
  price: z
    .number()
    .min(1, 'Price must be at least $0.01')
    .max(999999, 'Price must be less than $10,000')
    .int('Price must be a whole number (in cents)'),
  imageUrl: z
    .union([
      z.string().url('Invalid image URL').max(500, 'Image URL too long'),
      z.literal(''),
      z.null(),
    ])
    .optional()
    .nullable(),
  category: z
    .enum(PRODUCT_CATEGORIES, {
      errorMap: () => ({ message: 'Invalid category' }),
    })
    .optional()
    .nullable(),
  stock: z
    .number()
    .min(0, 'Stock cannot be negative')
    .int('Stock must be a whole number')
    .default(0),
})

// Type inference from schema
export type ProductInput = z.infer<typeof productSchema>

// Format price in cents to dollars string (e.g., 4500 -> "$45.00")
export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`
}

// Parse dollar string to cents (e.g., "45.00" -> 4500)
export function parsePriceToCents(dollarString: string): number {
  const cleaned = dollarString.replace(/[^0-9.]/g, '')
  const dollars = parseFloat(cleaned)
  if (isNaN(dollars)) {
    throw new Error('Invalid price format')
  }
  return Math.round(dollars * 100)
}
