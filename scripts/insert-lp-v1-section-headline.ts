// Restores the "Därför går det att lova" heading on lp/v1 (dropped when
// that section was split into 3 bentoGridBlock sections) using the new
// sectionHeadlineBlock — headline only, no eyebrow/body/CTA.
// Run with: npx sanity exec scripts/insert-lp-v1-section-headline.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; heading?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex(
    (b) =>
      b._type === 'bentoGridBlock' &&
      b.heading === 'Innovation som gör jobbet: underlaget kommer till revisorn',
  )
  if (index === -1) throw new Error('First bento section not found')

  const newBlocks = [...doc.blocks]
  newBlocks.splice(index, 0, {
    _key: 'sectionheadline1',
    _type: 'sectionHeadlineBlock',
    headline: 'Därför går det att lova',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
  } as any)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log('Inserted sectionHeadlineBlock before the first bento section.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
