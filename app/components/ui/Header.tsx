import { ReactNode } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'

interface HeaderProps {
  shopName?: string
  logoImageUrl?: string  // FR-6+: Uploaded logo
  showCart?: boolean
  cartCount?: number
  leftContent?: ReactNode
  rightContent?: ReactNode
  sticky?: boolean
  className?: string
}

export function Header({
  shopName,
  logoImageUrl,
  showCart = false,
  cartCount = 0,
  leftContent,
  rightContent,
  sticky = true,
  className,
}: HeaderProps) {
  return (
    <header
      className={clsx(
        'bg-white border-b border-whisper z-10',
        sticky && 'sticky top-0',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {leftContent || (
          shopName && (
            <div className="flex items-center gap-3">
              {logoImageUrl && (
                <img 
                  src={logoImageUrl} 
                  alt={`${shopName} logo`}
                  className="h-10 w-10 object-contain rounded"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-charcoal">{shopName}</h1>
                <p className="text-slate text-sm mt-0.5">Independent storefront</p>
              </div>
            </div>
          )
        )}

        {rightContent || (
          showCart && (
            <button className="px-4 py-2 border border-whisper rounded-md text-sm font-semibold text-charcoal hover:bg-cream transition-colors">
              🛒 Cart ({cartCount})
            </button>
          )
        )}
      </div>
    </header>
  )
}

export default Header
