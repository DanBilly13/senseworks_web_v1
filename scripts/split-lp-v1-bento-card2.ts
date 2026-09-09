// Splits the first bento card in the "Hjälp hela vägen..." section into
// two: the migration clause stays, and the training/first-peak-season
// clause becomes its own card.
// Run with: npx sanity exec scripts/split-lp-v1-bento-card2.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: {
      _key: string
      _type: string
      heading?: string
      items?: { _key: string; heading?: string; size?: string }[]
    }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const blockIndex = doc.blocks.findIndex(
    (b) =>
      b._type === 'bentoGridBlock' &&
      b.heading === 'Hjälp hela vägen: migrering, utbildning och support av revisorer',
  )
  if (blockIndex === -1) throw new Error('Bento section not found')

  const block = doc.blocks[blockIndex]
  const items = block.items ?? []
  const cardIndex = items.findIndex((i) => i.heading?.startsWith('Senseworks migrerar'))
  if (cardIndex === -1) throw new Error('Target card not found — already split?')

  const newItems = [...items]
  newItems.splice(cardIndex, 1,
    { _key: 'bento2a', heading: 'Senseworks migrerar kundregister och uppdrag.', size: 'normal' },
    { _key: 'bento2b', heading: 'utbildar byråns revisorer och är med under första högsäsongen.', size: 'normal' },
  )

  const newBlocks = [...doc.blocks]
  newBlocks[blockIndex] = { ...block, items: newItems }

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log('Split card into two.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
