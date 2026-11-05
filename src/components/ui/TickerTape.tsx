'use client'
import { createContext, Fragment, useContext, type ReactNode } from 'react'
import { BOOK_MEETING_HREF, useBookMeeting } from '@/components/ui/bookMeetingContext'
import { BOOK_WEBINAR_HREF, useBookWebinar } from '@/components/ui/bookWebinarContext'
import { localizeHref } from '@/lib/i18n/localize'
import type { TickerSettings } from '@/lib/sanity/ticker'

// "Ticker tape" in Studio, fetched once per locale in the locale layout
// and read by the header, on the pages that switch it on (it sits above the nav, inside the fixed header,
// so it hides and reveals with it).
const TickerContext = createContext<{ settings: TickerSettings; locale: string }>({ settings: null, locale: 'en' })

// Whether this page shows it (the page's "Ticker tape" switch), set by
// the page route around its header.
const TickerOnPageContext = createContext(false)

export function TickerOnPage({ on, children }: { on: boolean; children: ReactNode }) {
  return <TickerOnPageContext.Provider value={on}>{children}</TickerOnPageContext.Provider>
}

export function TickerProvider({ settings, locale, children }: { settings: TickerSettings; locale: string; children: ReactNode }) {
  return <TickerContext.Provider value={{ settings, locale }}>{children}</TickerContext.Provider>
}

// How many times the parts repeat in each half of the track: enough that
// one half is wider than any screen, so the loop never shows a gap.
const REPEATS = 6
// The scrolling speed, slow enough to read: about 40px a second, from a
// rough 7px per character at this size.
const PX_PER_CHAR = 7
const PX_PER_SECOND = 40

// The strip: the parts with a dot between them, repeated, in two
// identical halves that slide left by one half and start again
// (.ticker-track in globals.css), so the loop is seamless. Hovering (or
// focusing it from the keyboard) stops it; with reduced motion it stands
// still. The whole strip is one link: "#book-webinar" / "#book-meeting"
// open their form, anything else is followed.
export function TickerTape() {
  const { settings, locale } = useContext(TickerContext)
  const onPage = useContext(TickerOnPageContext)
  const { open: openBookMeeting } = useBookMeeting()
  const { open: openBookWebinar } = useBookWebinar()
  const parts = (settings?.parts ?? []).filter((p) => p.text)
  if (!onPage || !settings?.show || !parts.length) return null

  const href = settings.href || BOOK_WEBINAR_HREF
  const label = parts.map((p) => p.text).join(' · ')
  const seconds = Math.max(20, (label.length * REPEATS * PX_PER_CHAR) / PX_PER_SECOND)

  const group = (key: string) => (
    <span key={key} className="flex shrink-0 items-center gap-medium pr-xl" aria-hidden>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="opacity-50">·</span>}
          <span className={p.bold ? 'font-semibold text-accent' : ''}>{p.text}</span>
        </Fragment>
      ))}
    </span>
  )
  const half = (h: number) => Array.from({ length: REPEATS }, (_, i) => group(`${h}-${i}`))
  const strip = (
    <>
      <span className="sr-only">{label}</span>
      <span className="ticker-track flex w-max" style={{ '--ticker-duration': `${seconds}s` } as React.CSSProperties}>
        {half(0)}
        {half(1)}
      </span>
    </>
  )
  const className = 'ticker block w-full cursor-pointer overflow-hidden bg-foreground py-small text-left text-body-sm whitespace-nowrap text-background'

  if (href === BOOK_WEBINAR_HREF || href === BOOK_MEETING_HREF) {
    return (
      <button type="button" onClick={href === BOOK_WEBINAR_HREF ? openBookWebinar : openBookMeeting} className={className}>
        {strip}
      </button>
    )
  }
  return (
    <a href={localizeHref(href, locale)} className={className}>
      {strip}
    </a>
  )
}
