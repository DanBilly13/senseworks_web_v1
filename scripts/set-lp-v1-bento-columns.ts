// Sets the "Innovation som gör jobbet..." bento section on lp/v1 to a
// 2-column layout (it now has exactly 4 cards, so this reads as a 2x2 grid).
// Run with: npx sanity exec scripts/set-lp-v1-bento-columns.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; heading?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex(
    (b) =>
      b._type === 'bentoGridBlock' &&
      b.heading === 'Innovation som gör jobbet: underlaget kommer till revisorn',
  )
  if (index === -1) throw new Error('Bento section not found')

  await client
    .patch(doc._id)
    .set({ [`blocks[${index}].columns`]: '2' })
    .commit()
  console.log('Set columns to 2.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
