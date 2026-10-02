'use client'
import { createContext, useContext } from 'react'

// Any Button (or plain link) whose href is exactly this opens the Book a
// meeting modal instead of navigating — set a CTA's link to
// "#book-meeting" in Studio. Lives in its own file (not alongside the
// modal) because Button imports it and the modal imports Button's
// buttonVariants — keeping the context here avoids a circular import.
export const BOOK_MEETING_HREF = '#book-meeting'

type BookMeetingContextValue = { open: () => void }

// No-op outside a provider (e.g. a unit test rendering a lone Button)
// rather than throwing, so a CTA pointing at the modal just does
// nothing there instead of crashing the tree.
export const BookMeetingContext = createContext<BookMeetingContextValue>({ open: () => {} })

export function useBookMeeting() {
  return useContext(BookMeetingContext)
}
