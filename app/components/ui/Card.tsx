import { HTMLAttributes, ReactNode } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Card({ 
  variant = 'default', 
  padding = 'md', 
  className, 
  children, 
  ...props 
}: CardProps) {
  const baseStyles = 'bg-white rounded-lg'
  
  const variantStyles = {
    default: 'border border-whisper',
    elevated: 'shadow-md',
    interactive: 'border border-whisper hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer',
  }
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
