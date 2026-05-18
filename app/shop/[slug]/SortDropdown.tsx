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
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-slate font-medium">
        Sort by:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="px-3 py-2 border border-whisper rounded-lg text-sm bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald cursor-pointer"
      >
        <option value="newest">Newest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name">Name: A to Z</option>
      </select>
    </div>
  )
}
