// Sets boundary:false on the second (mid-page, "HURET") heroTextBlock on
// lp/v1 — it should use standard section spacing, not page-boundary
// padding, since it's not the actual page-top hero.
// Run with: npx sanity exec scripts/set-lp-v1-hero2-boundary.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; headline?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex(
    (b) =>
      b._type === 'heroTextBlock' &&
      b.headline === 'Så sparar varje byrå 20 % på varje revision, med sin egenart kvar',
  )
  if (index === -1) throw new Error('Second heroTextBlock not found')

  await client
    .patch(doc._id)
    .set({ [`blocks[${index}].boundary`]: false })
    .commit()
  console.log('Set boundary to false.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
