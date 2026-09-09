// Splits the first bento card in the "Innovation som gör jobbet..." section
// into two: the Fortnox/Visma/Björn Lundén sentence stays, and the
// Skatteverket/Bolagsverket sentence becomes its own card.
// Run with: npx sanity exec scripts/split-lp-v1-bento-card.ts --with-user-token
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
      b.heading === 'Innovation som gör jobbet: underlaget kommer till revisorn',
  )
  if (blockIndex === -1) throw new Error('Bento section not found')

  const block = doc.blocks[blockIndex]
  const items = block.items ?? []
  const cardIndex = items.findIndex((i) =>
    i.heading?.startsWith('Huvudbok från Fortnox'),
  )
  if (cardIndex === -1) throw new Error('Target card not found — already split?')

  const newItems = [...items]
  newItems.splice(cardIndex, 1,
    { _key: 'bento1a', heading: 'Huvudbok från Fortnox, Visma och Björn Lundén.', size: 'normal' },
    { _key: 'bento1b', heading: 'Deklarations och registeruppgifter från Skatteverket och Bolagsverket.', size: 'normal' },
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
