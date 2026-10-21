import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPage } from '@/lib/sanity/getPage'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { AnimatedButtonProvider } from '@/components/ui/Button'
import { SiteFooter, SiteHeader } from '@/components/layout/SiteNavigation'

// Static generation (SSG) for v1 — matches solution-spec.md's Loading
// state decision (no per-page loading UI needed). Catch-all segment
// (rather than a single [slug]) so multi-segment paths like
// "lp/v1" work — Sanity's slug field is just a string, Next.js's
// single dynamic segment was the thing that couldn't hold a "/".
export function generateStaticParams() {
  return [{ slug: ['home'] }, { slug: ['lp', 'v1'] }, { slug: ['lp', 'v2'] }]
}

// Per-page title/description from Studio's SEO fields; a page that
// leaves them empty just inherits the site-wide defaults in the root
// layout (and the site-wide noindex, which this doesn't touch).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getPage(slug.join('/'), locale)
  return {
    ...(page?.seoTitle ? { title: page.seoTitle } : {}),
    ...(page?.seoDescription ? { description: page.seoDescription } : {}),
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>
}) {
  const { locale, slug } = await params
  const page = await getPage(slug.join('/'), locale)

  // A genuinely missing page (not just a missing translation, which
  // the coalesce query in getPage already resolves via D12) is the
  // one real 404 case left.
  if (!page) notFound()

  // Test — lp/v1 and lp/v2 only, per Dan's request: every Button on
  // the page uses the animated hover treatment by default (an
  // explicit `animated` prop on a given Button still overrides this).
  // The light-grey page background this used to also gate is now the
  // site-wide default (see body in globals.css), not LP-specific.
  const isLandingPage = slug[0] === 'lp'

  // The header and footer are the shared ones from "Site navigation",
  // the short landing-page versions when the page asks for that (lp/*
  // pages do by default). Any header/footer block still inside the
  // page's own blocks, from before navigation was shared, is skipped.
  const navigation = page.navigation ?? (isLandingPage ? 'landing' : 'full')
  const blocks = page.blocks.filter((block) => block._type !== 'headerBlock' && block._type !== 'footerBlock')

  return (
    // "contents": no box of its own, so it can't affect the blocks'
    // layout inside body's flex column — it only exists to carry the
    // page theme's CSS variables (see data-page-theme in globals.css).
    <div className="contents" data-page-theme={page.theme ?? 'default'}>
      <AnimatedButtonProvider value={isLandingPage}>
        <SiteHeader locale={locale} path={`/${locale}/${slug.join('/')}`} variant={navigation} />
        <BlockRenderer blocks={blocks} />
        <SiteFooter locale={locale} variant={navigation} />
      </AnimatedButtonProvider>
    </div>
  )
}
