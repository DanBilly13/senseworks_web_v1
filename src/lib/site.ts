// The site's public address and whether search engines may index it, in
// one place: canonical URLs, language alternates, the sitemap and
// robots.txt all read these.

// The main address. The other form (www or not) redirects to it in
// Vercel's domain settings; change this line too if that's the one
// picked. Overridable per environment with NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://senseworks.io').replace(/\/$/, '')
export const SITE_HOST = new URL(SITE_URL).host

// Only Vercel's production deployment is indexable — never preview
// deploys or local dev. robots.txt also checks the requested host, so
// the same production deployment on its vercel.app address stays out
// of search (see app/robots.ts).
export const INDEXABLE = process.env.VERCEL_ENV === 'production'

export const SITE_LOCALES = ['en', 'sv'] as const

// A page's canonical address and its other-language versions, for
// generateMetadata. `path` is the part after the locale ("/pris",
// "/blog/<slug>"); `locales` the languages the page exists in. English
// is the x-default: where a search engine sends someone in neither.
export function localeAlternates(path: string, locale: string, locales: readonly string[] = SITE_LOCALES) {
  const languages: Record<string, string> = Object.fromEntries(locales.map((l) => [l, `/${l}${path}`]))
  if (locales.includes('en')) languages['x-default'] = `/en${path}`
  return { canonical: `/${locale}${path}`, languages }
}
