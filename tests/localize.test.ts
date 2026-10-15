import { describe, expect, it } from 'vitest'
import { localize, localizeHref } from '@/lib/i18n/localize'

describe('localize', () => {
  it('picks the locale from a { en, sv } field, falling back to English', () => {
    expect(localize({ en: 'Hello', sv: 'Hej' }, 'sv')).toBe('Hej')
    expect(localize({ en: 'Hello', sv: 'Hej' }, 'en')).toBe('Hello')
    expect(localize({ en: 'Hello' }, 'sv')).toBe('Hello')
    expect(localize({ en: 'Hello', sv: '  ' }, 'sv')).toBe('Hello')
  })

  it('resolves nested fields and lists, and leaves plain strings alone', () => {
    const page = {
      title: { en: 'Home', sv: 'Hem' },
      blocks: [
        { _type: 'heroBlock', _key: 'a', headline: { en: 'Hi', sv: 'Hej' }, layout: 'split' },
        { _type: 'pricingBlock', _key: 'b', plans: [{ features: [{ _key: 'f', en: 'One', sv: 'Ett' }] }] },
        { _type: 'oldBlock', _key: 'c', heading: 'Not converted yet' },
      ],
    }
    expect(localize(page, 'sv')).toEqual({
      title: 'Hem',
      blocks: [
        { _type: 'heroBlock', _key: 'a', headline: 'Hej', layout: 'split' },
        { _type: 'pricingBlock', _key: 'b', plans: [{ features: ['Ett'] }] },
        { _type: 'oldBlock', _key: 'c', heading: 'Not converted yet' },
      ],
    })
  })

  it('does not mistake other objects for translations', () => {
    const image = { _type: 'image', asset: { _ref: 'x' } }
    expect(localize(image, 'sv')).toEqual(image)
  })

  it('points internal links at the page language', () => {
    expect(localize({ ctaHref: '/sv/customer-stories' }, 'en')).toEqual({ ctaHref: '/en/customer-stories' })
    expect(localizeHref('/customer-stories', 'sv')).toBe('/sv/customer-stories')
    expect(localizeHref('/en', 'sv')).toBe('/sv')
    expect(localizeHref('#pricing', 'sv')).toBe('#pricing')
    expect(localizeHref('https://example.com', 'sv')).toBe('https://example.com')
    expect(localizeHref('/studio', 'sv')).toBe('/studio')
  })
})
