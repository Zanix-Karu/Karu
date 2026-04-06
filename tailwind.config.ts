import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        espresso: '#1C1208',
        'brown-dark': '#2A1A0A',
        'brown-mid': '#3D2510',
        'brown-warm': '#5C3A1E',
        surface: '#231508',
        'card-bg': '#2E1C0D',
        'card-border': 'rgba(255, 195, 90, 0.10)',
        amber: '#E8A020',
        'amber-light': '#F5BF45',
        cream: '#F5EFE4',
        white: '#FEFCF8',
      },
      fontFamily: {
        serif: ['var(--font-dm-serif)', 'Georgia', 'serif'],
        serif2: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
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
