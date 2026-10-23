import { groq } from 'next-sanity'
import { sanityClient } from './client'

export type WebinarSettings = {
  dateLabel?: string
  heading?: string
  intro?: string
  points?: { text?: string }[]
  meetingLinkLabel?: string
  seatsLabel?: string
  seatsTotal?: number
  seatsLeft?: number
  submitLabel?: string
  finePrint?: string
  thanksHeading?: string
  thanksBody?: string
} | null

// Each string is { en, sv } in Studio — the requested locale, falling
// back to English, then (in BookWebinarModal) to the hardcoded copy.
const field = (name: string) => `"${name}": coalesce(${name}[$locale], ${name}.en)`
const webinarQuery = groq`
  *[_id == "webinarSettings"][0]{
    ${['dateLabel', 'heading', 'intro', 'meetingLinkLabel', 'seatsLabel', 'submitLabel', 'finePrint', 'thanksHeading', 'thanksBody'].map(field).join(',\n    ')},
    "points": points[]{ "text": select($locale == "sv" => coalesce(sv, en), en) },
    seatsTotal,
    seatsLeft
  }
`

export function getWebinarSettings(locale: string): Promise<WebinarSettings> {
  return sanityClient.fetch(webinarQuery, { locale })
}
