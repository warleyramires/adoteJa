import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="font-body text-sm font-semibold text-on-surface-variant ml-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('input-base', error && 'ring-2 ring-error/40', className)}
          {...props}
        />
        {error && (
          <p className="font-body text-xs text-error ml-1">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
