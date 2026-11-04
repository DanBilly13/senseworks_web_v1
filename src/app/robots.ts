import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { INDEXABLE, SITE_HOST, SITE_URL } from '@/lib/site'

// Crawlable only on the real domain's production deployment. The same
// deployment also answers on its vercel.app address, and previews have
// their own: those all get "disallow everything", so search engines
// never index a copy of the site under another address. Read per
// request (the host), so it can't be cached for the wrong address.
export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get('host')
  if (!INDEXABLE || host !== SITE_HOST) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Studio, the API and the internal blocks gallery aren't pages
      // for search (the gallery also says noindex itself).
      disallow: ['/studio', '/api/', '/en/blocks', '/sv/blocks'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
