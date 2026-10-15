import { describe, expect, it } from 'vitest'
import { pathInLocale, preferredLocale } from '@/lib/i18n/locales'

describe('preferredLocale', () => {
  it('uses the remembered choice first', () => {
    expect(preferredLocale('sv', 'en-GB,en;q=0.9')).toBe('sv')
  })
  it('picks the first of English/Swedish in the browser preferences', () => {
    expect(preferredLocale(undefined, 'sv-SE,sv;q=0.9,en;q=0.8')).toBe('sv')
    expect(preferredLocale(undefined, 'en-US,en;q=0.9,sv;q=0.8')).toBe('en')
    expect(preferredLocale(undefined, 'de-DE,de;q=0.9,sv;q=0.5')).toBe('sv')
    expect(preferredLocale(undefined, 'en;q=0.5,sv;q=0.9')).toBe('sv')
  })
  it('falls back to English', () => {
    expect(preferredLocale(undefined, 'de-DE,fr;q=0.8')).toBe('en')
    expect(preferredLocale(undefined, null)).toBe('en')
    expect(preferredLocale('xx', '')).toBe('en')
  })
})

describe('pathInLocale', () => {
  it('keeps the page, swapping the language', () => {
    expect(pathInLocale('/en/produkter/revision', 'sv')).toBe('/sv/produkter/revision')
    expect(pathInLocale('/sv', 'en')).toBe('/en')
    expect(pathInLocale('/studio', 'sv')).toBe('/sv/home')
  })
})
