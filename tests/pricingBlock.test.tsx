import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PricingBlock } from '@/components/blocks/PricingBlock'

vi.mock('next/navigation', () => ({ usePathname: () => '/sv/pris' }))

describe('PricingBlock', () => {
  it('renders each plan with its features and CTA', () => {
    render(
      <PricingBlock
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
    expect(screen.getByRole('heading', { name: 'License' })).toBeInTheDocument()
    expect(screen.getByText('Full block library')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get started' })).toHaveAttribute('href', '#license')
    expect(screen.getByRole('heading', { name: 'Enterprise' })).toBeInTheDocument()
    expect(screen.getByText('Volume discounts')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact sales' })).toHaveAttribute('href', '#enterprise')
  })

  it('shows a price with its period and note, and a product chip in the page language', () => {
    render(
      <PricingBlock
        plans={[{ tag: 'audit', name: 'Senseworks Revision', price: '1 699 kr', pricePeriod: 'per månad', priceNote: 'Faktureras årsvis' }]}
      />,
    )
    expect(screen.getByText('1 699 kr')).toHaveClass('text-h2')
    expect(screen.getByText('per månad')).toBeInTheDocument()
    expect(screen.getByText('Faktureras årsvis')).toBeInTheDocument()
    expect(screen.getByText('Revision')).toHaveClass('bg-tag-purple')
  })

  it('renders nothing when there are no plans', () => {
    const { container } = render(<PricingBlock plans={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
