// Mirrors the app's design-system Button (karu-app/apps/web/src/ds/index.tsx):
// 10px corners, Inter semibold, sentence case, a slight darken on hover and a
// small press on click. Hover/active/focus live in globals.css (.karu-btn) so
// they work the same on <a> and <Link> CTAs. Kept out of Button.tsx so server
// components can use it too.

export type ButtonVariant = 'primary' | 'ghost'
export type ButtonSize = 'sm' | 'md'

const BASE =
  'karu-btn inline-flex items-center justify-center gap-2.5 rounded-md font-ui font-semibold ' +
  'disabled:opacity-45 disabled:cursor-not-allowed'

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[15px]',
  md: 'h-[52px] px-6 text-[18px]',
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-amber text-[#0b0b0b]',
  ghost: 'bg-white/[0.12] text-white border border-white/40',
}

/** Class string for anything that should look like a Karu button. */
export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md') {
  return `${BASE} ${SIZES[size]} ${VARIANTS[variant]}`
}
