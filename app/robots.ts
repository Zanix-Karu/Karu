import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/maintenance'],
    },
    sitemap: 'https://getkaru.io/sitemap.xml',
  }
}
