'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

// Mirrors the app's Field + Input (karu-app/apps/web/src/ds/index.tsx):
// sentence-case Inter label above, 10px corners, Inter 16px text. Colours are
// the app's on-dark versions since this site stays dark.

/** Label style, shared with the hand-built <select> fields. */
export const fieldLabelClass = 'block font-ui font-semibold text-[14px] text-cream/70'

/** Input/select style, shared with the hand-built <select> fields. */
export function fieldClass(hasError = false) {
  return [
    'w-full rounded-md bg-card-bg px-4 py-[13px] font-ui font-medium text-[16px] text-cream placeholder:text-cream/30',
    'border outline-none transition-colors duration-base ease-out',
    hasError
      ? 'border-red-400/70 focus:border-red-400 focus:ring-2 focus:ring-red-400/30'
      : 'border-cream/15 focus:border-gold focus:ring-2 focus:ring-amber/40',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' ')
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={inputId} className={fieldLabelClass}>
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`${fieldClass(!!error)} ${className}`.trim()}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} role="alert" className="font-ui text-[0.8rem] text-red-400 mt-0.5">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
export { Input }
