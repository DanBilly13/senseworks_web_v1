'use client'
import { createContext, useContext } from 'react'

// Any Button whose href is exactly this opens the Book a webinar modal
// instead of navigating — set a CTA's link to "#book-webinar" in Studio.
// Its own file for the same reason as bookMeetingContext (Button imports
// it, and the modal imports Button's buttonVariants).
export const BOOK_WEBINAR_HREF = '#book-webinar'

type BookWebinarContextValue = { open: () => void }

// No-op outside a provider, as with Book a meeting.
export const BookWebinarContext = createContext<BookWebinarContextValue>({ open: () => {} })

export function useBookWebinar() {
  return useContext(BookWebinarContext)
}
