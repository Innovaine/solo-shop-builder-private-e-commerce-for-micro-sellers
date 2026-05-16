import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: ReactNode
  footer?: ReactNode
  className?: string
}

export function EmptyState({
  icon = '🛍️',
  title,
  description,
  action,
  footer,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'bg-cream rounded-lg border-2 border-dashed border-whisper p-12 text-center',
        className
      )}
    >
      <div className="text-6xl mb-6">{icon}</div>
      <h2 className="text-2xl font-semibold text-charcoal mb-3">{title}</h2>
      <p className="text-slate max-w-md mx-auto">{description}</p>
      
      {action && <div className="mt-6">{action}</div>}
      
      {footer && (
        <div className="mt-8 pt-8 border-t border-whisper">
          {footer}
        </div>
      )}
    </div>
  )
}

export default EmptyState
