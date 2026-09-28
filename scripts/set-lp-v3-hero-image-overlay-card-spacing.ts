// Preserves lp/v3 Hero #3's existing visual gap (was the fixed
// 120px `section-edge` margin) now that heroImageOverlayCardBlock has
// a loose/medium/tight `spacing` field defaulting to loose (200px) —
// medium (120px) matches what was already there.
// Run with: npx sanity exec scripts/set-lp-v3-hero-image-overlay-card-spacing.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{ _id: string; blocks: { _key: string; _type: string }[] }>(
    `*[_type == "page" && slug.current == "lp/v3"][0]{_id, blocks}`,
  )
  if (!doc) throw new Error('lp/v3 page not found')

  const index = doc.blocks.findIndex((b) => b._type === 'heroImageOverlayCardBlock')
  if (index === -1) throw new Error('heroImageOverlayCardBlock not found on lp/v3')

  await client.patch(doc._id).set({ [`blocks[${index}].spacing`]: 'medium' }).commit()
  console.log(`Set blocks[${index}] (_key ${doc.blocks[index]._key}) spacing to "medium".`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
