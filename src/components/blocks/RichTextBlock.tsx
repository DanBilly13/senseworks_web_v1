import { ArticleBody } from '@/components/ui/ArticleBody'
import { SectionShell } from '@/components/ui/SectionShell'

type RichTextBlockProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Portable Text block shape, rendered generically via @portabletext/react
  body?: any[]
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

// Long-form text in the article text column (the middle 8 of 12 columns
// on desktop, .article-grid), with the article body styles: the legal
// pages, or any page of prose.
export function RichTextBlock({ body, spacing = 'loose' }: RichTextBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!body?.length) return null
  return (
    <SectionShell py={spacing} maxWidth="page" className="article-grid">
      <ArticleBody value={body} />
    </SectionShell>
  )
}
