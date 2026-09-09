// Replaces the "Över 90 byråer och 1 000 revisorer..." sectionHeadlineBlock
// (right after the logo cloud) on lp/v1 with a statsBandBlock — same
// heading and 4 stats as lp/v2's "Beprövat av Nordens ledande byråer"
// band, but heading only, no sub-text body.
// Run with: npx sanity exec scripts/swap-lp-v1-stats.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; headline?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex(
    (b) => b._type === 'sectionHeadlineBlock' && b.headline?.startsWith('Över 90 byråer'),
  )
  if (index === -1) throw new Error('Target sectionHeadlineBlock not found')

  const newBlocks = [...doc.blocks]
  newBlocks.splice(index, 1, {
    _key: 'v1statsband1',
    _type: 'statsBandBlock',
    heading: 'Beprövat av Nordens ledande byråer',
    items: [
      { _key: 'v1stat1', value: '70%', label: 'byråer i daglig drift' },
      { _key: 'v1stat2', value: '1 000+', label: 'revisorer' },
      { _key: 'v1stat3', value: '20%', label: 'kortare uppdragstid' },
      { _key: 'v1stat4', value: '7M', label: 'revisioner' },
    ],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
  } as any)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Replaced block at index ${index} with statsBandBlock.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
