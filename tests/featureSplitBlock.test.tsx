import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureSplitBlock } from '@/components/blocks/FeatureSplitBlock'

describe('FeatureSplitBlock', () => {
  it('renders heading and body', () => {
    render(<FeatureSplitBlock heading="A feature" body="Some body copy" />)
    expect(screen.getByRole('heading', { name: 'A feature' })).toBeInTheDocument()
    expect(screen.getByText('Some body copy')).toBeInTheDocument()
  })

  it('defaults to image-left layout (row, not reversed)', () => {
    const { container } = render(<FeatureSplitBlock heading="A feature" />)
    const row = container.querySelector('section > div')
    expect(row).toHaveClass('md:flex-row')
    expect(row).not.toHaveClass('md:flex-row-reverse')
  })

  it('mirrors to image-right layout when imagePosition="right"', () => {
    const { container } = render(<FeatureSplitBlock heading="A feature" imagePosition="right" />)
    const row = container.querySelector('section > div')
    expect(row).toHaveClass('md:flex-row-reverse')
    expect(row).not.toHaveClass('md:flex-row')
  })
})
