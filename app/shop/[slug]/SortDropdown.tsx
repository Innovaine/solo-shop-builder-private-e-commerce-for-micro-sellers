'use client'

// Client-side sort dropdown for shop page
// Task #196: Add price/name sorting to seller shop

import { useRouter, useSearchParams } from 'next/navigation'

interface SortDropdownProps {
  shopSlug: string
}

export default function SortDropdown({ shopSlug }: SortDropdownProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'
  const currentCategory = searchParams.get('category')

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams()
    
    // Preserve category filter
    if (currentCategory) {
      params.set('category', currentCategory)
    }
    
    // Add sort parameter (unless it's the default 'newest')
    if (value !== 'newest') {
      params.set('sort', value)
    }
    
    const queryString = params.toString()
    router.push(`/shop/${shopSlug}${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <select
      id="sort"
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-charcoal hover:border-charcoal focus:outline-none focus:ring-2 focus:ring-emerald cursor-pointer transition-colors"
    >
      <option value="newest">Sort by: Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="name">Most Popular</option>
    </select>
  )
}
