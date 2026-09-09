// Adds "LP V1" / "LP V2" nav links to the home page's headerBlock so
// the two Swedish landing-page drafts (lp/v1, lp/v2) are reachable
// from the top bar instead of only by typing the URL directly.
// Run with: npx sanity exec scripts/add-lp-links-to-home-header.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const LINKS_TO_ADD = [
  { _key: 'nav-lp-v1', href: '/sv/lp/v1', label: 'LP V1' },
  { _key: 'nav-lp-v2', href: '/sv/lp/v2', label: 'LP V2' },
]

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; navLinks?: { _key: string; href: string }[] }[]
  }>(`*[_type == "page" && slug.current == "home" && language == "en"][0]{_id, blocks}`)

  if (!doc) throw new Error('home (en) page not found')

  const headerIndex = doc.blocks.findIndex((b) => b._type === 'headerBlock')
  if (headerIndex === -1) throw new Error('home page has no headerBlock')

  const header = doc.blocks[headerIndex]
  const existingHrefs = new Set((header.navLinks ?? []).map((l) => l.href))
  const toAdd = LINKS_TO_ADD.filter((l) => !existingHrefs.has(l.href))

  if (toAdd.length === 0) {
    console.log('Home header already links to both lp/v1 and lp/v2 — skipping.')
    return
  }

  const newBlocks = [...doc.blocks]
  newBlocks[headerIndex] = {
    ...header,
    navLinks: [...(header.navLinks ?? []), ...toAdd],
  }

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Added ${toAdd.map((l) => l.label).join(', ')} to the home header.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
