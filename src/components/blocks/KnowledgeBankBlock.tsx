'use client'
import { usePathname } from 'next/navigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { KnowledgeBankGrid } from '@/components/knowledge-bank/KnowledgeBankGrid'
import type { ArticleSummary } from '@/lib/sanity/knowledgeBank'

type Spacing = 'loose' | 'medium' | 'tight' | 'none'

// The Knowledge Bank's article grid as a block, for the Knowledge Bank
// page. The articles are resolved in the page query, in the page's
// language; the filter tags are only those the articles actually use,
// so no tag filters to an empty grid.
export function KnowledgeBankBlock({ articles = [], spacing = 'loose' }: { articles?: ArticleSummary[]; spacing?: Spacing }) {
  const locale = usePathname().split('/')[1] || 'en'
  const tags = new Map<string, string>()
  for (const article of articles) for (const tag of article.tags ?? []) tags.set(tag.slug, tag.title)
  return (
    <SectionShell py={spacing}>
      <KnowledgeBankGrid articles={articles} tags={[...tags].map(([slug, title]) => ({ slug, title }))} locale={locale} />
    </SectionShell>
  )
}
