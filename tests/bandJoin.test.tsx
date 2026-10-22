import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import type { PageBlock } from '@/lib/sanity/getPage'

const headline = (tone?: string) =>
  ({ _type: 'sectionHeadlineBlock', _key: 'h', headline: 'Heading', tone, spacing: 'tight' }) as unknown as PageBlock
const bento = (tone?: string) =>
  ({ _type: 'bentoGridBlock', _key: 'b', tone, items: [{ heading: 'Card' }] }) as unknown as PageBlock

describe('Section Headline + Bento Grid backgrounds', () => {
  it('joins neighbours with the same background into one band', () => {
    const { container } = render(<BlockRenderer blocks={[headline('inverse'), bento('inverse')]} />)
    const [first, second] = Array.from(container.querySelectorAll(':scope > div.bg-foreground'))
    // No gap outside the color between them: the headline's spacing is
    // inside it, and the Bento Grid drops its top padding.
    expect(first.className).not.toMatch(/mb-section-gap/)
    expect(first.querySelector('section')?.className).toMatch(/pb-section-gap-tight/)
    expect(second.querySelector('section')?.className).toMatch(/pt-none/)
    expect(second.className).toMatch(/mb-section-gap-loose/)
  })

  it('keeps different backgrounds as separate bands', () => {
    const { container } = render(<BlockRenderer blocks={[headline('inverse'), bento('accent')]} />)
    expect(container.querySelector(':scope > div.bg-foreground')?.className).toMatch(/mb-section-gap-tight/)
    expect(container.querySelector(':scope > div.bg-accent section')?.className).toMatch(/pt-section-gap-medium/)
  })

  it('has no fill without a background', () => {
    const { container } = render(<BlockRenderer blocks={[headline(), bento()]} />)
    expect(container.querySelector('.bg-foreground, .bg-accent')).toBeNull()
  })
})
