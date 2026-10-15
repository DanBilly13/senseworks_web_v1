import { getArticles } from '@/lib/sanity/knowledgeBank'
import { SiteFooter, SiteHeader } from '@/components/layout/SiteNavigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { KnowledgeBankGrid } from '@/components/knowledge-bank/KnowledgeBankGrid'

export default async function KnowledgeBankPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const articles = await getArticles(locale)

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
      <SiteHeader locale={locale} />
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
      <SiteFooter locale={locale} />
    </>
  )
}
