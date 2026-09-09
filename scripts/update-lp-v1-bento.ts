// Patches the "lp/v1" experiment page: replaces the "Därför går det att
// lova" featureGridBlock (3 items) with 3 separate bentoGridBlock sections —
// one per original item, using the item's title as the section heading and
// each sentence of its description as its own bento card.
// Run with: npx sanity exec scripts/update-lp-v1-bento.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

let keyCounter = 0
function key() {
  keyCounter += 1
  return `bento${keyCounter}`
}

function card(heading: string) {
  return { _key: key(), heading, size: 'normal' as const }
}

const newSections = [
  {
    _type: 'bentoGridBlock',
    _key: key(),
    heading: 'Innovation som gör jobbet: underlaget kommer till revisorn',
    items: [
      card(
        'Huvudbok från Fortnox, Visma och Björn Lundén. Deklarations och registeruppgifter från Skatteverket och Bolagsverket.',
      ),
      card('Bankavstämning mot huvudbok.'),
      card('Framrullning mellan åren och kopiering mellan bolag.'),
      card(
        'Det som förut var timmar av insamling per uppdrag sker i plattformen, och revisorn börjar i granskningen.',
      ),
    ],
  },
  {
    _type: 'bentoGridBlock',
    _key: key(),
    heading: 'Hjälp hela vägen: migrering, utbildning och support av revisorer',
    items: [
      card(
        'Senseworks migrerar kundregister och uppdrag, utbildar byråns revisorer och är med under första högsäsongen.',
      ),
      card('Supporten bemannas av revisorer som kan metodiken.'),
      card('Ingen byrå lämnas med ett nytt system och en manual.'),
    ],
  },
  {
    _type: 'bentoGridBlock',
    _key: key(),
    heading: 'Konfiguration: gör plattformen till er egen, utan att bygga den',
    items: [
      card(
        'Metodik, mallar, granskningsprogram, branschanpassningar och varumärke sätts i administrationen av er metodikansvarig.',
      ),
      card(
        'Ni får det man annars bygger eget för, en plattform formad för er verksamhet, till en bråkdel av tiden och risken.',
      ),
      card('Det som ändå saknas byggs tillsammans med avtalad leveransplan.'),
    ],
  },
]

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; heading?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex(
    (b) => b._type === 'featureGridBlock' && b.heading === 'Därför går det att lova',
  )
  if (index === -1) throw new Error('"Därför går det att lova" featureGridBlock not found — already replaced?')

  const newBlocks = [...doc.blocks]
  newBlocks.splice(index, 1, ...newSections)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Replaced block at index ${index} with ${newSections.length} bentoGridBlock sections.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
