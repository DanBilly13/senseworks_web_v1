// Field-level i18n: a translatable text field is stored in Sanity as
// { en, sv } (see src/sanity/i18n/localizeSchema.ts). Content is fetched
// as-is, then run through localize() for the page's locale before any
// component sees it — so every block keeps receiving plain strings and
// none of them needs to know about languages.
//
// It also handles content that hasn't been converted yet: a plain
// string passes straight through, so old and new formats both render.

export type Locale = 'en' | 'sv'
export const DEFAULT_LOCALE: Locale = 'en'

const LOCALE_KEYS = new Set<string>(['en', 'sv'])
const META_KEYS = new Set<string>(['_type', '_key'])

// A { en, sv } object: its only (non-meta) keys are locale codes.
function isLocalizedValue(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const keys = Object.keys(value).filter((key) => !META_KEYS.has(key))
  return keys.length > 0 && keys.every((key) => LOCALE_KEYS.has(key))
}

// Internal links follow the page's language: "/sv/x" on an English page
// becomes "/en/x", and a language-free "/x" gets the current one, so a
// single menu works for both. External links, anchors, /studio and
// /api are left alone.
export function localizeHref(href: string, locale: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  if (/^\/(studio|api|sanity-images)(\/|$)/.test(href)) return href
  if (/^\/(en|sv)(\/|$|#|\?)/.test(href)) return href.replace(/^\/(en|sv)/, `/${locale}`)
  return `/${locale}${href}`
}

export function localize<T>(value: T, locale: string): T {
  if (isLocalizedValue(value)) {
    const chosen = value[locale] ?? value[DEFAULT_LOCALE]
    // An empty translation falls back to English rather than showing a gap.
    return (typeof chosen === 'string' && chosen.trim() === '' ? value[DEFAULT_LOCALE] : chosen) as T
  }
  if (Array.isArray(value)) return value.map((item) => localize(item, locale)) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) {
      out[key] = /href$/i.test(key) && typeof item === 'string' ? localizeHref(item, locale) : localize(item, locale)
    }
    return out as T
  }
  return value
}
