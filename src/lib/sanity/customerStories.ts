import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'
import { sanityClient } from './client'
import { mediaProjection } from './queries'
import type { MediaField } from './media'

export type CustomerStorySummary = {
  companyName: string
  slug: string
  facts?: string
  products?: string
  quote?: string
  personName?: string
  personRole?: string
  publishedAt: string
  title?: string
  subtitle?: string
  location?: string
  companySize?: string
  customerSince?: string
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
  quote,
  personName,
  personRole,
  publishedAt,
  title,
  subtitle,
  location,
  companySize,
  customerSince,
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

export function getCustomerStories(locale: string): Promise<CustomerStorySummary[]> {
  return sanityClient.fetch(customerStoriesQuery, { locale })
}

export function getCustomerStory(slug: string, locale: string): Promise<CustomerStoryDoc | null> {
  return sanityClient.fetch(customerStoryBySlugQuery, { slug, locale })
}
