// Moves the "Det som förut var timmar..." card out of the "Innovation som
// gör jobbet..." bento section's items and into that section's own
// body/subtitle field instead.
// Run with: npx sanity exec scripts/move-lp-v1-card-to-subtitle2.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: {
      _key: string
      _type: string
      heading?: string
      body?: string
      items?: { _key: string; heading?: string; size?: string }[]
    }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const blockIndex = doc.blocks.findIndex(
    (b) =>
      b._type === 'bentoGridBlock' &&
      b.heading === 'Innovation som gör jobbet: underlaget kommer till revisorn',
  )
  if (blockIndex === -1) throw new Error('Bento section not found')

  const block = doc.blocks[blockIndex]
  const items = block.items ?? []
  const cardIndex = items.findIndex((i) => i.heading?.startsWith('Det som förut'))
  if (cardIndex === -1) throw new Error('Target card not found — already moved?')

  const cardText = items[cardIndex].heading!
  const newItems = items.filter((_, i) => i !== cardIndex)

  const newBlocks = [...doc.blocks]
  newBlocks[blockIndex] = { ...block, body: cardText, items: newItems }

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log('Moved card into the section body/subtitle.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
