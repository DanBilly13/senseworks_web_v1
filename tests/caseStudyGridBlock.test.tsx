import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CaseStudyGridBlock } from '@/components/blocks/CaseStudyGridBlock'

describe('CaseStudyGridBlock', () => {
  it('renders each case study with its quote, person, and link', () => {
    render(
      <CaseStudyGridBlock
        items={[
          {
            companyName: 'Acme Corp',
            quote: 'We rebuilt our whole marketing site in a week.',
            personName: 'Priya Nair',
            personRole: 'Marketing',
            ctaLabel: 'Read their story',
            ctaHref: '#acme',
          },
        ]}
      />,
    )
    // No logo uploaded, so the company name stands in for it.
    expect(screen.getByRole('heading', { name: 'Acme Corp' })).toBeInTheDocument()
    expect(
      screen.getByText(/We rebuilt our whole marketing site in a week/),
    ).toBeInTheDocument()
    expect(screen.getByText('Priya Nair')).toBeInTheDocument()
    expect(screen.getByText('Marketing')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Read their story/ })).toHaveAttribute(
      'href',
      '#acme',
    )
  })

  it('applies the dark and accent card styles', () => {
    const items = [{ companyName: 'Acme Corp', quote: 'Quote.' }]
    const { container, rerender } = render(<CaseStudyGridBlock tone="dark" items={items} />)
    expect(container.querySelector('.bg-foreground')).not.toBeNull()
    rerender(<CaseStudyGridBlock tone="accent" items={items} />)
    expect(container.querySelector('.bg-accent')).not.toBeNull()
  })

  it('turns the link into an accent button on a dark card', () => {
    render(
      <CaseStudyGridBlock
        tone="dark"
        items={[{ companyName: 'Acme Corp', ctaLabel: 'Read their story', ctaHref: '#acme' }]}
      />,
    )
    const link = screen.getByRole('link', { name: /Read their story/ })
    expect(link).toHaveAttribute('href', '#acme')
    expect(link.className).toContain('bg-accent')
  })

  it('renders nothing when there are no case studies', () => {
    const { container } = render(<CaseStudyGridBlock items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
