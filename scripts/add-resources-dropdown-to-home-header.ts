// Turns the home page header's flat "Resources" nav link into a
// dropdown (matching the live site's "Resurser" menu), with only
// "Knowledge Bank" actually wired up — the other three are
// placeholders until those sections exist.
// Run with: npx sanity exec scripts/add-resources-dropdown-to-home-header.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

type NavItem = { _key: string; label: string; href?: string; links?: unknown[] }

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; navLinks?: NavItem[] }[]
  }>(`*[_type == "page" && slug.current == "home" && language == "en"][0]{_id, blocks}`)

  if (!doc) throw new Error('home (en) page not found')

  const headerIndex = doc.blocks.findIndex((b) => b._type === 'headerBlock')
  if (headerIndex === -1) throw new Error('home page has no headerBlock')

  const header = doc.blocks[headerIndex]
  const navLinks = header.navLinks ?? []
  const resourcesIndex = navLinks.findIndex((link) => link.label === 'Resources')

  if (resourcesIndex === -1) throw new Error('No "Resources" nav link found to convert')

  if (navLinks[resourcesIndex].links?.length) {
    console.log('Resources is already a dropdown — skipping.')
    return
  }

  const newNavLinks = [...navLinks]
  newNavLinks[resourcesIndex] = {
    _key: navLinks[resourcesIndex]._key,
    label: 'Resources',
    links: [
      { _key: 'nav-resources-kb', label: 'Knowledge Bank', href: '/sv/knowledge-bank' },
      { _key: 'nav-resources-integrations', label: 'Integrations' },
      { _key: 'nav-resources-news', label: 'News' },
      { _key: 'nav-resources-isa-lce', label: 'ISA for LCE' },
    ],
  }

  const newBlocks = [...doc.blocks]
  newBlocks[headerIndex] = { ...header, navLinks: newNavLinks }

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log('Converted Resources into a dropdown (Knowledge Bank, Integrations, News, ISA for LCE).')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
