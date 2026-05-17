'use client'

// FR-7: Category filter component for storefront
// Day 42: Tag-based category filtering

import { useRouter, useSearchParams } from 'next/navigation'

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string | null
  shopSlug: string
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  shopSlug,
}: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCategoryClick = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    
    router.push(`/shop/${shopSlug}?${params.toString()}`)
  }

  return (
    <div className="mb-8 bg-white border border-whisper rounded-lg p-6">
      <h3 className="text-xs font-semibold text-slate uppercase tracking-wider mb-4">
        Filter by Category
      </h3>
      <div className="flex flex-wrap gap-3">
        {/* All Products button */}
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            !selectedCategory
              ? 'bg-charcoal text-white font-semibold'
              : 'bg-white text-slate border border-whisper hover:border-charcoal hover:text-charcoal hover:bg-cream'
          }`}
        >
          All Products
        </button>

        {/* Category buttons */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-charcoal text-white font-semibold'
                : 'bg-white text-slate border border-whisper hover:border-charcoal hover:text-charcoal hover:bg-cream'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}
