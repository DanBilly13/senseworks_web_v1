import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CaseStudyGridBlock } from '@/components/blocks/CaseStudyGridBlock'

describe('CaseStudyGridBlock', () => {
  it('renders each case study with its quote, person, and link', () => {
    render(
      <CaseStudyGridBlock
        heading="A closer look"
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
    expect(screen.getByRole('heading', { name: 'A closer look' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Acme Corp logo' })).toBeInTheDocument()
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

  it('renders nothing when there are no case studies', () => {
    const { container } = render(<CaseStudyGridBlock heading="Empty" items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
