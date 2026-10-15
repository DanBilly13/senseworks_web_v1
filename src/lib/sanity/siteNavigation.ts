import { cache } from 'react'
import { groq } from 'next-sanity'
import { sanityClient } from './client'
import type { PageBlock } from './getPage'
import { localize } from '@/lib/i18n/localize'

export type SiteNavigation = { header?: PageBlock; footer?: PageBlock }

// The shared header and footer ("Site navigation" in Studio). Until that
// document exists, the Home page's own header/footer blocks stand in.
const siteNavigationQuery = groq`
  coalesce(
    *[_id == "siteNavigation"][0]{
      "header": header{ ..., "_type": "headerBlock", "_key": "site-header" },
      "footer": footer{ ..., "_type": "footerBlock", "_key": "site-footer" }
    },
    *[_type == "page" && slug.current == "home"][0]{
      "header": blocks[_type == "headerBlock"][0],
      "footer": blocks[_type == "footerBlock"][0]
    }
  )
`

// Cached per request: the header and footer both ask for it.
export const getSiteNavigation = cache(async (locale: string): Promise<SiteNavigation> => {
  return localize((await sanityClient.fetch(siteNavigationQuery)) ?? {}, locale)
})
