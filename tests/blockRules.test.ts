import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { schemaTypes } from '@/sanity/schemaTypes'
import { page } from '@/sanity/schemaTypes/page'
import { COMPONENT_LIBRARY } from '@/sanity/structure/componentLibrary'

// The rest of the Studio house rules (STUDIO-CONVENTIONS.md): the ones a
// block's author has to follow, checked so a new block can't quietly
// skip one. blockConventions.test.ts covers what's applied automatically.

/* eslint-disable @typescript-eslint/no-explicit-any */
const blocks = (schemaTypes as any[]).filter((t) => t.name.endsWith('Block') && !['headerBlock', 'footerBlock'].includes(t.name))
const blocksField = (page as any).fields.find((f: any) => f.name === 'blocks')
const pageBlockTypes: string[] = blocksField.of.map((m: any) => m.type)
const menuGroups: { name: string; of: string[] }[] = blocksField.options.insertMenu.groups
const rendererSource = readFileSync(join(__dirname, '../src/components/blocks/BlockRenderer.tsx'), 'utf8')
const rendered = new Set(
  [...rendererSource.slice(rendererSource.indexOf('const BLOCK_COMPONENTS')).split('\n}')[0].matchAll(/^\s+(\w+Block):/gm)].map((m) => m[1]),
)

describe('every block is wired up', () => {
  it.each(blocks.map((b) => [b.name]))('%s: page list, one menu group, BlockRenderer, Component Library', (name: string) => {
    expect(pageBlockTypes, 'in the page’s blocks list (page.ts)').toContain(name)
    expect(menuGroups.filter((g) => g.of.includes(name)).map((g) => g.name), 'in exactly one Add item group (page.ts insertMenu)').toHaveLength(1)
    expect(rendered.has(name), 'in BlockRenderer’s BLOCK_COMPONENTS').toBe(true)
    expect(COMPONENT_LIBRARY.some((e) => e.type === name), 'in the Component Library (structure/componentLibrary.ts)').toBe(true)
  })
})

describe('design settings', () => {
  it('each have help text', () => {
    const missing = blocks.flatMap((b) => b.fields.filter((f: any) => f.group === 'design' && !f.description).map((f: any) => `${b.name}.${f.name}`))
    expect(missing).toEqual([])
  })

  // None · Light grey · White · Dark · Accent · Accent gradient · Dark accent gradient · Image
  const BACKGROUNDS = ['none', 'light', 'white', 'dark', 'accent', 'accentGradient', 'accentDark', 'image']
  it('offer backgrounds from the standard set, in the standard order', () => {
    for (const b of blocks) {
      // (A Mobile tab's Background is 'Same as desktop' or 'None', not a colour.)
      for (const f of b.fields.filter((f: any) => f.title === 'Background' && f.options?.list && f.group !== 'mobile')) {
        const values: string[] = f.options.list.map((o: any) => o.value)
        expect(values.every((v) => BACKGROUNDS.includes(v)), `${b.name}.${f.name}: ${values}`).toBe(true)
        expect(values, `${b.name}.${f.name} order`).toEqual([...values].sort((x, y) => BACKGROUNDS.indexOf(x) - BACKGROUNDS.indexOf(y)))
      }
    }
  })

  // The same setting starts the same way on every block. A block that
  // starts differently is listed here, with why, so it's a decision.
  const SHARED_DEFAULTS: Record<string, string> = { spacing: 'loose', headingLayout: 'stacked', titleSize: 'h4', imagePosition: 'left', align: 'center' }
  const DELIBERATE: Record<string, string> = {
    'ctaBannerBlock.spacing': 'none: the banner closes the page and sits flush on what follows',
    'heroAllyBlock.spacing': 'medium: the gap heroes have always had below them',
    'heroBackdropBlock.spacing': 'medium: the gap heroes have always had below them',
    'mediaCarouselBlock.headingLayout': 'inline: a slide’s title and caption read as one line',
    'horizontalScrollStackMediumBlock.headingLayout': 'inline: a slide’s title and caption read as one line',
    'featureSplitDarkBlock.imagePosition': 'right: designed with the image on the right',
    'fiftyFiftyBannerBlock.imagePosition': 'right: designed with the image on the right',
    'heroAllyBlock.align': 'left: designed with the button beside Ally, not over her',
    'mediaBlock.align': 'left: a caption under an image reads from the left',
  }
  it('start the same way on every block, unless listed as deliberate', () => {
    const differing = blocks.flatMap((b) =>
      b.fields
        .filter((f: any) => f.name in SHARED_DEFAULTS && f.initialValue !== undefined && f.initialValue !== SHARED_DEFAULTS[f.name])
        .map((f: any) => `${b.name}.${f.name}`),
    )
    expect(differing.filter((key) => !(key in DELIBERATE))).toEqual([])
    // And nothing listed that no longer differs.
    expect(Object.keys(DELIBERATE).filter((key) => !differing.includes(key))).toEqual([])
  })
})

describe('optional images', () => {
  // `if (media)` is true for a picture that was cleared in Studio (an
  // empty media/image object stays behind), so blocks ask hasMedia() /
  // hasImage() instead (lib/sanity/media.ts).
  const dirs = ['blocks', 'ui', 'team'].map((d) => join(__dirname, '../src/components', d))
  const files = dirs.flatMap((dir) => readdirSync(dir).filter((f) => f.endsWith('.tsx')).map((f) => join(dir, f)))
  const BARE_CHECK = /\{\s*[\w.?]*(?:media|Media|image|Image|photo|Photo)\??\s*&&|!!\s*[\w.?]*\.(?:image|media)\b/
  it('are checked with hasMedia() / hasImage(), not by whether the field exists', () => {
    const found = files.flatMap((file) =>
      readFileSync(file, 'utf8')
        .split('\n')
        .map((line, i) => ({ line: line.trim(), at: `${file.split('/src/')[1]}:${i + 1}` }))
        .filter(({ line }) => !line.startsWith('//') && !line.startsWith('*') && BARE_CHECK.test(line))
        .filter(({ line }) => !/\{\s*(has|with|show|is)[A-Z]/.test(line) && !/has(Media|Image)\(/.test(line))
        .map(({ at, line }) => `${at}  ${line}`),
    )
    expect(found).toEqual([])
  })
})
