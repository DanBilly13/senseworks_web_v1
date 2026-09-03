import type { MetadataRoute } from 'next'

// Dev-only Vercel deployment isn't meant to be publicly discoverable —
// keep it out of search indexes until it's ready to be real.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  }
}
