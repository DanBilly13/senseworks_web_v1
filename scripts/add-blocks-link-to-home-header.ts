// Adds a "Blocks" nav link to the home page's headerBlock, pointing
// at the internal /blocks component-library showcase page.
// Run with: npx sanity exec scripts/add-blocks-link-to-home-header.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const LINK_TO_ADD = { _key: 'nav-blocks', href: '/en/blocks', label: 'Blocks' }

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
    console.log('Home header already links to /en/blocks — skipping.')
    return
  }

  const newBlocks = [...doc.blocks]
  newBlocks[headerIndex] = {
    ...header,
    navLinks: [...(header.navLinks ?? []), LINK_TO_ADD],
  }

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log('Added Blocks to the home header.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
