import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
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
      fontFamily: {
        serif: ['var(--font-cormorant)', 'ui-serif', 'Georgia', 'serif'],
        serif2: ['var(--font-cormorant)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', '-apple-system', 'sans-serif'],
        ui: ['var(--font-outfit)', '-apple-system', 'sans-serif'],
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
  plugins: [require('@tailwindcss/typography')],
}

export default config
