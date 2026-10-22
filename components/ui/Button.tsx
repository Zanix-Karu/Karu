'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { buttonClass, type ButtonSize, type ButtonVariant } from './button-styles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner and blocks clicks, keeping the label in place. */
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${buttonClass(variant, size)} ${className}`.trim()}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="karu-btn-spinner inline-block h-[1em] w-[1em] shrink-0 rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  )
)

Button.displayName = 'Button'

export default Button
export { Button }
