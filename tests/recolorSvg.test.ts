import { describe, expect, it } from 'vitest'
import { recolorSvg } from '@/lib/recolorSvg'

const INK = '#ffffff'

describe('recolorSvg', () => {
  it('swaps near-black fills for the ink and leaves other colors alone', () => {
    const svg =
      '<svg viewBox="0 0 24 24" fill="#7B3FE4"><path fill="#101829" d="M0"/><path fill="#7B3FE4" d="M1"/><path fill="black" d="M2"/><path fill="#000" d="M3"/></svg>'
    const out = recolorSvg(svg, INK)
    expect(out).toContain('fill="#7B3FE4"')
    expect(out).not.toContain('#101829')
    expect(out).not.toContain('fill="black"')
    expect(out).not.toContain('fill="#000"')
    expect(out.match(/fill="#ffffff"/g)?.length).toBe(3)
  })

  it('handles styles and strokes, not just fill attributes', () => {
    const out = recolorSvg(
      '<svg fill="none"><path style="stroke:#1f1f1f;fill:#d0b3ff" d="M0"/></svg>',
      INK,
    )
    expect(out).toContain('stroke:#ffffff')
    expect(out).toContain('fill:#d0b3ff')
  })

  it('gives a fill-less SVG the ink, since its default fill is black', () => {
    const out = recolorSvg('<svg viewBox="0 0 24 24"><path d="M0"/></svg>', INK)
    expect(out).toContain('<svg viewBox="0 0 24 24" fill="#ffffff">')
  })

  it('does not touch fill="none" or url() references', () => {
    const out = recolorSvg('<svg fill="none"><path fill="url(#a1b)" d="M0"/></svg>', INK)
    expect(out).toContain('fill="none"')
    expect(out).toContain('url(#a1b)')
  })
})
