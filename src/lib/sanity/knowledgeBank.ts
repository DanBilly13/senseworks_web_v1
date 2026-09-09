import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'
import { sanityClient } from './client'

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

// No cross-locale fallback here (unlike getPage's D12 coalesce) — an
// empty result for a locale with no published articles yet is a real,
// expected state, not a missing-translation gap to paper over.
export const articlesByLocaleQuery = groq`
  *[_type == "article" && language == $locale] | order(publishedAt desc) {
    ${articleSummaryProjection}
  }
`

export const articleBySlugAndLocaleQuery = groq`
  *[_type == "article" && slug.current == $slug && language == $locale][0] {
    ${articleSummaryProjection}
    body,
  }
`

export function getArticles(locale: string): Promise<ArticleSummary[]> {
  return sanityClient.fetch(articlesByLocaleQuery, { locale })
}

export function getArticle(slug: string, locale: string): Promise<ArticleDoc | null> {
  return sanityClient.fetch(articleBySlugAndLocaleQuery, { slug, locale })
}
