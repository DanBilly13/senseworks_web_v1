import { notFound } from 'next/navigation'
import { getPage } from '@/lib/sanity/getPage'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { AnimatedButtonProvider } from '@/components/ui/Button'

// Static generation (SSG) for v1 — matches solution-spec.md's Loading
// state decision (no per-page loading UI needed). Catch-all segment
// (rather than a single [slug]) so multi-segment paths like
// "lp/v1" work — Sanity's slug field is just a string, Next.js's
// single dynamic segment was the thing that couldn't hold a "/".
export function generateStaticParams() {
  return [{ slug: ['home'] }, { slug: ['lp', 'v1'] }, { slug: ['lp', 'v2'] }]
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

  return (
    <AnimatedButtonProvider value={isLandingPage}>
      <BlockRenderer blocks={page.blocks} />
    </AnimatedButtonProvider>
  )
}
