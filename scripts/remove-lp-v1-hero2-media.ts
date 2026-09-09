// Removes the mediaBlock that sits right after the second ("HURET")
// heroTextBlock on lp/v1.
// Run with: npx sanity exec scripts/remove-lp-v1-hero2-media.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; headline?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const heroIndex = doc.blocks.findIndex(
    (b) =>
      b._type === 'heroTextBlock' &&
      b.headline === 'Så sparar varje byrå 20 % på varje revision, med sin egenart kvar',
  )
  if (heroIndex === -1) throw new Error('Second heroTextBlock not found')

  const mediaIndex = heroIndex + 1
  if (doc.blocks[mediaIndex]?._type !== 'mediaBlock') {
    throw new Error('Block after the second heroTextBlock is not a mediaBlock — already removed?')
  }

  const newBlocks = [...doc.blocks]
  newBlocks.splice(mediaIndex, 1)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Removed mediaBlock at index ${mediaIndex}.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
