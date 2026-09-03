import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CtaBannerBlock } from '@/components/blocks/CtaBannerBlock'

describe('CtaBannerBlock', () => {
  it('renders the heading, body, primary CTA, and optional secondary CTA', () => {
    render(
      <CtaBannerBlock
        heading="Start assembling your next page"
        body="Every block is ready to drop onto a page today."
        ctaLabel="Get started"
        ctaHref="#get-started"
        secondaryCtaLabel="View components"
        secondaryCtaHref="#components"
      />,
    )
    expect(
      screen.getByRole('heading', { name: 'Start assembling your next page' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Every block is ready to drop onto a page today.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute(
      'href',
      '#get-started',
    )
    expect(screen.getByRole('link', { name: 'View components' })).toHaveAttribute(
      'href',
      '#components',
    )
  })

  it('omits the secondary CTA when not provided', () => {
    render(<CtaBannerBlock heading="Get started" ctaLabel="Go" ctaHref="#go" />)
    expect(screen.getByRole('link', { name: 'Go' })).toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(1)
  })
})
