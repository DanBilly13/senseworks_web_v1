import { describe, expect, it } from 'vitest'
import { needsUpgrade, upgradeBlock } from '@/lib/sanity/upgradeBlock'

describe('upgradeBlock', () => {
  it('renames old fields and values', () => {
    expect(upgradeBlock({ _type: 'ctaBannerBlock', heading: 'Hi', tone: 'inverse' })).toEqual({ _type: 'ctaBannerBlock', headline: 'Hi', tone: 'dark' })
    expect(upgradeBlock({ _type: 'heroBlock', subhead: 'Text', tone: 'inverse' })).toEqual({ _type: 'heroBlock', body: 'Text', tone: 'dark' })
    expect(upgradeBlock({ _type: 'sectionHeadlineBlock', size: 'h1' })).toEqual({ _type: 'sectionHeadlineBlock', headlineSize: 'h1' })
    expect(upgradeBlock({ _type: 'cardGridBlock', headingLevel: 'h3', tone: 'default', background: 'inverse' })).toEqual({
      _type: 'cardGridBlock',
      titleSize: 'h3',
      tone: 'white',
      background: 'dark',
    })
  })

  it('leaves new-shape blocks, other values and other blocks alone', () => {
    const block = { _type: 'ctaBannerBlock', headline: 'Hi', tone: 'accent' }
    expect(upgradeBlock(block)).toEqual(block)
    expect(needsUpgrade(block)).toBe(false)
    // Card items keep their own `heading`.
    const grid = { _type: 'cardGridBlock', items: [{ heading: 'Card' }] }
    expect(upgradeBlock(grid)).toEqual(grid)
    // Feature Split — Dark's subhead is its own field.
    expect(upgradeBlock({ _type: 'featureSplitDarkBlock', subhead: 'S' })).toEqual({ _type: 'featureSplitDarkBlock', subhead: 'S' })
  })

  it('keeps the new field when both are set', () => {
    expect(upgradeBlock({ _type: 'heroTextBlock', subhead: 'old', body: 'new' })).toEqual({ _type: 'heroTextBlock', body: 'new' })
  })
})
