// lp/v2: converts the small testimonialCarouselBlock (v2k17, a single
// Stefan Andersson/Azets quote) into a testimonialLargeBlock, and
// sandwiches it between two new 2-column bentoGridBlocks (placeholder
// copy, styled like lp/v1's real bento1 block — columns:"2", plain
// heading-only "normal" cards).
// Run with: npx sanity exec scripts/lp-v2-testimonial-bento-sandwich.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  // Blocks array is heterogeneous (every block type in the schema) — a
  // loose shape here, since this script only reads/replaces one entry
  // by key and otherwise passes the rest straight through untyped.
  type Block = { _key: string; _type: string } & Record<string, unknown>

  const doc = await client.fetch<{ _id: string; blocks: Block[] }>(
    `*[_type == "page" && slug.current == "lp/v2"][0]{_id, blocks}`,
  )

  if (!doc) throw new Error('lp/v2 page not found')

  const index = doc.blocks.findIndex((b) => b._key === 'v2k17')
  if (index === -1) throw new Error('v2k17 (testimonialCarouselBlock) not found')

  const carousel = doc.blocks[index]
  if (carousel._type !== 'testimonialCarouselBlock') {
    console.log(`v2k17 is already ${carousel._type} — skipping (already converted?).`)
    return
  }
  const carouselItems = carousel.items as
    | { _key: string; authorName: string; authorRole?: string; quote: string }[]
    | undefined
  const item = carouselItems?.[0]
  if (!item) throw new Error('v2k17 has no testimonial item to convert')

  const testimonialLarge = {
    _key: 'v2testimoniallarge3',
    _type: 'testimonialLargeBlock',
    quote: item.quote,
    authorName: item.authorName,
    authorRole: item.authorRole,
  }

  const bentoAbove = {
    _key: 'v2bentosandwich-above',
    _type: 'bentoGridBlock',
    heading: 'Lorem ipsum dolor sit amet',
    body: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    columns: '2',
    items: [
      {
        _key: 'v2bentosandwich-above-a',
        heading: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        size: 'normal',
      },
      {
        _key: 'v2bentosandwich-above-b',
        heading: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        size: 'normal',
      },
    ],
  }

  const bentoBelow = {
    _key: 'v2bentosandwich-below',
    _type: 'bentoGridBlock',
    heading: 'Ut enim ad minim veniam',
    body: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    columns: '2',
    items: [
      {
        _key: 'v2bentosandwich-below-a',
        heading: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
        size: 'normal',
      },
      {
        _key: 'v2bentosandwich-below-b',
        heading: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.',
        size: 'normal',
      },
    ],
  }

  const newBlocks = [...doc.blocks]
  newBlocks.splice(index, 1, bentoAbove, testimonialLarge, bentoBelow)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log('Replaced the carousel testimonial with a large one, sandwiched between two bento grids.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
