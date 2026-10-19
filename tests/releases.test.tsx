import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { formatReleaseDate, groupShippedByMonth, monthLabel, type Release } from '@/lib/releases'
import { ReleaseTimelineBlock } from '@/components/blocks/ReleaseTimelineBlock'

const pathname = vi.hoisted(() => ({ current: '/en/releases' }))
vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }))

describe('release dates', () => {
  it('formats dates and month headings per language', () => {
    expect(formatReleaseDate('2026-10-01', 'en')).toBe('1 Oct 2026')
    expect(formatReleaseDate('2026-10-01', 'sv')).toMatch(/^1 okt\.? 2026$/)
    expect(formatReleaseDate('1 Oct 2026', 'sv')).toBe('1 Oct 2026')
    expect(formatReleaseDate('2026-09-24', 'en')).toBe('24 Sep 2026')
    expect(monthLabel('2026-10', 'en')).toBe('October 2026')
    expect(monthLabel('2026-10', 'sv')).toBe('Oktober 2026')
  })

  it('groups shipped releases by month, newest first, splitting off anything older than six months', () => {
    const releases: Release[] = [
      { title: 'A', date: '2026-10-01' },
      { title: 'B', date: '2026-10-20' },
      { title: 'C', date: '2026-05-03' },
      { title: 'D', date: '2026-04-30' },
    ]
    const { recent, earlier } = groupShippedByMonth(releases, new Date('2026-10-19T12:00:00Z'))
    expect(recent.map((m) => m.key)).toEqual(['2026-10', '2026-05'])
    expect(recent[0].releases.map((r) => r.title)).toEqual(['B', 'A'])
    expect(earlier.map((m) => m.key)).toEqual(['2026-04'])
  })
})

describe('ReleaseTimelineBlock', () => {
  const today = new Date()
  const iso = (monthsAgo: number) => new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - monthsAgo, 5)).toISOString().slice(0, 10)
  const releases: Release[] = [
    { _id: '1', title: 'Chat', tag: 'customerService', stage: 'rollingOut' },
    { _id: '2', title: 'VAT', tag: 'audit', stage: 'shipped', date: iso(0) },
    { _id: '3', title: 'Old one', tag: 'analysis', stage: 'shipped', date: iso(8) },
    { _id: '4', title: 'Next thing', tag: 'audit', stage: 'development' },
  ]

  it('stacks Rolling out, Shipped by month, then In development', () => {
    render(<ReleaseTimelineBlock releases={releases} />)
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings).toEqual(['Rolling out', 'Shipped', 'In development'])
    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.queryByText('Old one')).toBeNull()
  })

  it('shows earlier releases on request', () => {
    render(<ReleaseTimelineBlock releases={releases} />)
    fireEvent.click(screen.getByRole('button', { name: 'Show earlier releases' }))
    expect(screen.getByText('Old one')).toBeInTheDocument()
  })

  it('filters all three sections and hides the empty ones', () => {
    render(<ReleaseTimelineBlock releases={releases} />)
    fireEvent.click(screen.getByRole('button', { name: 'Audit' }))
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings).toEqual(['Shipped', 'In development'])
    expect(screen.queryByText('Chat')).toBeNull()
  })

  it('shows an AI chip next to the category, and filters by AI', () => {
    const withAi: Release[] = [...releases, { _id: '5', title: 'Smart match', tag: 'analysis', ai: true, stage: 'shipped', date: iso(0) }]
    render(<ReleaseTimelineBlock releases={withAi} />)
    expect(screen.getByText('AI', { selector: 'span' })).toHaveClass('bg-foreground')
    fireEvent.click(screen.getByRole('button', { name: 'AI' }))
    expect(screen.getByText('Smart match')).toBeInTheDocument()
    expect(screen.queryByText('VAT')).toBeNull()
  })

  it('speaks Swedish on Swedish pages', () => {
    pathname.current = '/sv/releases'
    render(<ReleaseTimelineBlock releases={releases} rollingOutHeading="Rullas ut" />)
    expect(screen.getByRole('button', { name: 'Alla' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Revision' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Visa tidigare släpp' })).toBeInTheDocument()
    pathname.current = '/en/releases'
  })
})
