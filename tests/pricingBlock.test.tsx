import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PricingBlock } from '@/components/blocks/PricingBlock'

describe('PricingBlock', () => {
  it('renders each plan with its features and CTA', () => {
    render(
      <PricingBlock
        heading="Pricing"
        plans={[
          {
            name: 'License',
            description: 'Per-seat pricing.',
            features: ['Full block library', 'Email support'],
            ctaLabel: 'Get started',
            ctaHref: '#license',
          },
          {
            name: 'Enterprise',
            description: 'Custom terms.',
            features: ['Volume discounts', 'Dedicated support'],
            ctaLabel: 'Contact sales',
            ctaHref: '#enterprise',
            featured: true,
          },
        ]}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Pricing' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'License' })).toBeInTheDocument()
    expect(screen.getByText('Full block library')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '#license')
    expect(screen.getByRole('heading', { name: 'Enterprise' })).toBeInTheDocument()
    expect(screen.getByText('Volume discounts')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact sales' })).toHaveAttribute('href', '#enterprise')
  })

  it('renders nothing when there are no plans', () => {
    const { container } = render(<PricingBlock heading="Empty" plans={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
