'use client'
import { useState } from 'react'
import { Tag } from '@/components/ui/Tag'
import { BlogRow } from './BlogCard'
import { BLOG_TAGS, BLOG_TEXT, type BlogLocale } from '@/lib/blog'
import type { BlogPostSummary, BlogTag } from '@/lib/sanity/blog'

// The blog's list: All / News / Insights chips (filtering on the page),
// then every post, newest first, under its year (2026, 2025 … 2022), all
// as the same row (BlogRow) — no paging, so the oldest year is always a
// scroll away. The year headings, each with its post count, are what
// show the length of the history at a glance.
export function BlogIndex({ posts, locale }: { posts: BlogPostSummary[]; locale: BlogLocale }) {
  const [filter, setFilter] = useState<BlogTag | 'all'>('all')
  const visible = filter === 'all' ? posts : posts.filter((post) => post.tag === filter)
  const years = new Map<string, BlogPostSummary[]>()
  for (const post of visible) {
    const year = post.publishedAt.slice(0, 4)
    years.set(year, [...(years.get(year) ?? []), post])
  }
  const tags = (Object.keys(BLOG_TAGS) as BlogTag[]).filter((tag) => posts.some((post) => post.tag === tag))

  return (
    <div className="flex flex-col gap-2xl">
      {tags.length > 1 && (
        <div role="group" aria-label={BLOG_TEXT.filter[locale]} className="flex flex-wrap gap-small">
          <Tag as="button" active={filter === 'all'} onClick={() => setFilter('all')}>
            {BLOG_TEXT.all[locale]}
          </Tag>
          {tags.map((tag) => (
            <Tag key={tag} as="button" active={filter === tag} onClick={() => setFilter(tag)}>
              {BLOG_TAGS[tag][locale]}
            </Tag>
          ))}
        </div>
      )}
      {!visible.length && <p className="text-body text-muted-foreground">{BLOG_TEXT.noPosts[locale]}</p>}
      {[...years.entries()].map(([year, yearPosts]) => (
        // 12 columns: the year in the first 2 (it stays in view while its
        // posts scroll past), the posts in the next 8, the last 2 empty.
        // On mobile the year sits above its posts.
        <section key={year} className="grid grid-cols-1 gap-medium md:grid-cols-12 md:gap-large">
          <div className="md:col-span-2">
            <div className="flex items-baseline gap-small md:sticky md:top-2xl md:flex-col md:gap-xs md:border-t md:border-foreground/20 md:pt-medium-large">
              <h2 className="text-h2 font-bold text-foreground">{year}</h2>
              <p className="text-body-sm text-muted-foreground">
                {yearPosts.length} {yearPosts.length === 1 ? BLOG_TEXT.post[locale] : BLOG_TEXT.posts[locale]}
              </p>
            </div>
          </div>
          <div className="md:col-span-8">
            {yearPosts.map((post) => (
              <BlogRow key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
