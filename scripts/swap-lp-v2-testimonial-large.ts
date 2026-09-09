// Swaps the first Stefan Andersson testimonialCarouselBlock (single item,
// right after the stats band) on lp/v2 for the new testimonialLargeBlock —
// matches the reference's large standalone quote card.
// Run with: npx sanity exec scripts/swap-lp-v2-testimonial-large.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: {
      _key: string
      _type: string
      items?: { authorName?: string; quote?: string; authorRole?: string }[]
    }[]
  }>(`*[_type == "page" && slug.current == "lp/v2"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v2 page not found')

  const index = doc.blocks.findIndex(
    (b) => b._type === 'testimonialCarouselBlock' && b.items?.[0]?.authorName === 'Stefan Andersson',
  )
  if (index === -1) throw new Error('First Stefan Andersson testimonial not found')

  const item = doc.blocks[index].items![0]

  const newBlocks = [...doc.blocks]
  newBlocks.splice(index, 1, {
    _key: 'v2testimoniallarge1',
    _type: 'testimonialLargeBlock',
    quote: item.quote,
    authorName: item.authorName,
    authorRole: item.authorRole,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
  } as any)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Replaced block at index ${index} with testimonialLargeBlock.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
