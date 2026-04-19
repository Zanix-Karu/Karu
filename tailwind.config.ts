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
        ink: '#0D0905',
        deep: '#120C06',
        mahogany: '#1A0E07',
        cognac: '#2E1808',
        leather: '#3D2008',
        amber: '#C8841A',
        'amber-light': '#E8A832',
        'amber-pale': '#F5C96A',
        cream: '#F0E8D8',
        'card-bg': '#1A0E07',
        'card-border': 'rgba(200,132,26,0.14)',
        surface: '#120C06',
        espresso: '#0D0905',
        'brown-dark': '#120C06',
        'brown-mid': '#1A0E07',
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        serif2: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        riseUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        carFloat: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
        blink: 'blink 2.5s ease-in-out infinite',
        'rise-1': 'riseUp 0.8s ease 0.3s forwards',
        'rise-2': 'riseUp 0.9s ease 0.5s forwards',
        'rise-3': 'riseUp 0.9s ease 0.68s forwards',
        'rise-4': 'riseUp 0.9s ease 0.84s forwards',
        'rise-5': 'riseUp 1s ease 1.1s forwards',
        carFloat: 'carFloat 6s ease-in-out infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
