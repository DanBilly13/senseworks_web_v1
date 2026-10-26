import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReleaseCardsBlock } from '@/components/blocks/ReleaseCardsBlock'

const pathname = vi.hoisted(() => ({ current: '/en/home' }))
vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }))

describe('ReleaseCardsBlock', () => {
  it('renders a card with its chip, text, date and a full stage bar (Shipped by default)', () => {
    render(
      <ReleaseCardsBlock
        cards={[
          {
            tag: 'audit',
            title: 'RevR 21',
            description: 'Add the statement to the audit report.',
            date: '24 Sep 2026',
          },
        ]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'RevR 21' })).toBeInTheDocument()
    expect(screen.getByText('Audit')).toHaveClass('bg-tag-purple')
    expect(screen.getByText('24 Sep 2026')).toBeInTheDocument()
    expect(screen.getByText('Shipped')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3')
    expect(screen.queryByText(/%/)).toBeNull()
  })

  it('colors the chip by category: analysis green, customer service yellow', () => {
    render(
      <ReleaseCardsBlock
        cards={[
          { tag: 'analysis', title: 'A' },
          { tag: 'customerService', title: 'B' },
        ]}
      />,
    )
    expect(screen.getByText('Analytics')).toHaveClass('bg-tag-green')
    expect(screen.getByText('Support')).toHaveClass('bg-tag-yellow')
  })

  it('shows the stage, not a percentage: two of three steps for Rolling out', () => {
    const { container } = render(<ReleaseCardsBlock cards={[{ title: 'X', stage: 'rollingOut' }]} />)
    expect(screen.getByText('Rolling out')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
    expect(container.querySelectorAll('[role="progressbar"] .bg-foreground')).toHaveLength(2)
    expect(screen.queryByText(/%/)).toBeNull()
  })

  it('names the stage in Swedish on Swedish pages', () => {
    pathname.current = '/sv/home'
    render(<ReleaseCardsBlock cards={[{ title: 'X', stage: 'development' }]} />)
    expect(screen.getByText('Under utveckling')).toBeInTheDocument()
    pathname.current = '/en/home'
  })

  it('shows up to six team members, overlapping, and offers four columns', () => {
    const team = Array.from({ length: 8 }, (_, i) => ({ name: `Person ${i + 1}` }))
    const { container } = render(<ReleaseCardsBlock columns="4" cards={[{ title: 'X', team }]} />)
    expect(container.querySelectorAll('ul[aria-label="Team"] li')).toHaveLength(6)
    expect(container.querySelectorAll('ul[aria-label="Team"] li.-ml-xs')).toHaveLength(5)
    expect(container.querySelector('.lg\\:grid-cols-4')).not.toBeNull()
  })

  it('renders nothing with no cards', () => {
    const { container } = render(<ReleaseCardsBlock cards={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows every chosen release, in order, past "How many", skipping a deleted one', () => {
    render(
      <ReleaseCardsBlock
        source="pick"
        count={2}
        releases={[
          { title: 'Third', stage: 'development' },
          null as unknown as { title: string },
          { title: 'First', stage: 'rollingOut' },
          { title: 'Second' },
        ]}
      />,
    )
    expect(screen.getAllByRole('heading').map((h) => h.textContent)).toEqual(['Third', 'First', 'Second'])
    expect(screen.getByText('In development')).toBeInTheDocument()
    expect(screen.getByText('Rolling out')).toBeInTheDocument()
  })

  it('caps the newest releases at "How many"', () => {
    render(<ReleaseCardsBlock count={2} releases={[{ title: 'A' }, { title: 'B' }, { title: 'C' }]} />)
    expect(screen.getAllByRole('heading')).toHaveLength(2)
  })
})
