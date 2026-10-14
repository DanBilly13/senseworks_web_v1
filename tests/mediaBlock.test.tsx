import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MediaBlock } from '@/components/blocks/MediaBlock'

describe('MediaBlock width', () => {
  it('is content width with rounded corners by default', () => {
    const { container } = render(<MediaBlock />)
    expect(container.querySelector('.md\\:rounded-lg')).not.toBeNull()
    expect(container.querySelector('.h-cta-banner-image')).toBeNull()
  })

  it('runs full screen width at the CTA Banner image height when width is full', () => {
    const { container } = render(<MediaBlock width="full" />)
    const box = container.querySelector('.h-cta-banner-image')
    expect(box).not.toBeNull()
    expect(box).toHaveClass('w-full')
    expect(container.querySelector('.max-w-page')).toBeNull()
  })

  it('keeps the overlay text at full width, lined up with the page content', () => {
    render(<MediaBlock width="full" headline="Every upload, matched" />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Every upload, matched' })
    expect(heading.closest('.max-w-page')).not.toBeNull()
  })
})
