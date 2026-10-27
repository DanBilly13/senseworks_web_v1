import { describe, expect, it } from 'vitest'
import { schemaTypes } from '@/sanity/schemaTypes'

/* eslint-disable @typescript-eslint/no-explicit-any */
type Def = Record<string, any>
const byName = new Map((schemaTypes as Def[]).map((type) => [type.name, type]))
const field = (def: Def, name: string): Def => def.fields.find((f: Def) => f.name === name)
const isPair = (def: Def) => def.type === 'object' && def.fields?.map((f: Def) => f.name).join() === 'en,sv'

describe('localizeSchema', () => {
  it('turns text fields into English/Swedish pairs, keeping English validation and wrapping initial values', () => {
    const timeline = byName.get('releaseTimelineBlock')!
    expect(isPair(field(timeline, 'shippedHeading'))).toBe(true)
    expect(field(timeline, 'shippedHeading').initialValue).toEqual({ en: 'Shipped' })
    const faq = byName.get('faqAccordionBlock')!
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

  it('pairs story and article text, but not names, and stacks a rich-text body', () => {
    const story = byName.get('customerStory')!
    expect(isPair(field(story, 'title'))).toBe(true)
    expect(field(story, 'companyName').type).toBe('string')
    expect(field(story, 'personName').type).toBe('string')
    expect(field(story, 'products').of[0].type).toBe('string')
    const body = field(story, 'body')
    expect(isPair(body)).toBe(true)
    expect(body.options.columns).toBe(1)
    expect(body.fields[0].of.some((member: Def) => member.name === 'pullQuote')).toBe(true)
    const article = byName.get('article')!
    expect(field(article, 'body').fields[0].type).toBe('blockContent')
    // An article's title is required in at least one language, not in English.
    expect(field(article, 'title').validation).toBeTypeOf('function')
    expect(field(article, 'title').fields[0].validation).toBeUndefined()
    expect(field(byName.get('testimonial')!, 'quote').type).not.toBe('object')
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
        { _type: 'faqAccordionBlock', _key: 'a', items: [{ _key: 'i', question: 'Q?', answer: 'A.' }] },
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
    expect(localize(migrated, 'sv').blocks[0].items[0].question).toBe('Q?')
  })
})

describe('mergeLanguageVersions', () => {
  it('merges an English and a Swedish story into one document', async () => {
    const { mergeLanguageVersions } = await import('@/sanity/i18n/migrateToPairs')
    const { localize } = await import('@/lib/i18n/localize')
    const body = (text: string) => [{ _type: 'block', _key: text, children: [{ _type: 'span', _key: 's', text }] }]
    const en = { _id: 's-en', _type: 'customerStory', language: 'en', companyName: 'Retora', slug: { _type: 'slug', current: 'retora' }, products: ['audit'], title: 'Steps into the future', summary: 'Less Excel', body: body('Hello'), logo: { mediaType: 'image', alt: 'Logo' } }
    const sv = { _id: 's-sv', _type: 'customerStory', language: 'sv', companyName: 'Retora', slug: { _type: 'slug', current: 'retora' }, products: ['audit'], title: 'Tar klivet', body: body('Hej') }
    const merged = mergeLanguageVersions({ en, sv }, schemaTypes as Def[], 'customerStory-retora') as any
    expect(merged._id).toBe('customerStory-retora')
    expect(merged.language).toBeUndefined()
    expect(merged.companyName).toBe('Retora')
    expect(merged.title).toEqual({ en: 'Steps into the future', sv: 'Tar klivet' })
    expect(merged.summary).toEqual({ en: 'Less Excel' })
    expect(merged.body.sv).toEqual(body('Hej'))
    expect(merged.logo.alt).toEqual({ en: 'Logo' })
    // Each language reads back as its own original.
    const omit = (doc: Def, ...keys: string[]) => Object.fromEntries(Object.entries(doc).filter(([key]) => !keys.includes(key)))
    const enRest = omit(en, 'language', '_id')
    const svRest = omit(sv, 'language', '_id')
    expect(localize(merged, 'en')).toEqual({ _id: 'customerStory-retora', ...enRest })
    expect(localize(merged, 'sv')).toMatchObject({ ...svRest, summary: 'Less Excel' })
  })

  it('keeps a Swedish-only article Swedish', async () => {
    const { mergeLanguageVersions } = await import('@/sanity/i18n/migrateToPairs')
    const sv = { _id: 'a', _type: 'article', language: 'sv', title: 'Navigera som ett proffs', slug: { _type: 'slug', current: 'navigera' } }
    const merged = mergeLanguageVersions({ sv }, schemaTypes as Def[], 'article-navigera') as any
    expect(merged.title).toEqual({ sv: 'Navigera som ett proffs' })
  })
})
