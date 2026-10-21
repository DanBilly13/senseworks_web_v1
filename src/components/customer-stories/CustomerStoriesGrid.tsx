'use client'
import { useMemo, useState } from 'react'
import { Tag } from '@/components/ui/Tag'
import { SortSelect, type SortOrder } from '@/components/ui/SortSelect'
import { StoryCard } from './StoryCard'
import { productLabels } from '@/lib/customerStoryProducts'
import type { CustomerStorySummary } from '@/lib/sanity/customerStories'


// The Customer stories start page's grid — same filter-and-sort
// structure as the Knowledge Bank's, with product chips (Audit,
// Analytics) in place of article tags and story cards linking to each
// story.
export function CustomerStoriesGrid({ stories, locale }: { stories: CustomerStorySummary[]; locale: string }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<SortOrder>('newest')

  // Only products some story actually names, so no chip filters to an
  // empty grid.
  const products = useMemo(
    () => [...new Set(stories.flatMap((story) => productLabels(story.products, locale)))].sort(),
    [stories, locale],
  )

  function toggle(product: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(product)) next.delete(product)
      else next.add(product)
      return next
    })
  }

  const visible = useMemo(() => {
    // No chips selected shows everything.
    const filtered = selected.size
      ? stories.filter((story) => productLabels(story.products, locale).some((product) => selected.has(product)))
      : stories
    return [...filtered].sort((a, b) => {
      const diff = new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      return sort === 'newest' ? -diff : diff
    })
  }, [stories, selected, sort, locale])

  return (
    <div className="flex flex-col gap-2xl">
      <div className="flex flex-wrap items-center justify-between gap-medium">
        {products.length > 1 && (
          <div className="flex flex-wrap gap-small" role="group" aria-label="Filter by product">
            {products.map((product) => (
              <Tag key={product} as="button" active={selected.has(product)} onClick={() => toggle(product)}>
                {product}
              </Tag>
            ))}
          </div>
        )}
        <SortSelect value={sort} onChange={setSort} locale={locale} />
      </div>
      {visible.length ? (
        <div className="grid grid-cols-1 gap-large sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((story) => (
            <StoryCard key={story.slug} story={story} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-body text-muted-foreground">No stories match the selected products.</p>
      )}
    </div>
  )
}
