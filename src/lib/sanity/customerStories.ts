import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'
import { sanityClient } from './client'
import { mediaProjection } from './queries'
import type { MediaField } from './media'
import type { ArticleAuthor } from './knowledgeBank'
import { localize } from '@/lib/i18n/localize'

export type CustomerStorySummary = {
  companyName: string
  slug: string
  facts?: string
  // "audit" / "analytics" — see productLabels.
  products?: string[]
  // The one-line outcome shown on the card.
  summary?: string
  quote?: string
  personName?: string
  personRole?: string
  publishedAt: string
  title?: string
  subtitle?: string
  location?: string
  companySize?: string
  customerSince?: string
  // The interviewer, shown in the byline like an article's author.
  author?: ArticleAuthor
  coverImage?: SanityImageSource
  // The logo, as the case study card's `media`.
  media?: MediaField
}

export type CustomerStoryDoc = CustomerStorySummary & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Portable Text block shape, rendered via ArticleBody
  body?: any[]
}

const summaryProjection = groq`
  companyName,
  "slug": slug.current,
  facts,
  products,
  summary,
  quote,
  personName,
  personRole,
  publishedAt,
  title,
  subtitle,
  location,
  companySize,
  customerSince,
  "author": author->{ name, role, photo },
  coverImage,
  ${mediaProjection('logo')},
`

// D12-style fallback, per story: the requested locale's version when it
// exists, the English one otherwise — so /sv/customer-stories lists
// every story even before any are translated.
export const customerStoriesQuery = groq`
  *[_type == "customerStory" && (
    language == $locale ||
    (language == "en" && !(slug.current in *[_type == "customerStory" && language == $locale].slug.current))
  )] | order(publishedAt desc) {
    ${summaryProjection}
  }
`

export const customerStoryBySlugQuery = groq`
  coalesce(
    *[_type == "customerStory" && slug.current == $slug && language == $locale][0],
    *[_type == "customerStory" && slug.current == $slug && language == "en"][0]
  ) {
    ${summaryProjection}
    body,
  }
`

// Run through localize() like pages, so a translatable field nested in a
// story (e.g. a logo's alt text) arrives as a plain string.
export async function getCustomerStories(locale: string): Promise<CustomerStorySummary[]> {
  return localize(await sanityClient.fetch(customerStoriesQuery, { locale }), locale)
}

export async function getCustomerStory(slug: string, locale: string): Promise<CustomerStoryDoc | null> {
  return localize(await sanityClient.fetch(customerStoryBySlugQuery, { slug, locale }), locale)
}
