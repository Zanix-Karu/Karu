'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor={inputId}
          className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase text-cream/60"
        >
          {label}
        </label>
        <div className="relative">
          {/* Amber left-border on focus — via CSS sibling trick */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-0 h-full w-[2px] bg-amber scale-y-0 origin-bottom transition-transform duration-200 peer-focus:scale-y-100"
          />
          <input
            ref={ref}
            id={inputId}
            className={[
              'peer w-full bg-[var(--color-card-bg)] text-cream placeholder:text-cream/30',
              'border border-[var(--color-card-border)] px-4 py-3.5 text-[0.95rem]',
              'outline-none transition-all duration-200',
              'focus:border-amber focus:shadow-[0_0_0_3px_rgba(232,160,32,0.15)]',
              error
                ? 'border-red-500/70 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
                : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-[0.75rem] text-red-400 mt-0.5"
          >
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
