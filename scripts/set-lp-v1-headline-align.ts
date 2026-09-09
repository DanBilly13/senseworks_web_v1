// Sets the "Därför går det att lova" sectionHeadlineBlock on lp/v1 to
// left-aligned (the block defaults to centered).
// Run with: npx sanity exec scripts/set-lp-v1-headline-align.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; headline?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex(
    (b) => b._type === 'sectionHeadlineBlock' && b.headline === 'Därför går det att lova',
  )
  if (index === -1) throw new Error('sectionHeadlineBlock not found')

  await client
    .patch(doc._id)
    .set({ [`blocks[${index}].align`]: 'left' })
    .commit()
  console.log('Set align to left.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
