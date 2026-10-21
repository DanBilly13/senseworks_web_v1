'use client'
import { usePathname } from 'next/navigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { BlogIndex } from '@/components/blog/BlogIndex'
import { blogLocale } from '@/lib/blog'
import type { BlogPostSummary } from '@/lib/sanity/blog'

type Spacing = 'loose' | 'medium' | 'tight' | 'none'

// The blog's list (BlogIndex) as a block, for the Blog page. The posts
// are resolved in the page query, in the page's language.
export function BlogPostsBlock({ posts = [], spacing = 'loose' }: { posts?: BlogPostSummary[]; spacing?: Spacing }) {
  const locale = blogLocale(usePathname().split('/')[1] ?? 'en')
  if (!posts.length) return null
  return (
    <SectionShell py={spacing}>
      <BlogIndex posts={posts} locale={locale} />
    </SectionShell>
  )
}
