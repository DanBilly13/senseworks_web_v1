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

  it('Width: Content makes the background a page-column panel, Full (or unset) fills the screen', () => {
    const { container } = render(
      <BlockRenderer
        blocks={[
          headline({ tone: 'inverse', width: 'content' }),
          headline({ tone: 'inverse', width: 'full' }),
          headline({ tone: 'inverse' }),
        ]}
      />,
    )
    const [content, full, unset] = sections(container)
    expect(content.parentElement?.className).toMatch(/band-panel .*md:rounded-lg .*bg-foreground/)
    expect(content.parentElement?.parentElement?.className).toMatch(/max-w-page/)
    expect(full.parentElement?.className).toMatch(/bg-foreground .*mb-/)
    expect(unset.parentElement?.className).toMatch(/bg-foreground .*mb-/)
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

describe('Content width panels that touch', () => {
  const panel = (fields: Record<string, unknown> = {}) =>
    block('sectionHeadlineBlock', { headline: 'Heading', tone: 'inverse', width: 'content', spacing: 'none', ...fields })

  it('round only the outer corners of a run of joined panels', () => {
    const { container } = render(
      <BlockRenderer
        blocks={[
          { ...panel(), _key: 'a' },
          { ...panel(), _key: 'b' },
          { ...panel({ hidden: true }), _key: 'hidden' },
          { ...panel({ spacing: 'loose' }), _key: 'c' },
          { ...panel(), _key: 'd' },
        ]}
      />,
    )
    const panels = Array.from(container.querySelectorAll('.band-panel')).map((p) => p.className)
    expect(panels).toHaveLength(4)
    // a: top of the run; b, c: middle and bottom (the hidden block is skipped).
    expect(panels[0]).toMatch(/md:rounded-b-none/)
    expect(panels[0]).not.toMatch(/rounded-t-none/)
    expect(panels[1]).toMatch(/md:rounded-t-none/)
    expect(panels[1]).toMatch(/md:rounded-b-none/)
    expect(panels[2]).toMatch(/md:rounded-t-none/)
    expect(panels[2]).not.toMatch(/rounded-b-none/)
    // d: after spacing, its own fully rounded panel.
    expect(panels[3]).not.toMatch(/none/)
  })

  it("doesn't join different backgrounds", () => {
    const { container } = render(
      <BlockRenderer blocks={[{ ...panel(), _key: 'a' }, { ...panel({ tone: 'accent' }), _key: 'b' }]} />,
    )
    const panels = Array.from(container.querySelectorAll('.band-panel')).map((p) => p.className)
    expect(panels.some((c) => /rounded-[tb]-none/.test(c))).toBe(false)
  })
})
