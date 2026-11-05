import type { ReactNode } from 'react'
import { BookMeetingProvider } from '@/components/ui/BookMeetingModal'
import { getBookMeetingSettings } from '@/lib/sanity/bookMeeting'
import { BookWebinarProvider } from '@/components/ui/BookWebinarModal'
import { getWebinarSettings } from '@/lib/sanity/webinar'
import { getTickerSettings } from '@/lib/sanity/ticker'
import { TickerProvider } from '@/components/ui/TickerTape'
import { ConsentManager } from '@/components/ConsentManager'
import { INDEXABLE } from '@/lib/site'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'sv' }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const [settings, webinar, ticker] = await Promise.all([
    getBookMeetingSettings(locale),
    getWebinarSettings(locale),
    getTickerSettings(locale),
  ])

  // Mounts the "Book a meeting" modal once for every page under a
  // locale — any Button with href="#book-meeting" opens it. Its copy
  // and contact person come from "Book a meeting" in Studio.
  return (
    <BookMeetingProvider locale={locale} settings={settings}>
      {/* Inside Book a meeting, so the webinar modal's "rather have a
          walkthrough?" link can switch to it. Buttons linking to
          "#book-webinar" open this one; its copy and seats come from
          "Book a webinar" in Studio. */}
      <BookWebinarProvider locale={locale} settings={webinar}>
        {/* The page's language for the browser (the root <html> is
            shared by both locales, so it's set here): screen readers
            read Swedish as Swedish, and hyphenation splits Swedish words
            correctly (see .text-display in globals.css). */}
        <div lang={locale} className="contents">
          {/* The ticker tape above the nav ("Ticker tape" in Studio). */}
          <TickerProvider settings={ticker} locale={locale}>{children}</TickerProvider>
          {/* The cookie banner; the tags only load on the production
              deployment, and only after consent. */}
          <ConsentManager locale={locale} tracking={INDEXABLE} />
        </div>
      </BookWebinarProvider>
    </BookMeetingProvider>
  )
}
