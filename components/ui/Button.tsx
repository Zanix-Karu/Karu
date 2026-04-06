'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'nav'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => {
    const base =
      'relative overflow-hidden inline-flex items-center justify-center font-sans text-[0.85rem] font-semibold tracking-[0.07em] uppercase transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-espresso disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary:
        'bg-amber text-espresso px-10 py-[15px] hover:-translate-y-[3px] hover:shadow-[0_18px_55px_rgba(232,160,32,0.4)] active:scale-[0.98]',
      ghost:
        'bg-transparent text-cream border border-cream/20 px-10 py-[15px] font-medium hover:border-amber hover:text-amber hover:-translate-y-[3px] active:scale-[0.98]',
      nav: 'bg-amber text-espresso px-7 py-[11px] hover:-translate-y-[2px] hover:shadow-[0_12px_35px_rgba(232,160,32,0.35)] active:scale-[0.98]',
    }

    return (
      <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props}>
        {/* Shimmer overlay for primary/nav */}
        {(variant === 'primary' || variant === 'nav') && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
export { Button }
