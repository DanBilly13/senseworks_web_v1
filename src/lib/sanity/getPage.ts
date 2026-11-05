import { sanityClient } from './client'
import { pageBySlugAndLocaleQuery } from './queries'
import { localize } from '@/lib/i18n/localize'
import { upgradeBlock } from './upgradeBlock'

export type PageBlock = { _type: string; _key: string; [key: string]: unknown }

export type PageDoc = {
  title: string
  language: string
  slug: string
  theme?: 'default' | 'revision' | 'analysis'
  navigation?: 'full' | 'landing'
  // Shows the ticker tape (ui/TickerTape) above the nav.
  tickerTape?: boolean
  // A version of another page (page.ts's "Version of") — kept out of
  // search engines.
  isVersion?: boolean
  seoTitle?: string
  seoDescription?: string
  blocks: PageBlock[]
} | null

// Every translatable field comes back as { en, sv }; localize() picks
// the page's language (English as the fallback) and points internal
// links at it, so the page and every block receive plain strings.
export async function getPage(slug: string, locale: string): Promise<PageDoc> {
  const page = await sanityClient.fetch(pageBySlugAndLocaleQuery, { slug, locale })
  // Blocks still saved under an old field name or value (see upgradeBlock).
  if (page?.blocks) page.blocks = page.blocks.map(upgradeBlock)
  return localize(page, locale)
}
