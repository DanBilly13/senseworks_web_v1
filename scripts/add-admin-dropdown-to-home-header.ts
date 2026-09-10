// Consolidates the home header's individual LP V1/V2/V3 and Blocks
// nav links into one "Admin" dropdown, at the end of the nav.
// Run with: npx sanity exec scripts/add-admin-dropdown-to-home-header.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const HREFS_TO_FOLD = new Set(['/sv/lp/v1', '/sv/lp/v2', '/sv/lp/v3', '/en/blocks'])

const ADMIN_ITEM = {
  _key: 'nav-admin',
  label: 'Admin',
  links: [
    { _key: 'nav-admin-lp-v1', label: 'LP V1', href: '/sv/lp/v1' },
    { _key: 'nav-admin-lp-v2', label: 'LP V2', href: '/sv/lp/v2' },
    { _key: 'nav-admin-lp-v3', label: 'LP V3', href: '/sv/lp/v3' },
    { _key: 'nav-admin-blocks', label: 'Blocks', href: '/en/blocks' },
  ],
}

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; navLinks?: { _key: string; href?: string }[] }[]
  }>(`*[_type == "page" && slug.current == "home" && language == "en"][0]{_id, blocks}`)

  if (!doc) throw new Error('home (en) page not found')

  const headerIndex = doc.blocks.findIndex((b) => b._type === 'headerBlock')
  if (headerIndex === -1) throw new Error('home page has no headerBlock')

  const header = doc.blocks[headerIndex]
  const remaining = (header.navLinks ?? []).filter(
    (l) => !l.href || !HREFS_TO_FOLD.has(l.href),
  )

  const newBlocks = [...doc.blocks]
  newBlocks[headerIndex] = {
    ...header,
    navLinks: [...remaining, ADMIN_ITEM],
  }

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log('Folded LP V1/V2/V3 and Blocks into an "Admin" dropdown on the home header.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
