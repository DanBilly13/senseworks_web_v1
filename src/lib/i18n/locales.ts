import { DEFAULT_LOCALE, type Locale } from './localize'

// The site's languages, as the language switcher lists them (each in
// its own language) with their flag in public/flags/.
export const LOCALES: { id: Locale; name: string; flag: string }[] = [
  { id: 'en', name: 'English', flag: '/flags/gb.svg' },
  { id: 'sv', name: 'Svenska', flag: '/flags/se.svg' },
]

// Set by the language switcher; read when someone lands on the bare
// site address ("/") to send them to the language they last picked.
export const LOCALE_COOKIE = 'NEXT_LOCALE'

// Remembers the visitor's pick for a year (browser only).
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`
}

const isLocale = (value: string | undefined): value is Locale => LOCALES.some((locale) => locale.id === value)

// Which language "/" sends a visitor to: the one they picked before
// (cookie), else the first of English/Swedish in their browser's
// language preferences, else English. "de, sv;q=0.8" → Swedish: they
// read German best, but of the two we have, Swedish.
export function preferredLocale(cookie: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(cookie)) return cookie
  const ranked = (acceptLanguage ?? '')
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(';')
      const q = Number(params.find((param) => param.trim().startsWith('q='))?.split('=')[1] ?? 1)
      return { language: tag.split('-')[0], q: Number.isFinite(q) ? q : 0, index }
    })
    .filter((entry) => entry.language && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index)
  return ranked.map((entry) => entry.language).find(isLocale) ?? DEFAULT_LOCALE
}

// The same page in another language: swaps the leading /en or /sv.
export function pathInLocale(pathname: string, locale: Locale): string {
  return /^\/(en|sv)(\/|$)/.test(pathname) ? pathname.replace(/^\/(en|sv)/, `/${locale}`) : `/${locale}/home`
}
