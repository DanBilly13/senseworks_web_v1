import { sanityClient } from './client'
import { pageBySlugAndLocaleQuery } from './queries'

export type PageBlock = { _type: string; _key: string; [key: string]: unknown }

export type PageDoc = {
  title: string
  language: string
  slug: string
  blocks: PageBlock[]
} | null

export async function getPage(slug: string, locale: string): Promise<PageDoc> {
  return sanityClient.fetch(pageBySlugAndLocaleQuery, { slug, locale })
}
