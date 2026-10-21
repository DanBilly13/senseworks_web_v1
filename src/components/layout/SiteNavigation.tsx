import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { getSiteNavigation } from '@/lib/sanity/siteNavigation'

// "full": the whole menu and footer. "landing": a landing page's — the
// logo and button only, and the footer's bottom row (copyright and legal
// links) without link columns, newsletter or social links.
export type NavigationVariant = 'full' | 'landing'

// `path` is the page's own address, so the menu marks the current page
// already in the pre-built HTML (see HeaderBlock's currentPath).
export async function SiteHeader({ locale, path, variant = 'full' }: { locale: string; path?: string; variant?: NavigationVariant }) {
  const { header, versions } = await getSiteNavigation(locale)
  if (!header) return null
  // The page versions go along, for the team's versions menus (HeaderBlock).
  const block = { ...header, versions, ...(path ? { currentPath: path } : {}) }
  return <BlockRenderer blocks={[variant === 'landing' ? { ...block, navLinks: [] } : block]} />
}

export async function SiteFooter({ locale, variant = 'full' }: { locale: string; variant?: NavigationVariant }) {
  const { footer } = await getSiteNavigation(locale)
  if (!footer) return null
  return (
    <BlockRenderer
      blocks={[variant === 'landing' ? { ...footer, linkColumns: [], socialLinks: [], showNewsletter: false } : footer]}
    />
  )
}
