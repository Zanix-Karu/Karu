import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    // Radius scale copied from the app (karu-app/apps/web/src/ds/tokens.css).
    // The app collapses every Tailwind step onto three sizes plus round, so
    // the same class gives the same corner on both sites:
    //   6px   inputs, chips
    //   10px  buttons, cards
    //   14px  sheets, modals
    //   999px avatars, status dots, badges, never cards or CTAs
    borderRadius: {
      none: '0',
      DEFAULT: 'var(--radius-sm)',
      sm: 'var(--radius-sm)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      xl: 'var(--radius-lg)',
      '2xl': 'var(--radius-lg)',
      '3xl': 'var(--radius-lg)',
      full: 'var(--radius-pill)',
    },
    extend: {
      // Brand values mirror the app's design tokens
      // (~/Developer/karu-app/apps/web/src/ds/tokens.css) so a visitor crossing
      // from the marketing site to the product doesn't have to re-orient.
      // Names stay marketing-side; only the values converge.
      colors: {
        espresso: '#1c1006',      // app --brown-900
        'brown-dark': '#35200a',  // app --brown-800
        'brown-mid': '#442d1e',   // app --brown-700
        'brown-warm': '#53310f',  // app --brown-600
        surface: '#231508',
        'card-bg': '#2E1C0D',
        'card-border': 'rgba(255, 195, 90, 0.10)',
        amber: '#fbd301',         // app --yellow (--brand)
        'amber-light': '#f6dc53', // app --yellow-soft
        gold: '#edb337',          // app --gold-400
        'gold-deep': '#a2730c',   // app --gold-600
        cream: '#f4efe7',         // app --cream-200
        white: '#ffffff',         // app --white
      },
      // Same three families as the app: Cormorant for display, Outfit for
      // body copy, Inter for controls (buttons, inputs, labels).
      fontFamily: {
        serif: ['var(--font-cormorant)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', '-apple-system', 'sans-serif'],
        ui: ['var(--font-inter)', '-apple-system', 'sans-serif'],
      },
      // App shadow scale. `card` is the app's resting card shadow, deepened
      // for a dark background where 10% black would be invisible.
      boxShadow: {
        sm: 'var(--shadow-sm)',
        card: 'var(--shadow-card)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      // App motion system (karu-app/apps/web/src/ds/motion.css).
      transitionDuration: {
        fast: 'var(--motion-fast)',
        base: 'var(--motion-base)',
        slow: 'var(--motion-slow)',
      },
      transitionTimingFunction: {
        out: 'var(--ease-out)',
        spring: 'var(--ease-spring)',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      animation: {
        ticker: 'ticker 22s linear infinite',
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        shimmer: 'shimmer 1.8s linear infinite',
      },
    },
  },
  plugins: [typography],
}

export default config
