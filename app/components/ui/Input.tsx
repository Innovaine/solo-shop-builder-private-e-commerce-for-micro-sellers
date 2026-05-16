import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, fullWidth, className, ...props }, ref) => {
    const baseStyles = 'rounded-md border px-4 py-2 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1'
    
    const stateStyles = error
      ? 'border-rose text-charcoal focus:border-rose focus:ring-rose'
      : 'border-whisper text-charcoal focus:border-emerald focus:ring-emerald hover:border-slate'
    
    const widthStyles = fullWidth ? 'w-full' : ''

    return (
      <input
        ref={ref}
        className={clsx(
          baseStyles,
          stateStyles,
          widthStyles,
          'disabled:bg-cream disabled:text-slate disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
