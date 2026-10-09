import { describe, expect, it } from 'vitest'
import { slotOf, svgLayer } from '@/lib/svgLayer'

describe('slotOf', () => {
  it('sorts black, white and coloured values into their slots', () => {
    expect(slotOf('#101829')).toBe('ink')
    expect(slotOf('black')).toBe('ink')
    expect(slotOf('currentColor')).toBe('ink')
    expect(slotOf('#ffffff')).toBe('paper')
    expect(slotOf('white')).toBe('paper')
    expect(slotOf('#e0e0e0')).toBe('paper')
    // The three product accents, the Senseworks yellow included even
    // though it is nearly as light as white.
    expect(slotOf('#FBFEAC')).toBe('accent')
    expect(slotOf('#B38AFF')).toBe('accent')
    expect(slotOf('#5EEC94')).toBe('accent')
  })

  it('leaves none, transparent and url() alone', () => {
    expect(slotOf('none')).toBeNull()
    expect(slotOf('transparent')).toBeNull()
    expect(slotOf('url')).toBeNull()
  })
})

describe('svgLayer', () => {
  const svg =
    '<svg viewBox="0 0 24 24"><path fill="#101829" d="M0"/><path fill="#FBFEAC" d="M1"/><path fill="#fff" d="M2"/></svg>'

  it('makes the chosen slot white and every other slot black', () => {
    expect(svgLayer(svg, 'accent')).toBe(
      '<svg viewBox="0 0 24 24" fill="#000000"><path fill="#000000" d="M0"/><path fill="#ffffff" d="M1"/><path fill="#000000" d="M2"/></svg>',
    )
    expect(svgLayer(svg, 'paper')).toContain('<path fill="#ffffff" d="M2"/>')
  })

  it('gives a fill-less SVG to the ink slot, since its default fill is black', () => {
    expect(svgLayer('<svg viewBox="0 0 24 24"><path d="M0"/></svg>', 'ink')).toContain(
      '<svg viewBox="0 0 24 24" fill="#ffffff">',
    )
    expect(svgLayer('<svg viewBox="0 0 24 24"><path d="M0"/></svg>', 'accent')).toContain(
      '<svg viewBox="0 0 24 24" fill="#000000">',
    )
  })

  it('handles styles and strokes, and keeps alpha', () => {
    const out = svgLayer('<svg fill="none"><path style="stroke:#1f1f1f;fill:#d0b3ff80" d="M0"/></svg>', 'accent')
    expect(out).toContain('stroke:#000000')
    expect(out).toContain('fill:rgba(255,255,255,0.5019607843137255)')
  })

  it('does not touch fill="none" or url() references', () => {
    const out = svgLayer('<svg fill="none"><path fill="url(#a1b)" d="M0"/></svg>', 'ink')
    expect(out).toContain('fill="none"')
    expect(out).toContain('url(#a1b)')
  })
})
