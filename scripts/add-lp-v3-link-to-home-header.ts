// Adds an "LP V3" nav link to the home page's headerBlock, pointing
// at the new lp/v3 landing page.
// Run with: npx sanity exec scripts/add-lp-v3-link-to-home-header.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const LINK_TO_ADD = { _key: 'nav-lp-v3', href: '/sv/lp/v3', label: 'LP V3' }

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; navLinks?: { _key: string; href: string }[] }[]
  }>(`*[_type == "page" && slug.current == "home" && language == "en"][0]{_id, blocks}`)

  if (!doc) throw new Error('home (en) page not found')

  const headerIndex = doc.blocks.findIndex((b) => b._type === 'headerBlock')
  if (headerIndex === -1) throw new Error('home page has no headerBlock')

  const header = doc.blocks[headerIndex]
  const alreadyLinked = (header.navLinks ?? []).some((l) => l.href === LINK_TO_ADD.href)

  if (alreadyLinked) {
    console.log('Home header already links to /sv/lp/v3 — skipping.')
    return
  }

  const newBlocks = [...doc.blocks]
  newBlocks[headerIndex] = {
    ...header,
    navLinks: [...(header.navLinks ?? []), LINK_TO_ADD],
  }

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log('Added LP V3 to the home header.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
