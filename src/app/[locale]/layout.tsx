import type { ReactNode } from 'react'
import { BookMeetingProvider } from '@/components/ui/BookMeetingModal'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'sv' }]
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  // Mounts the "Book a meeting" modal once for every page under a
  // locale — any Button with href="#book-meeting" opens it.
  return <BookMeetingProvider>{children}</BookMeetingProvider>
}
