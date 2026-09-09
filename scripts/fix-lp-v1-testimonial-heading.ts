// Fixes the "Över 90 byråer och 1 000 revisorer..." testimonial carousel
// heading (non-breaking space between "1" and "000" so text-balance can't
// split them across lines) and duplicates its single testimonial 4 more
// times (7 total) so the carousel has enough cards to scroll meaningfully.
// Run with: npx sanity exec scripts/fix-lp-v1-testimonial-heading.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: {
      _key: string
      _type: string
      heading?: string
      items?: { _key: string; authorName?: string; authorRole?: string; quote?: string }[]
    }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex(
    (b) => b._type === 'testimonialCarouselBlock' && b.heading?.includes('Över 90'),
  )
  if (index === -1) throw new Error('Testimonial carousel not found')

  const block = doc.blocks[index]
  const items = block.items ?? []
  const template = items[0]

  const newBlocks = [...doc.blocks]
  newBlocks[index] = {
    ...block,
    heading: block.heading!.replace('1 000', '1 000'),
    items: [
      ...items,
      ...Array.from({ length: 4 }, (_, i) => ({
        ...template,
        _key: `${template._key}-dup${i + 1}`,
      })),
    ],
  }

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log('Fixed heading line break and added 4 more testimonial copies (7 total).')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
