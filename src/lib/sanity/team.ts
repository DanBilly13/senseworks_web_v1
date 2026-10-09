import type { SanityImageSource } from '@sanity/image-url'

// A Team member as the site sees it — resolved by the Team Grid
// block's projection in queries.ts. `email` is deliberately never
// selected for it: it's a Studio-only field (see teamMember.ts)
// precisely so a bug in that query can't leak it to the public site.
// The one place it IS read is bookMeeting.ts, for only the single
// person picked as that modal's contact.
export type TeamMember = {
  _id: string
  name: string
  role?: string
  photo?: SanityImageSource
  bio?: string
  linkedinUrl?: string
  xUrl?: string
}
