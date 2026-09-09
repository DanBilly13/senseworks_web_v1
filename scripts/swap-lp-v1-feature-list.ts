// Replaces the "Vad det kostar koncernen att inte ha det" featureGridBlock
// on lp/v1 with the new featureListBlock (left label / right body rows,
// no dots/line), reusing the same heading/body/items text.
// Run with: npx sanity exec scripts/swap-lp-v1-feature-list.ts --with-user-token
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
      items?: { _key: string; title?: string; description?: string }[]
    }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex(
    (b) => b._type === 'featureGridBlock' && b.heading === 'Vad det kostar koncernen att inte ha det',
  )
  if (index === -1) throw new Error('Target featureGridBlock not found')

  const block = doc.blocks[index]
  const items = (block.items ?? []).map((item, i) => ({
    _key: `flrow${i + 1}`,
    label: item.title,
    body: item.description,
  }))

  const newBlocks = [...doc.blocks]
  newBlocks.splice(index, 1, {
    _key: 'v1featurelist1',
    _type: 'featureListBlock',
    heading: block.heading,
    body: block.body,
    items,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
  } as any)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Replaced block at index ${index} with featureListBlock.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
