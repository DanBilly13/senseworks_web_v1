// Splits the combined featureListBlock (heading+body+items) on lp/v1 into
// a separate sectionHeadlineBlock (heading+body) followed by a headingless
// featureListBlock (items only) — lets the standard section spacing sit
// between them instead of the block's own internal gap.
// Run with: npx sanity exec scripts/split-lp-v1-feature-list.ts --with-user-token
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
      items?: unknown
    }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex(
    (b) => b._type === 'featureListBlock' && b.heading === 'Vad det kostar koncernen att inte ha det',
  )
  if (index === -1) throw new Error('Target featureListBlock not found — already split?')

  const block = doc.blocks[index]

  const newBlocks = [...doc.blocks]
  newBlocks.splice(
    index,
    1,
    {
      _key: 'v1sectionheadline2',
      _type: 'sectionHeadlineBlock',
      headline: block.heading,
      body: block.body,
      align: 'left',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
    } as any,
    {
      _key: 'v1featurelist1',
      _type: 'featureListBlock',
      items: block.items,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
    } as any,
  )

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Split block at index ${index} into sectionHeadlineBlock + featureListBlock.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
