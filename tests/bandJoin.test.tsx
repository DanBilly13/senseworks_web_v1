import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import type { PageBlock } from '@/lib/sanity/getPage'

const headline = (tone?: string) =>
  ({ _type: 'sectionHeadlineBlock', _key: 'h', headline: 'Heading', tone, paddingBottom: 'tight' }) as unknown as PageBlock
const bento = (tone?: string) =>
  ({ _type: 'bentoGridBlock', _key: 'b', tone, items: [{ heading: 'Card' }] }) as unknown as PageBlock

describe('Section Headline + Bento Grid backgrounds', () => {
  it('joins neighbours with the same background into one band', () => {
    const { container } = render(<BlockRenderer blocks={[headline('inverse'), bento('inverse')]} />)
    const [first, second] = Array.from(container.querySelectorAll(':scope > div.bg-foreground'))
    // No gap outside the color between them: the headline's Bottom
    // padding is the space inside it, and the Bento Grid drops its top
    // padding.
    expect(first.className).not.toMatch(/mb-section-gap/)
    expect(first.querySelector('section')?.className).toMatch(/pb-section-gap-tight/)
    expect(second.querySelector('section')?.className).toMatch(/pt-none/)
    expect(second.className).toMatch(/mb-section-gap-loose/)
  })

  it('keeps different backgrounds as separate bands', () => {
    const { container } = render(<BlockRenderer blocks={[headline('inverse'), bento('accent')]} />)
    expect(container.querySelector(':scope > div.bg-foreground')?.className).toMatch(/mb-section-gap-loose/)
    expect(container.querySelector(':scope > div.bg-accent section')?.className).toMatch(/pt-section-gap-medium/)
  })

  it("joins a Card Grid by its own Background field (its tone is the cards' style)", () => {
    const cards = { _type: 'cardGridBlock', _key: 'c', background: 'inverse', tone: 'accent', items: [{ eyebrow: 'E', heading: 'Card' }] } as unknown as PageBlock
    const { container } = render(<BlockRenderer blocks={[headline('inverse'), cards]} />)
    const fills = container.querySelectorAll(':scope > div.bg-foreground')
    expect(fills).toHaveLength(2)
    expect(fills[1].querySelector('section')?.className).toMatch(/pt-none/)
  })

  it('joins a Feature Grid with the same background', () => {
    const features = { _type: 'featureGridBlock', _key: 'f', tone: 'accent', items: [{ title: 'Feature' }] } as unknown as PageBlock
    const { container } = render(<BlockRenderer blocks={[headline('accent'), features]} />)
    const fills = container.querySelectorAll(':scope > div.bg-accent')
    expect(fills).toHaveLength(2)
    expect(fills[1].querySelector('section')?.className).toMatch(/pt-none/)
  })

  it('has no fill without a background', () => {
    const { container } = render(<BlockRenderer blocks={[headline(), bento()]} />)
    expect(container.querySelector('.bg-foreground, .bg-accent')).toBeNull()
  })
})
