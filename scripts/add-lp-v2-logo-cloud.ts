// Adds a logoCloudBlock to lp/v2, right after the stats band —
// reuses the same real logo assets already uploaded for lp/v1's logo
// strip (no re-upload needed).
// Run with: npx sanity exec scripts/add-lp-v2-logo-cloud.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const [v1, v2] = await Promise.all([
    client.fetch<{
      blocks: { _type: string; logos?: unknown[] }[]
    }>(`*[_type == "page" && slug.current == "lp/v1"][0]{blocks}`),
    client.fetch<{
      _id: string
      blocks: { _key: string; _type: string }[]
    }>(`*[_type == "page" && slug.current == "lp/v2"][0]{_id, blocks}`),
  ])

  if (!v1) throw new Error('lp/v1 page not found')
  if (!v2) throw new Error('lp/v2 page not found')

  const v1LogoBlock = v1.blocks.find((b) => b._type === 'logoCloudBlock')
  if (!v1LogoBlock?.logos) throw new Error('lp/v1 has no logoCloudBlock logos to copy')

  if (v2.blocks.some((b) => b._type === 'logoCloudBlock')) {
    console.log('lp/v2 already has a logoCloudBlock — skipping.')
    return
  }

  const statsIndex = v2.blocks.findIndex((b) => b._type === 'statsBandBlock')
  if (statsIndex === -1) throw new Error('lp/v2 has no statsBandBlock to insert after')

  const newBlock = {
    _key: 'v2logocloud1',
    _type: 'logoCloudBlock',
    logos: v1LogoBlock.logos,
  }

  const newBlocks = [...v2.blocks]
  newBlocks.splice(statsIndex + 1, 0, newBlock)

  await client.patch(v2._id).set({ blocks: newBlocks }).commit()
  console.log('Inserted logoCloudBlock into lp/v2, right after the stats band.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
