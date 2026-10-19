import type { SanityImageSource } from '@sanity/image-url'
import type { MediaField } from '@/lib/sanity/media'

// What a Release document gives the release blocks (see releaseProjection
// in queries.ts), after localize().
export type ReleaseStage = 'development' | 'rollingOut' | 'shipped'
export type ReleaseTag = 'audit' | 'analysis' | 'customerService'
export type ReleaseLocale = 'en' | 'sv'

export type Release = {
  _id?: string
  title: string
  description?: string
  tag?: ReleaseTag
  // An AI feature: an extra "AI" chip, alongside the category.
  ai?: boolean
  stage?: ReleaseStage
  // "2026-10-01" from a Release document; older hand-typed cards had free
  // text ("1 Oct 2026"), shown as typed.
  date?: string
  media?: MediaField
  team?: { name?: string; photo?: SanityImageSource }[]
}

// The three steps of the stage bar, in order.
export const STAGES: { id: ReleaseStage; label: Record<ReleaseLocale, string> }[] = [
  { id: 'development', label: { en: 'In development', sv: 'Under utveckling' } },
  { id: 'rollingOut', label: { en: 'Rolling out', sv: 'Rullas ut' } },
  { id: 'shipped', label: { en: 'Shipped', sv: 'Släppt' } },
]

// Audit and Analytics take the same colors as their page themes (purple,
// green); Support takes yellow. The stored values (analysis,
// customerService) are the original names, kept so nothing needs
// re-saving; only the labels changed. Swedish uses the product names
// as they're called on the Swedish site.
export const TAGS: Record<ReleaseTag, { label: Record<ReleaseLocale, string>; color: 'purple' | 'green' | 'yellow' }> = {
  audit: { label: { en: 'Audit', sv: 'Revision' }, color: 'purple' },
  analysis: { label: { en: 'Analytics', sv: 'Analys' }, color: 'green' },
  customerService: { label: { en: 'Support', sv: 'Support' }, color: 'yellow' },
}

export const releaseLocale = (pathname: string): ReleaseLocale => (pathname.split('/')[1] === 'sv' ? 'sv' : 'en')

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const INTL_LOCALE: Record<ReleaseLocale, string> = { en: 'en-GB', sv: 'sv-SE' }

// "1 Oct 2026" / "1 okt. 2026". A free-text date (an older card) is
// shown as typed.
export function formatReleaseDate(date: string, locale: ReleaseLocale): string {
  if (!ISO_DATE.test(date)) return date
  const formatted = new Intl.DateTimeFormat(INTL_LOCALE[locale], { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`),
  )
  // British English writes September "Sept"; every other month is three
  // letters, so match them.
  return formatted.replace(/\bSept\b/, 'Sep')
}

// "October 2026" / "Oktober 2026" (Swedish month names are lower case
// mid-sentence; as a heading the first letter is capitalised).
export function monthLabel(monthKey: string, locale: ReleaseLocale): string {
  const label = new Intl.DateTimeFormat(INTL_LOCALE[locale], { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${monthKey}-01T00:00:00Z`),
  )
  return label.charAt(0).toUpperCase() + label.slice(1)
}

// Shipped releases grouped by month, newest month first, split into the
// last six months (this month and the five before it) and everything
// earlier, which sits behind "Show earlier releases".
export function groupShippedByMonth(releases: Release[], today: Date, recentMonths = 6) {
  const months = new Map<string, Release[]>()
  for (const release of releases) {
    if (!release.date || !ISO_DATE.test(release.date)) continue
    const key = release.date.slice(0, 7)
    months.set(key, [...(months.get(key) ?? []), release])
  }
  const cutoff = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - (recentMonths - 1), 1))
  const cutoffKey = cutoff.toISOString().slice(0, 7)
  const sorted = [...months.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, items]) => ({ key, releases: [...items].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '')) }))
  return { recent: sorted.filter((month) => month.key >= cutoffKey), earlier: sorted.filter((month) => month.key < cutoffKey) }
}
