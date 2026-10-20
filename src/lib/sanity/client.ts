import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-01-01',
  // Never the CDN. Pages are cached by Vercel and rebuilt by the publish
  // webhook (api/revalidate) a second or so after a publish — sooner
  // than Sanity's CDN catches up, so with the CDN the rebuilt page
  // baked in the old content and kept it until the next publish. The
  // live API is only asked on those rebuilds, so it costs little.
  useCdn: false,
})
