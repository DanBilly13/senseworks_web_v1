// Replaces the "Över 90 byråer och 1 000 revisorer..." testimonialCarouselBlock
// on lp/v1 (7 repeated Stefan Andersson quotes) with a single testimonialLargeBlock.
// Run with: npx sanity exec scripts/swap-lp-v1-carousel-to-large.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: {
      _key: string
      _type: string
      heading?: string
      items?: { authorName?: string; quote?: string; authorRole?: string }[]
    }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex(
    (b) => b._type === 'testimonialCarouselBlock' && b.heading?.startsWith('Över 90 byråer'),
  )
  if (index === -1) throw new Error('Target testimonialCarouselBlock not found')

  const block = doc.blocks[index]
  const item = block.items![0]

  // Keep the heading (it's real content) as its own sectionHeadlineBlock,
  // same pattern used when Feature List was split — testimonialLargeBlock
  // has no heading field of its own.
  const newBlocks = [...doc.blocks]
  newBlocks.splice(
    index,
    1,
    {
      _key: 'v1sectionheadline3',
      _type: 'sectionHeadlineBlock',
      headline: block.heading,
      align: 'left',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
    } as any,
    {
      _key: 'v1testimoniallarge2',
      _type: 'testimonialLargeBlock',
      quote: item.quote,
      authorName: item.authorName,
      authorRole: item.authorRole,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
    } as any,
  )

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Replaced block at index ${index} with testimonialLargeBlock.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
