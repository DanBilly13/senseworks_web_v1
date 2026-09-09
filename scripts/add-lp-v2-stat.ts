// Adds a 4th stat ("7M audits") to the Stats Band on lp/v2.
// Run with: npx sanity exec scripts/add-lp-v2-stat.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; heading?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v2"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v2 page not found')

  const index = doc.blocks.findIndex(
    (b) => b._type === 'statsBandBlock' && b.heading === 'Beprövat av Nordens ledande byråer',
  )
  if (index === -1) throw new Error('Stats band not found')

  await client
    .patch(doc._id)
    .append(`blocks[${index}].items`, [
      { _key: 'v2stat4', value: '7M', label: 'revisioner' },
    ])
    .commit()
  console.log('Added 4th stat.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
