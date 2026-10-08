import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReleaseCardsBlock } from '@/components/blocks/ReleaseCardsBlock'

describe('ReleaseCardsBlock', () => {
  it('renders a card with its chip, text, area, date and a full progress bar', () => {
    render(
      <ReleaseCardsBlock
        cards={[
          {
            tag: 'audit',
            area: 'Audit report',
            title: 'RevR 21',
            description: 'Add the statement to the audit report.',
            date: '24 Sep 2026',
          },
        ]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'RevR 21' })).toBeInTheDocument()
    expect(screen.getByText('Audit')).toHaveClass('bg-tag-purple')
    expect(screen.getByText('Audit report')).toBeInTheDocument()
    expect(screen.getByText('24 Sep 2026')).toBeInTheDocument()
    expect(screen.getByText('Shipped')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
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
    expect(screen.getByText('Analysis')).toHaveClass('bg-tag-green')
    expect(screen.getByText('Customer Service')).toHaveClass('bg-tag-yellow')
  })

  it('shows a partly filled bar with its own label', () => {
    render(<ReleaseCardsBlock cards={[{ title: 'X', progress: 60, status: 'In progress' }]} />)
    expect(screen.getByText('In progress')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '60')
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
})
