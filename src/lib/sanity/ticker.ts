import { groq } from 'next-sanity'
import { sanityClient } from './client'

export type TickerSettings = {
  show?: boolean
  parts?: { text?: string; bold?: boolean }[]
  href?: string
} | null

// Each part is { en, sv } in Studio: the requested locale, falling back
// to English.
const tickerQuery = groq`
  *[_id == "tickerSettings"][0]{
    show,
    href,
    "parts": parts[]{ "text": select($locale == "sv" => coalesce(sv, en), en), bold }
  }
`

export function getTickerSettings(locale: string): Promise<TickerSettings> {
  return sanityClient.fetch(tickerQuery, { locale })
}
