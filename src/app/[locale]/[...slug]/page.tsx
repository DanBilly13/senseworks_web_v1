import { notFound } from 'next/navigation'
import { getPage } from '@/lib/sanity/getPage'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { AnimatedButtonProvider } from '@/components/ui/Button'
import { UploadQueueLoopPilotSection } from '@/components/experimental/UploadQueueLoopPilotSection'

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

  // EXPERIMENTAL pilot (see UploadQueueLoopPilotSection) — swaps lp/v1's
  // hero mediaBlock (key "k2") for a hand-built animated illustration
  // instead of a real screenshot, to evaluate whether bespoke animated
  // media are worth building for other feature slots. Deliberately not
  // CMS-editable like every other block on this page — a per-instance
  // code override, not a new block type, until the pilot proves out.
  // Revert: delete this block and the pilotIndex logic below, and block
  // k2 goes back to rendering normally through BlockRenderer.
  const pilotIndex =
    slug.join('/') === 'lp/v1' ? page.blocks.findIndex((b) => b._key === 'k2') : -1

  return (
    <AnimatedButtonProvider value={isLandingPage}>
      {pilotIndex === -1 ? (
        <BlockRenderer blocks={page.blocks} />
      ) : (
        <>
          <BlockRenderer blocks={page.blocks.slice(0, pilotIndex)} />
          <UploadQueueLoopPilotSection />
          <BlockRenderer blocks={page.blocks.slice(pilotIndex + 1)} />
        </>
      )}
    </AnimatedButtonProvider>
  )
}
