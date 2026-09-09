// Inserts a headerBlock (no nav links, just a "Boka möte" button) at the
// top of both lp/v1 and lp/v2.
// Run with: npx sanity exec scripts/add-nav-header.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  for (const slug of ['lp/v1', 'lp/v2']) {
    const doc = await client.fetch<{
      _id: string
      blocks: { _key: string; _type: string }[]
    }>(`*[_type == "page" && slug.current == $slug][0]{_id, blocks}`, { slug })

    if (!doc) throw new Error(`${slug} page not found`)

    if (doc.blocks[0]?._type === 'headerBlock') {
      console.log(`${slug} already has a headerBlock at the top — skipping.`)
      continue
    }

    const newBlocks = [
      {
        _key: `${slug.replace('/', '')}header1`,
        _type: 'headerBlock',
        logoText: 'senseworks',
        navLinks: [],
        ctaLabel: 'Boka möte',
        ctaHref: '#',
      },
      ...doc.blocks,
    ]

    await client.patch(doc._id).set({ blocks: newBlocks }).commit()
    console.log(`Added headerBlock to the top of ${slug}.`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
