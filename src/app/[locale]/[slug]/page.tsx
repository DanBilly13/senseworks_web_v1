import { notFound } from 'next/navigation'
import { getPage } from '@/lib/sanity/getPage'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'

// Static generation (SSG) for v1 — matches solution-spec.md's Loading
// state decision (no per-page loading UI needed). Only the "home"
// demo page exists for this slice.
export function generateStaticParams() {
  return [{ slug: 'home' }]
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const page = await getPage(slug, locale)

  // A genuinely missing page (not just a missing translation, which
  // the coalesce query in getPage already resolves via D12) is the
  // one real 404 case left.
  if (!page) notFound()

  return <BlockRenderer blocks={page.blocks} />
}
