import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CaseStudyGridBlock } from '@/components/blocks/CaseStudyGridBlock'
import { fakeOverflowingScroller } from './helpers/overflow'

vi.mock('next/navigation', () => ({ usePathname: () => '/sv/home' }))

const stories = [
  { companyName: 'Retora', slug: 'retora', products: ['audit', 'analytics'], summary: 'Replaced manual Excel analytics.' },
  { companyName: 'Göteborgs Revision', slug: 'goteborgs-revision', products: ['audit'] },
]

describe('CaseStudyGridBlock', () => {
  it('renders a story card per story, linking to the story in the page language', () => {
    render(<CaseStudyGridBlock stories={stories} />)
    expect(screen.getByRole('heading', { name: 'Retora' })).toBeInTheDocument()
    expect(screen.getByText('Replaced manual Excel analytics.')).toBeInTheDocument()
    // Products as tags, named as on Swedish pages.
    // Both stories use Audit ("Revision"); only Retora uses Analytics.
    expect(screen.getAllByText('Revision')).toHaveLength(2)
    expect(screen.getAllByText('Analys')).toHaveLength(1)
    expect(screen.getByRole('link', { name: /Retora/ })).toHaveAttribute('href', '/sv/customer-stories/retora')
  })

  it('applies the dark card style', () => {
    const { container } = render(<CaseStudyGridBlock tone="dark" stories={stories} />)
    expect(container.querySelector('a.bg-foreground')).not.toBeNull()
  })

  it('renders nothing when there are no stories', () => {
    const { container } = render(<CaseStudyGridBlock stories={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})

describe('CaseStudyGridBlock arrows', () => {
  describe('when the cards overflow', () => {
    fakeOverflowingScroller()

    it('shows prev/next controls', () => {
      render(<CaseStudyGridBlock stories={stories} />)
      expect(screen.getByRole('button', { name: 'Previous case studies' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next case studies' })).toBeInTheDocument()
    })
  })

  it('hides them when every card already fits', () => {
    render(<CaseStudyGridBlock stories={stories} />)
    expect(screen.queryByRole('button', { name: 'Next case studies' })).toBeNull()
  })
})
