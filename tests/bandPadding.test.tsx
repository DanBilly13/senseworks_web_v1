import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import type { PageBlock } from '@/lib/sanity/getPage'

const block = (type: string, fields: Record<string, unknown>) =>
  ({ _type: type, _key: type, ...fields }) as unknown as PageBlock
const headline = (fields: Record<string, unknown> = {}) => block('sectionHeadlineBlock', { headline: 'Heading', ...fields })
const bento = (fields: Record<string, unknown> = {}) => block('bentoGridBlock', { items: [{ heading: 'Card' }], ...fields })

const sections = (container: HTMLElement) => Array.from(container.querySelectorAll('section'))

describe('Background blocks: padding exactly as set, no automatic rules', () => {
  it("uses each block's own Top/Bottom padding and Section spacing, even next to the same background", () => {
    const { container } = render(
      <BlockRenderer
        blocks={[
          headline({ tone: 'inverse', paddingTop: 'loose', paddingBottom: 'tight', spacing: 'none' }),
          bento({ tone: 'inverse', paddingTop: 'none', paddingBottom: 'medium', spacing: 'loose' }),
        ]}
      />,
    )
    const [h, b] = sections(container)
    expect(h.className).toMatch(/pt-section-gap-loose/)
    expect(h.className).toMatch(/pb-section-gap-tight/)
    expect(h.parentElement?.className).toMatch(/bg-foreground .*mb-none/)
    expect(b.className).toMatch(/pt-none/)
    expect(b.className).toMatch(/pb-section-gap-medium/)
    expect(b.parentElement?.className).toMatch(/mb-section-gap-loose/)
  })

  it('honors padding without a background too', () => {
    const { container } = render(<BlockRenderer blocks={[headline({ paddingBottom: 'medium' })]} />)
    expect(sections(container)[0].className).toMatch(/pb-section-gap-medium/)
  })

  it('left unset: no padding without a background, Medium with one', () => {
    const { container } = render(<BlockRenderer blocks={[headline(), bento({ tone: 'accent' })]} />)
    const [h, b] = sections(container)
    expect(h.className).toMatch(/pt-none/)
    expect(h.className).toMatch(/pb-none/)
    expect(b.className).toMatch(/pt-section-gap-medium/)
    expect(b.className).toMatch(/pb-section-gap-medium/)
  })

  it("reads Card Grid's background from its own field (its tone is the cards' style)", () => {
    const { container } = render(
      <BlockRenderer blocks={[block('cardGridBlock', { background: 'inverse', tone: 'accent', items: [{ eyebrow: 'E', heading: 'Card' }] })]} />,
    )
    expect(container.querySelector('div.bg-foreground')).not.toBeNull()
  })
})
