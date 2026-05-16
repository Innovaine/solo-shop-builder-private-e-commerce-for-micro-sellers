import { ReactNode, InputHTMLAttributes, forwardRef } from 'react'
import { Input } from './Input'
import { clsx } from 'clsx'

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helpText?: string
  required?: boolean
  fullWidth?: boolean
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helpText, required, fullWidth = true, id, className, ...props }, ref) => {
    const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`
    const errorId = `${fieldId}-error`
    const helpId = `${fieldId}-help`

    return (
      <div className={clsx('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
        <label
          htmlFor={fieldId}
          className="text-sm font-semibold text-charcoal"
        >
          {label}
          {required && <span className="text-rose ml-1">*</span>}
        </label>
        
        <Input
          ref={ref}
          id={fieldId}
          error={error}
          fullWidth={fullWidth}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={clsx(
            error && errorId,
            helpText && helpId
          )}
          {...props}
        />
        
        {helpText && !error && (
          <span id={helpId} className="text-xs text-slate">
            {helpText}
          </span>
        )}
        
        {error && (
          <span id={errorId} className="text-xs text-rose font-medium" role="alert">
            {error}
          </span>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
