// Inserts a testimonialLargeBlock between the featureListBlock ("Tio
// system betalar...") and the second heroTextBlock ("Så sparar varje
// byrå...") on lp/v1, reusing the same Stefan Andersson/Azets quote
// already repeated across the small testimonial carousels.
// Run with: npx sanity exec scripts/insert-lp-v1-testimonial-large.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; heading?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const heroIndex = doc.blocks.findIndex(
    (b) => b._type === 'heroTextBlock' && (b as any).headline === 'Så sparar varje byrå 20 % på varje revision, med sin egenart kvar',
  )
  if (heroIndex === -1) throw new Error('Second heroTextBlock not found')

  const newBlocks = [...doc.blocks]
  newBlocks.splice(heroIndex, 0, {
    _key: 'v1testimoniallarge1',
    _type: 'testimonialLargeBlock',
    quote:
      'Med Senseworks kan vi effektivisera metodiken och skapa en revision som är skräddarsydd för SME-affären; enkel för revisorerna, värdeskapande för kunderna och attraktiv för de allt fler byråer som ansluter till oss.',
    authorName: 'Stefan Andersson',
    authorRole: 'Head of Development and Innovation på Azets',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
  } as any)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Inserted testimonialLargeBlock before index ${heroIndex}.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
