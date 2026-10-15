import { describe, expect, it } from 'vitest'
import { schemaTypes } from '@/sanity/schemaTypes'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Def = Record<string, any>
const byName = new Map((schemaTypes as Def[]).map((type) => [type.name, type]))
const field = (def: Def, name: string): Def => def.fields.find((f: Def) => f.name === name)
const isPair = (def: Def) => def.type === 'object' && def.fields?.map((f: Def) => f.name).join() === 'en,sv'

describe('localizeSchema', () => {
  it('turns text fields into English/Swedish pairs, keeping English validation and wrapping initial values', () => {
    const faq = byName.get('faqAccordionBlock')!
    expect(isPair(field(faq, 'heading'))).toBe(true)
    expect(field(faq, 'heading').initialValue).toEqual({ en: 'Frequently asked questions' })
    const item = field(faq, 'items').of[0]
    const question = field(item, 'question')
    expect(isPair(question)).toBe(true)
    expect(question.fields[0].validation).toBeTypeOf('function')
    expect(question.fields[1].validation).toBeUndefined()
    expect(field(item, 'answer').fields[0].rows).toBe(3)
  })

  it('leaves pick-lists, links and identifiers alone', () => {
    const page = byName.get('page')!
    expect(isPair(field(page, 'title'))).toBe(true)
    expect(field(page, 'theme').type).toBe('string')
    expect(field(page, 'language').type).toBe('string')
    const media = byName.get('media')!
    expect(field(media, 'mediaType').type).toBe('string')
    expect(isPair(field(media, 'alt'))).toBe(true)
  })

  it('turns a list of plain strings into a list of pairs', () => {
    const plan = field(byName.get('pricingBlock')!, 'plans').of[0]
    expect(isPair(field(plan, 'features').of[0])).toBe(true)
  })

  it('points previews at the English value', () => {
    expect(byName.get('heroBlock')!.preview.select.title).toBe('headline.en')
    expect(byName.get('featureListBlock')!.preview.select.title).toBe('items.0.label.en')
    expect(byName.get('mediaBlock')!.preview.select.alt).toBe('media.alt.en')
    expect(byName.get('mediaBlock')!.preview.select.mediaType).toBe('media.mediaType')
    expect(byName.get('pricingBlock')!.preview.select.title).toBe('plans.0.name.en')
  })

  it('leaves non-page documents unchanged', () => {
    expect(field(byName.get('customerStory')!, 'title').type).toBe('string')
  })
})

describe('migrateDocument', () => {
  it('moves plain text into the English box and is safe to run twice', async () => {
    const { migrateDocument } = await import('@/sanity/i18n/migrateToPairs')
    const { localize } = await import('@/lib/i18n/localize')
    const doc = {
      _type: 'page',
      _id: 'p',
      title: 'Home',
      theme: 'default',
      slug: { _type: 'slug', current: 'home' },
      blocks: [
        { _type: 'faqAccordionBlock', _key: 'a', heading: 'FAQ', items: [{ _key: 'i', question: 'Q?', answer: 'A.' }] },
        { _type: 'pricingBlock', _key: 'b', plans: [{ _key: 'p', name: 'Firm', ctaHref: '#book', features: ['One', 'Two'] }] },
        { _type: 'mediaBlock', _key: 'c', media: { mediaType: 'image', alt: 'A photo' } },
      ],
    }
    const migrated = migrateDocument(doc, schemaTypes as Def[]) as any
    expect(migrated.title).toEqual({ en: 'Home' })
    expect(migrated.theme).toBe('default')
    expect(migrated.blocks[0].items[0].question).toEqual({ en: 'Q?' })
    expect(migrated.blocks[1].plans[0].ctaHref).toBe('#book')
    expect(migrated.blocks[1].plans[0].features[0]).toMatchObject({ en: 'One' })
    expect(migrated.blocks[2].media.alt).toEqual({ en: 'A photo' })
    expect(migrateDocument(migrated, schemaTypes as Def[])).toEqual(migrated)
    // Read back in English, it's the original page.
    expect(localize(migrated, 'en')).toEqual(doc)
    expect(localize(migrated, 'sv').blocks[0].heading).toBe('FAQ')
  })
})
