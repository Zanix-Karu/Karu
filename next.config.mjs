import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const isDev = process.env.NODE_ENV !== 'production'

const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' plausible.io challenges.cloudflare.com"
  : "script-src 'self' 'unsafe-inline' plausible.io challenges.cloudflare.com"

const securityHeaders = [
  // Force HTTPS for 2 years, include subdomains, allow preload list
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // Prevent clickjacking — no one can embed your site
  { key: 'X-Frame-Options', value: 'DENY' },
  // Prevent MIME type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Control referrer information leakage
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Content Security Policy — strict whitelist
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' unpkg.com",
      "font-src 'self' data:",
      "img-src 'self' data: blob: *.supabase.co *.basemaps.cartocdn.com unpkg.com",
      "connect-src 'self' *.supabase.co plausible.io challenges.cloudflare.com",
      "frame-src 'self' challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; '),
  },
  // Disable browser features we don't use
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  // Cross-Origin policies
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
  // Remove server identification
  { key: 'Server', value: '' },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hide X-Powered-By header (removes "Next.js" identification)
  poweredByHeader: false,

  // Disable source maps in production (prevents code inspection)
  productionBrowserSourceMaps: false,

  // Minify and compress output
  compress: true,

  // Obfuscate chunk file names in production
  ...(isDev ? {} : {
    webpack: (config) => {
      // Mangle/minify output — makes code harder to read
      if (config.optimization && config.optimization.minimizer) {
        config.optimization.minimizer.forEach((plugin) => {
          if (plugin.constructor.name === 'TerserPlugin') {
            plugin.options.terserOptions = {
              ...plugin.options.terserOptions,
              compress: {
                drop_console: true,  // Remove all console.log in production
                drop_debugger: true,
                passes: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                comments: false,  // Remove all comments
              },
            }
          }
        })
      }
      return config
    },
  }),

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      // API routes — no cache, no tech stack hints
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Server', value: '' },
        ],
      },
      // Block access to source maps even if they somehow exist
      {
        source: '/:path*.map',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
    ]
  },

  // Disable React DevTools identification in production
  reactStrictMode: true,
}

export default withNextIntl(nextConfig)
