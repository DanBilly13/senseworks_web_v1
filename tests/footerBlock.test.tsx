import { describe, expect, it } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FooterBlock } from '@/components/blocks/FooterBlock'

describe('FooterBlock', () => {
  it('renders link columns, legal links, social links, and copyright', () => {
    render(
      <FooterBlock
        linkColumns={[{ title: 'Product', links: [{ label: 'Pricing', href: '#pricing' }] }]}
        legalLinks={[{ label: 'Privacy', href: '#privacy' }]}
        socialLinks={[{ platform: 'github', href: 'https://github.com/senseworks' }]}
        copyrightText="© Senseworks"
      />,
    )
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '#pricing')
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '#privacy')
    expect(screen.getByRole('link', { name: 'github' })).toHaveAttribute(
      'href',
      'https://github.com/senseworks',
    )
    expect(screen.getByText('© Senseworks')).toBeInTheDocument()
  })

  it('shows an inline confirmation on newsletter submit instead of navigating (D9)', () => {
    render(<FooterBlock newsletterHeading="Stay in the loop" />)
    const input = screen.getByPlaceholderText('you@company.com')
    fireEvent.change(input, { target: { value: 'dan@senseworks.io' } })
    fireEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    expect(screen.getByText(/you.re on the list/i)).toBeInTheDocument()
  })

  it('always renders even with no content — structural chrome, not D7 content', () => {
    const { container } = render(<FooterBlock />)
    expect(container.querySelector('footer')).toBeInTheDocument()
  })
})
