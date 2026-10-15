import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'
import { sanityClient } from './client'
import { localize } from '@/lib/i18n/localize'

export type ArticleTag = { title: string; slug: string }
export type ArticleAuthor = { name: string; role?: string; photo?: SanityImageSource }

export type ArticleSummary = {
  title: string
  subtitle?: string
  slug: string
  publishedAt: string
  coverImage?: SanityImageSource
  tags?: ArticleTag[]
  author?: ArticleAuthor
}

export type ArticleDoc = ArticleSummary & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Portable Text block shape, rendered generically via @portabletext/react
  body?: any[]
}

const articleSummaryProjection = groq`
  title,
  subtitle,
  "slug": slug.current,
  publishedAt,
  coverImage,
  "tags": tags[]->{ title, "slug": slug.current },
  "author": author->{ name, role, photo },
`

// One document per article, title/subtitle/body as English/Swedish
// pairs. An article shows only in a language it has a title in — no
// cross-language fallback (unlike pages): an empty Knowledge Bank for a
// language with no articles yet is a real, expected state.
// `language == $locale` covers an article still in the old one-document-
// per-language form, until scripts/merge-language-versions.ts has run.
const ARTICLE_IN_LOCALE = `(defined(title[$locale]) || language == $locale)`

export const articlesByLocaleQuery = groq`
  *[_type == "article" && ${ARTICLE_IN_LOCALE}] | order(publishedAt desc) {
    ${articleSummaryProjection}
  }
`

export const articleBySlugAndLocaleQuery = groq`
  *[_type == "article" && slug.current == $slug && ${ARTICLE_IN_LOCALE}][0] {
    ${articleSummaryProjection}
    body,
  }
`

export async function getArticles(locale: string): Promise<ArticleSummary[]> {
  return localize(await sanityClient.fetch(articlesByLocaleQuery, { locale }), locale)
}

export async function getArticle(slug: string, locale: string): Promise<ArticleDoc | null> {
  return localize(await sanityClient.fetch(articleBySlugAndLocaleQuery, { slug, locale }), locale)
}
