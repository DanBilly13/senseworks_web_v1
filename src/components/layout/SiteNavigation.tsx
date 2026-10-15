import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { getSiteNavigation } from '@/lib/sanity/siteNavigation'

// "full": the whole menu and footer. "landing": a landing page's — the
// logo and button only, and the footer's bottom row (copyright and legal
// links) without link columns, newsletter or social links.
export type NavigationVariant = 'full' | 'landing'

export async function SiteHeader({ locale, variant = 'full' }: { locale: string; variant?: NavigationVariant }) {
  const { header } = await getSiteNavigation(locale)
  if (!header) return null
  return <BlockRenderer blocks={[variant === 'landing' ? { ...header, navLinks: [] } : header]} />
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
