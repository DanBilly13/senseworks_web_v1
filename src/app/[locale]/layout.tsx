import type { ReactNode } from 'react'
import { BookMeetingProvider } from '@/components/ui/BookMeetingModal'
import { getBookMeetingSettings } from '@/lib/sanity/bookMeeting'

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
  const settings = await getBookMeetingSettings(locale)

  // Mounts the "Book a meeting" modal once for every page under a
  // locale — any Button with href="#book-meeting" opens it. Its copy
  // and contact person come from "Book a meeting" in Studio.
  return (
    <BookMeetingProvider locale={locale} settings={settings}>
      {children}
    </BookMeetingProvider>
  )
}
