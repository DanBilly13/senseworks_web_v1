import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { CustomerStoriesGrid } from '@/components/customer-stories/CustomerStoriesGrid'
import { splitProducts } from '@/lib/customerStoryProducts'
import type { CustomerStorySummary } from '@/lib/sanity/customerStories'

const stories: CustomerStorySummary[] = [
  { companyName: 'Older Audit Firm', slug: 'older', products: 'Audit', publishedAt: '2026-01-01T00:00:00Z' },
  { companyName: 'Newer Both Firm', slug: 'newer', products: 'Audit + Analytics', publishedAt: '2026-06-01T00:00:00Z' },
]

describe('splitProducts', () => {
  it('splits a products line into separate products', () => {
    expect(splitProducts('Audit + Analytics')).toEqual(['Audit', 'Analytics'])
    expect(splitProducts(undefined)).toEqual([])
  })
})

describe('CustomerStoriesGrid', () => {
  it('lists every story newest first, each linking to its story page', () => {
    render(<CustomerStoriesGrid stories={stories} locale="sv" />)
    const headings = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(headings).toEqual(['Newer Both Firm', 'Older Audit Firm'])
    expect(screen.getAllByRole('link', { name: /Read their story/ })[0]).toHaveAttribute(
      'href',
      '/sv/customer-stories/newer',
    )
  })

  it('filters by product', () => {
    render(<CustomerStoriesGrid stories={stories} locale="sv" />)
    fireEvent.click(screen.getByRole('button', { name: 'Analytics' }))
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Newer Both Firm'])
  })
})
