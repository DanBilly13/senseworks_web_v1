// Replaces the "Er revisionsprocess samlad och med full kontroll"
// featureSplitBlock (image+text) on lp/v2 with a sectionHeadlineBlock
// (headline + body, no image) — left-aligned to match the surrounding
// left-aligned text blocks.
// Run with: npx sanity exec scripts/swap-lp-v2-section-headline.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; heading?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v2"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v2 page not found')

  const index = doc.blocks.findIndex(
    (b) =>
      b._type === 'featureSplitBlock' &&
      b.heading === 'Er revisionsprocess samlad och med full kontroll',
  )
  if (index === -1) throw new Error('Target featureSplitBlock not found')

  const newBlocks = [...doc.blocks]
  newBlocks.splice(index, 1, {
    _key: 'v2sectionheadline2',
    _type: 'sectionHeadlineBlock',
    headline: 'Er revisionsprocess samlad och med full kontroll',
    body: 'Det är en sak att bygga enkla visualiseringar av data. Men att underhålla sömlösa live-kopplingar till Fortnox, Visma, Skatteverket, Bolagsverket och de stora bankerna är anledningen till att egenbyggda projekt ofta stannar av.  Senseworks är byggt för att automatisera hela flödet utifrån en gemensam databas. Plattformen hämtar verifikat, banktransaktioner och skattekonton med ett klick. Vi sköter hela den tekniska infrastrukturen så att ni kan fokusera på rådgivning.',
    align: 'left',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
  } as any)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Replaced block at index ${index} with sectionHeadlineBlock.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
