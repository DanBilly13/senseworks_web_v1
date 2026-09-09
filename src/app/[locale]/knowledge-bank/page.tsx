import { notFound } from 'next/navigation'
import { getPage } from '@/lib/sanity/getPage'
import type { PageBlock } from '@/lib/sanity/getPage'
import { getArticles } from '@/lib/sanity/knowledgeBank'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { KnowledgeBankGrid } from '@/components/knowledge-bank/KnowledgeBankGrid'

export default async function KnowledgeBankPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // The header/footer aren't a shared layout (each `page` document
  // carries its own copy, per D7) — reusing the home page's here keeps
  // this listing on the same nav as everywhere else without a
  // duplicate content source to fall out of sync.
  const [home, articles] = await Promise.all([getPage('home', locale), getArticles(locale)])

  if (!home) notFound()

  const header = home.blocks.find((block) => block._type === 'headerBlock')
  const footer = home.blocks.find((block) => block._type === 'footerBlock')

  // Derived from whatever tags the fetched articles actually use, not
  // every `tag` document that exists — a tag with zero published
  // articles would otherwise filter to a dead end.
  const tagMap = new Map<string, string>()
  for (const article of articles) {
    for (const tag of article.tags ?? []) tagMap.set(tag.slug, tag.title)
  }
  const tags = [...tagMap.entries()].map(([slug, title]) => ({ slug, title }))

  return (
    <>
      {header && <BlockRenderer blocks={[header as PageBlock]} />}
      <SectionShell py="section-edge" pad="both" className="flex flex-col gap-2xl">
        <SectionIntro
          as="h1"
          eyebrow="Resources"
          heading="Knowledge Bank"
          body="Guides and articles from the Senseworks team."
          maxWidth="md"
        />
        <KnowledgeBankGrid articles={articles} tags={tags} locale={locale} />
      </SectionShell>
      {footer && <BlockRenderer blocks={[footer as PageBlock]} />}
    </>
  )
}
