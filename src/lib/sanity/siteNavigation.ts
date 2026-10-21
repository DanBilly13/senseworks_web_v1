import { cache } from 'react'
import { groq } from 'next-sanity'
import { sanityClient } from './client'
import type { PageBlock } from './getPage'
import { localize } from '@/lib/i18n/localize'

// A page's version (a copy to try something out on — page.ts's
// "Version of"): its address, its name, and the page it's a version of.
export type PageVersion = { slug: string; title: string; of: string }

export type SiteNavigation = { header?: PageBlock; footer?: PageBlock }

// The shared header and footer ("Site navigation" in Studio). Until that
// document exists, the Home page's own header/footer blocks stand in.
const siteNavigationQuery = groq`{
  "nav": coalesce(
    *[_id == "siteNavigation"][0]{
      "header": header{ ..., "_type": "headerBlock", "_key": "site-header" },
      "footer": footer{ ..., "_type": "footerBlock", "_key": "site-footer" }
    },
    *[_type == "page" && slug.current == "home"][0]{
      "header": blocks[_type == "headerBlock"][0],
      "footer": blocks[_type == "footerBlock"][0]
    }
  )
}`

// Cached per request: the header and footer both ask for it.
export const getSiteNavigation = cache(async (locale: string): Promise<SiteNavigation> => {
  const { nav } = localize(await sanityClient.fetch(siteNavigationQuery), locale)
  return nav ?? {}
})

// Every page version, for the team's versions menus (api/versions).
const pageVersionsQuery = groq`
  *[_type == "page" && defined(versionOf) && defined(versionOf->slug.current)] | order(_createdAt asc) {
    "slug": slug.current, title, "of": versionOf->slug.current
  }
`

export async function getPageVersions(locale: string): Promise<PageVersion[]> {
  return localize(await sanityClient.fetch(pageVersionsQuery), locale) ?? []
}
