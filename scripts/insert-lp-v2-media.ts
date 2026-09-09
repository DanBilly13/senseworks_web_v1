// Inserts a mediaBlock between the two headingless featureGridBlocks
// ("Högre lönsamhet..." triplet and "Stabilitet och driftgaranti..."
// triplet) on lp/v2.
// Run with: npx sanity exec scripts/insert-lp-v2-media.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: {
      _key: string
      _type: string
      items?: { title?: string }[]
    }[]
  }>(`*[_type == "page" && slug.current == "lp/v2"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v2 page not found')

  const firstIndex = doc.blocks.findIndex(
    (b) => b._type === 'featureGridBlock' && b.items?.[0]?.title === 'Högre lönsamhet under egna varumärken',
  )
  const secondIndex = doc.blocks.findIndex(
    (b) => b._type === 'featureGridBlock' && b.items?.[0]?.title === 'Stabilitet och driftgaranti',
  )
  if (firstIndex === -1 || secondIndex === -1) throw new Error('Target feature grids not found')
  if (secondIndex !== firstIndex + 1) throw new Error('Blocks are not adjacent — check order')

  const newBlocks = [...doc.blocks]
  newBlocks.splice(secondIndex, 0, {
    _key: 'v2medialarge1',
    _type: 'mediaBlock',
  })

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Inserted mediaBlock between index ${firstIndex} and ${secondIndex}.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
