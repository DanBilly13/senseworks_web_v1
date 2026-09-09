import { groq } from 'next-sanity'
import type { SanityImageSource } from '@sanity/image-url'
import { sanityClient } from './client'

export type TeamMember = {
  _id: string
  name: string
  role?: string
  photo?: SanityImageSource
  bio?: string
  linkedinUrl?: string
  xUrl?: string
}

// `email` is deliberately never selected here — it's a Studio-only
// field (see teamMember.ts) precisely so a bug in this query can't
// leak it to the public site.
export const teamQuery = groq`
  *[_type == "teamMember"] | order(name asc) {
    _id,
    name,
    role,
    photo,
    bio,
    linkedinUrl,
    xUrl,
  }
`

export function getTeam(): Promise<TeamMember[]> {
  return sanityClient.fetch(teamQuery)
}
