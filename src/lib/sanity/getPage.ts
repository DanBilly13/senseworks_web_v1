import { sanityClient } from './client'
import { pageBySlugAndLocaleQuery } from './queries'
import { localize } from '@/lib/i18n/localize'

export type PageBlock = { _type: string; _key: string; [key: string]: unknown }

export type PageDoc = {
  title: string
  language: string
  slug: string
  theme?: 'default' | 'revision' | 'analysis'
  navigation?: 'full' | 'landing'
  seoTitle?: string
  seoDescription?: string
  blocks: PageBlock[]
} | null

// Every translatable field comes back as { en, sv }; localize() picks
// the page's language (English as the fallback) and points internal
// links at it, so the page and every block receive plain strings.
export async function getPage(slug: string, locale: string): Promise<PageDoc> {
  const page = await sanityClient.fetch(pageBySlugAndLocaleQuery, { slug, locale })
  return localize(page, locale)
}
