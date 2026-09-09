// Adds an "Om" dropdown to the home page header (matching the live
// site's "Om" menu), with only "Om oss" wired up — "Jobba med oss"
// and "Kontakta oss" are placeholders until those pages exist.
// Run with: npx sanity exec scripts/add-om-dropdown-to-home-header.ts --with-user-token
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

  if (navLinks.some((link) => link.label === 'Om')) {
    console.log('"Om" already in the nav — skipping.')
    return
  }

  const omDropdown: NavItem = {
    _key: 'nav-om',
    label: 'Om',
    links: [
      { _key: 'nav-om-oss', label: 'Om oss', href: '/sv/om-oss' },
      { _key: 'nav-om-jobba', label: 'Jobba med oss' },
      { _key: 'nav-om-kontakta', label: 'Kontakta oss' },
    ],
  } as NavItem

  const newBlocks = [...doc.blocks]
  newBlocks[headerIndex] = { ...header, navLinks: [...navLinks, omDropdown] }

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log('Added the "Om" dropdown (Om oss, Jobba med oss, Kontakta oss) to the home header.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
