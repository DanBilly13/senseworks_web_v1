// Converts lp/v3's Hero #3 (heroBlock, layout: "imageOverlayCard") to
// the new standalone heroImageOverlayCardBlock, now that the layout
// has its own block type — same _key, same field values, minus
// `layout` (no longer applicable) and `mediaWidth` (a scrollReveal-only
// field that had no effect on this layout).
// Run with: npx sanity exec scripts/migrate-lp-v3-hero-image-overlay-card.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; layout?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v3"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v3 page not found')

  const index = doc.blocks.findIndex((b) => b._type === 'heroBlock' && b.layout === 'imageOverlayCard')
  if (index === -1) throw new Error('Target heroBlock (imageOverlayCard) not found — already migrated?')

  const old = doc.blocks[index] as Record<string, unknown>
  const { layout: _layout, mediaWidth: _mediaWidth, _type: _oldType, ...rest } = old

  const newBlocks = [...doc.blocks]
  newBlocks.splice(index, 1, {
    ...rest,
    _type: 'heroImageOverlayCardBlock',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
  } as any)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Migrated block at index ${index} (_key ${old._key}) to heroImageOverlayCardBlock.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
