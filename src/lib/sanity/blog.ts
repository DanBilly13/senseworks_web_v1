import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'
import { sanityClient } from './client'
import type { ArticleAuthor } from './knowledgeBank'
import { localize } from '@/lib/i18n/localize'

export type BlogTag = 'news' | 'insights'

export type BlogPostSummary = {
  title: string
  slug: string
  tag: BlogTag
  publishedAt: string
  // The standfirst, or the opening paragraph when there's none.
  excerpt?: string
  coverImage?: SanityImageSource
  generatedCover?: boolean
}

export type BlogPostDoc = BlogPostSummary & {
  standfirst?: string
  author?: ArticleAuthor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Portable Text block shape, rendered via ArticleBody
  body?: any[]
  customerStory?: { slug: string; companyName: string; title?: string; summary?: string; coverImage?: SanityImageSource } | null
  related: BlogPostSummary[]
}

// A post shows in a language it has a title in — no cross-language
// fallback: the English blog is the (shorter) list of posts with English.
const IN_LOCALE = groq`defined(title[$locale])`

const summaryProjection = groq`
  title,
  "slug": slug.current,
  tag,
  publishedAt,
  "excerpt": coalesce(standfirst[$locale], pt::text(body[$locale][_type == "block" && style == "normal"][0])),
  coverImage,
  generatedCover
`

export const blogPostsQuery = groq`
  *[_type == "blogPost" && ${IN_LOCALE}] | order(publishedAt desc) { ${summaryProjection} }
`

export const blogPostQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    ${summaryProjection},
    "inLocale": ${IN_LOCALE},
    standfirst,
    "author": author->{ name, role, photo },
    body,
    "customerStory": customerStory->{ "slug": slug.current, companyName, title, summary, coverImage },
    "related": *[_type == "blogPost" && tag == ^.tag && _id != ^._id && ${IN_LOCALE}] | order(publishedAt desc)[0...3] { ${summaryProjection} }
  }
`

// `null` for a post that doesn't exist; `{ inLocale: false }` for one
// that exists only in the other language (its page sends the visitor to
// this language's blog index rather than a 404).
export async function getBlogPost(slug: string, locale: string): Promise<(BlogPostDoc & { inLocale: boolean }) | null> {
  return localize(await sanityClient.fetch(blogPostQuery, { slug, locale }), locale)
}
