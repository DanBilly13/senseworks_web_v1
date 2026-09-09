'use client'
import { useMemo, useState } from 'react'
import { Tag } from '@/components/ui/Tag'
import { ArticleCard } from './ArticleCard'
import type { ArticleSummary } from '@/lib/sanity/knowledgeBank'

type SortOrder = 'newest' | 'oldest'

type KnowledgeBankGridProps = {
  articles: ArticleSummary[]
  tags: { title: string; slug: string }[]
  locale: string
}

export function KnowledgeBankGrid({ articles, tags, locale }: KnowledgeBankGridProps) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<SortOrder>('newest')

  function toggleTag(slug: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const visibleArticles = useMemo(() => {
    // No tags selected shows everything — an empty filter isn't a
    // "match nothing" state.
    const filtered = selectedTags.size
      ? articles.filter((article) => article.tags?.some((tag) => selectedTags.has(tag.slug)))
      : articles

    return [...filtered].sort((a, b) => {
      const diff = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      return sort === 'newest' ? -diff : diff
    })
  }, [articles, selectedTags, sort])

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex flex-wrap items-center justify-between gap-medium">
        {!!tags.length && (
          <div className="flex flex-wrap gap-small" role="group" aria-label="Filter by tag">
            {tags.map((tag) => (
              <Tag key={tag.slug} as="button" active={selectedTags.has(tag.slug)} onClick={() => toggleTag(tag.slug)}>
                {tag.title}
              </Tag>
            ))}
          </div>
        )}
        <label className="flex items-center gap-small text-body-sm text-muted-foreground">
          Sort
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOrder)}
            className="rounded-md border border-border bg-background px-small-medium py-xs text-body-sm text-foreground"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>
      {visibleArticles.length ? (
        <div className="grid grid-cols-1 gap-large sm:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-body text-muted-foreground">No articles match the selected tags.</p>
      )}
    </div>
  )
}
