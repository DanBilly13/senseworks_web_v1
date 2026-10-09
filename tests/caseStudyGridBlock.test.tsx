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

  it('colors the link with the accent on a dark card', () => {
    render(
      <CaseStudyGridBlock
        tone="dark"
        items={[{ companyName: 'Acme Corp', ctaLabel: 'Read their story', ctaHref: '#acme' }]}
      />,
    )
    const link = screen.getByRole('link', { name: /Read their story/ })
    expect(link).toHaveAttribute('href', '#acme')
    expect(link.className).toContain('text-accent')
    expect(link.textContent).toContain('→')
  })

  it('renders prev/next controls, and an optional heading beside them', () => {
    render(<CaseStudyGridBlock heading="How firms audit" items={[{ companyName: 'Acme Corp' }]} />)
    expect(screen.getByRole('heading', { level: 2, name: 'How firms audit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous case studies' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next case studies' })).toBeInTheDocument()
  })

  it('renders nothing when there are no case studies', () => {
    const { container } = render(<CaseStudyGridBlock items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
