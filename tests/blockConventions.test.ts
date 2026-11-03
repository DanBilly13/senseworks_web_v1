import { describe, expect, it } from 'vitest'
import { schemaTypes } from '@/sanity/schemaTypes'

/* eslint-disable @typescript-eslint/no-explicit-any */
const blocks = (schemaTypes as any[]).filter((t) => t.name.endsWith('Block') && !['headerBlock', 'footerBlock'].includes(t.name))

// The Studio house rules (blockConventions.ts) hold for every page block.
describe('block conventions', () => {
  it.each(blocks.map((b) => [b.name, b]))('%s has Content and Design tabs, Hide first, Section spacing last', (_, block: any) => {
    expect(block.groups.map((g: any) => g.name)).toEqual(['content', 'design'])
    expect(block.fields[0].name).toBe('hidden')
    for (const f of block.fields) expect(f.group).toBeDefined()
    const names = block.fields.map((f: any) => f.name)
    if (names.includes('spacing')) expect(names.at(-1)).toBe('spacing')
    // Content before Design.
    const firstDesign = block.fields.findIndex((f: any) => f.group === 'design')
    expect(block.fields.slice(firstDesign).every((f: any) => f.group === 'design')).toBe(true)
  })

  it('writes no "(default)" into option labels', () => {
    const labels = blocks.flatMap((b) => b.fields.flatMap((f: any) => (f.options?.list ?? []).map((o: any) => o.title)))
    expect(labels.filter((t: string) => /\(default/i.test(t ?? ''))).toEqual([])
  })

  it('gives every headline two lines', () => {
    for (const b of blocks) {
      const headline = b.fields.find((f: any) => f.name === 'headline' || f.name === 'heading')
      if (headline) expect(headline.fields[0]).toMatchObject({ type: 'text', rows: 2 })
    }
  })
})
