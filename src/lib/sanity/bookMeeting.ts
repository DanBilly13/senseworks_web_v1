import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'
import { sanityClient } from './client'

export type BookMeetingSettings = {
  heading?: string
  intro?: string
  contactTitle?: string
  contactBody?: string
  submitLabel?: string
  thanksHeading?: string
  thanksBody?: string
  showContact?: boolean
  contact?: { name?: string; photo?: SanityImageSource; email?: string } | null
} | null

// Each string is { en, sv } in Studio — the requested locale, falling
// back to English, then (in BookMeetingModal) to the hardcoded copy.
// `contact->email` is the one place a team member's email is read
// publicly — deliberately only for the single person picked here.
const bookMeetingQuery = groq`
  *[_id == "bookMeetingSettings"][0]{
    "heading": coalesce(heading[$locale], heading.en),
    "intro": coalesce(intro[$locale], intro.en),
    "contactTitle": coalesce(contactTitle[$locale], contactTitle.en),
    "contactBody": coalesce(contactBody[$locale], contactBody.en),
    "submitLabel": coalesce(submitLabel[$locale], submitLabel.en),
    "thanksHeading": coalesce(thanksHeading[$locale], thanksHeading.en),
    "thanksBody": coalesce(thanksBody[$locale], thanksBody.en),
    showContact,
    "contact": contact->{ name, photo, email }
  }
`

export function getBookMeetingSettings(locale: string): Promise<BookMeetingSettings> {
  return sanityClient.fetch(bookMeetingQuery, { locale })
}
