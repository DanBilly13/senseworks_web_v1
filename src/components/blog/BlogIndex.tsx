'use client'
import { useState } from 'react'
import { Tag } from '@/components/ui/Tag'
import { BlogCardCompact, BlogCardLarge } from './BlogCard'
import { BLOG_TAGS, BLOG_TEXT, type BlogLocale } from '@/lib/blog'
import type { BlogPostSummary, BlogTag } from '@/lib/sanity/blog'

const LATEST = 3

// The blog's list: All / News / Insights chips (filtering on the page),
// the newest three as large cards, then every other post under its year
// (2026, 2025 … 2022) as compact rows — all of them, no paging, so the
// oldest year is always a scroll away. The year headings, each with its
// post count, are what show the length of the history at a glance.
export function BlogIndex({ posts, locale }: { posts: BlogPostSummary[]; locale: BlogLocale }) {
  const [filter, setFilter] = useState<BlogTag | 'all'>('all')
  const visible = filter === 'all' ? posts : posts.filter((post) => post.tag === filter)
  const latest = visible.slice(0, LATEST)
  const years = new Map<string, BlogPostSummary[]>()
  for (const post of visible.slice(LATEST)) {
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
      {latest.length > 0 && (
        <section aria-label={BLOG_TEXT.latest[locale]} className="grid grid-cols-1 gap-large md:grid-cols-3">
          {latest.map((post) => (
            <BlogCardLarge key={post.slug} post={post} locale={locale} />
          ))}
        </section>
      )}
      {[...years.entries()].map(([year, yearPosts]) => (
        <section key={year} className="grid grid-cols-1 gap-medium md:grid-cols-4 md:gap-large">
          <div className="flex items-baseline gap-small md:flex-col md:gap-xs">
            <h2 className="text-h2 font-bold text-foreground">{year}</h2>
            <p className="text-body-sm text-muted-foreground">
              {yearPosts.length} {yearPosts.length === 1 ? BLOG_TEXT.post[locale] : BLOG_TEXT.posts[locale]}
            </p>
          </div>
          <div className="md:col-span-3">
            {yearPosts.map((post) => (
              <BlogCardCompact key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
