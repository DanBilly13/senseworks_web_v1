import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-01-01',
  // The CDN trades freshness for speed/cost — fine for production,
  // actively unhelpful while actively editing content in dev (CDN
  // responses can lag the live dataset by tens of seconds).
  useCdn: process.env.NODE_ENV === 'production',
})
