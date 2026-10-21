import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { BlogIndex } from '@/components/blog/BlogIndex'
import type { BlogPostSummary } from '@/lib/sanity/blog'

const post = (slug: string, publishedAt: string, tag: BlogPostSummary['tag']): BlogPostSummary => ({ slug, title: slug, publishedAt, tag })
const posts = [
  post('a', '2026-10-05', 'news'),
  post('b', '2026-09-21', 'insights'),
  post('c', '2026-09-02', 'news'),
  post('d', '2025-11-18', 'news'),
  post('e', '2023-02-08', 'insights'),
  post('f', '2022-01-20', 'news'),
]

describe('BlogIndex', () => {
  it('lists every post as the same row, under its year, newest first', () => {
    render(<BlogIndex posts={posts} locale="en" />)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['2026', '2025', '2023', '2022'])
    expect(screen.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(posts.map((p) => `/en/blog/${p.slug}`))
  })

  it('filters every section by tag, in the page language', () => {
    render(<BlogIndex posts={posts} locale="sv" />)
    fireEvent.click(screen.getByRole('button', { name: 'Insikter' }))
    expect(screen.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['/sv/blog/b', '/sv/blog/e'])
  })

  it('uses the generated cover when a post has no image', () => {
    const { container } = render(<BlogIndex posts={[post('x', '2026-01-01', 'news')]} locale="en" />)
    expect(container.querySelector('.bg-tag-yellow img')).not.toBeNull()
  })
})
