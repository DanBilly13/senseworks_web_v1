// Sets the "Er revisionsprocess samlad och med full kontroll" featureSplitBlock
// on lp/v2 to headingLevel: 'h2' (was the default h3).
// Run with: npx sanity exec scripts/set-lp-v2-feature-split-h2.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; heading?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v2"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v2 page not found')

  const index = doc.blocks.findIndex(
    (b) =>
      b._type === 'featureSplitBlock' &&
      b.heading === 'Er revisionsprocess samlad och med full kontroll',
  )
  if (index === -1) throw new Error('Target featureSplitBlock not found')

  await client
    .patch(doc._id)
    .set({ [`blocks[${index}].headingLevel`]: 'h2' })
    .commit()
  console.log('Set headingLevel to h2.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
