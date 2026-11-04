import type { MetadataRoute } from 'next'
import { getSitemapContent } from '@/lib/sanity/sitemap'
import { SITE_LOCALES, SITE_URL } from '@/lib/site'

type Locale = (typeof SITE_LOCALES)[number]

// Every public page in each language it exists in, each entry listing
// its other-language versions too (so search engines pair /en and /sv).
// Rebuilt with the rest of the site when Studio publishes (the
// revalidate webhook).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { pages, posts, articles, stories } = await getSitemapContent()

  const entries = (path: string, lastModified: string, locales: readonly Locale[]) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
    }))
  const inLocales = (item: { en?: boolean; sv?: boolean }) => SITE_LOCALES.filter((l) => item[l])

  return [
    ...pages.flatMap((p) => entries(`/${p.slug}`, p._updatedAt, SITE_LOCALES)),
    ...posts.flatMap((p) => entries(`/blog/${p.slug}`, p._updatedAt, inLocales(p))),
    ...articles.flatMap((a) => entries(`/knowledge-bank/${a.slug}`, a._updatedAt, inLocales(a))),
    ...stories.flatMap((s) => entries(`/customer-stories/${s.slug}`, s._updatedAt, inLocales(s))),
  ]
}
