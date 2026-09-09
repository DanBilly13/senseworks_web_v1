// Patches the "lp/v1" experiment page: replaces the STEGEN section
// (currently a featureGridBlock) with 5 alternating featureSplitBlock
// instances — a proper fit for a numbered, left/right sequence.
// Run with: npx sanity exec scripts/update-lp-v1-steps.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

let keyCounter = 0
function key() {
  keyCounter += 1
  return `step${keyCounter}`
}

const newSteps = [
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Löfte: en metodik · Steg 1',
    heading: 'Sätt koncernens metodik en gång',
    body: 'Metodikansvarig konfigurerar koncernens standard: ISA respektive ISA for LCE program, K ISA, branschmallar, dokumentmallar och granskningsprogram. Det som låg i tio mallbibliotek ligger nu på ett ställe och ändras på ett ställe. Uppdraget styr regelverket, inte byrån. ISA, ISA for LCE och K ISA i samma plattform. Branschmallar på koncernnivå. Bygg en gång, använd överallt. Juridiska former inbyggda. Aktiebolag, stiftelser, föreningar och övriga. Konfiguration, inte utveckling. Ändringar kräver inte leverantören.',
    imagePosition: 'right',
  },
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Löfte: byrån behåller namn och egenart · Steg 2',
    heading: 'Anslut varje byrå med sitt varumärke och sina anpassningar',
    body: 'Byrån får plattformen under eget namn och egen logotyp och anpassar vidare inom koncernens ram: egna branschprogram, egna dokumentmallar. Medarbetarna arbetar i koncernens metodik utan att kunden märker annat än att underlagen kommer snabbare. Citat att inhämta: partner i ansluten byrå om övergången.',
    imagePosition: 'left',
  },
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Löfte: 20 % tid på varje revision · Steg 3',
    heading: 'Låt underlaget komma till revisorn. Här sparas tiden.',
    body: 'Huvudbok, deklarationsuppgifter och registerdata hämtas via integrationerna i stället för att begäras och mejlas. Bankavstämning görs mot huvudboken. När året är slut rullas uppdraget fram med riskbedömning, program och dokumentation. Revisorn börjar granska i stället för att börja samla. Fortnox, Visma och Björn Lundén för bokföringen. Skatteverket och Bolagsverket för deklarations och registeruppgifter. Bankavstämning mot huvudbok. Framrullning mellan åren, kopiering mellan bolag.',
    imagePosition: 'right',
  },
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Löfte: en kvalitetsbild · Steg 4',
    heading: 'Se var varje uppdrag står, i alla byråer, medan det pågår',
    body: 'Klientlistan visar uppdragsstatus för hela koncernen. Metodikansvarig ser var granskningen står, var det finns interna kommentarer och vad som inte är påtecknat, oavsett byrå. Stöd sätts in medan det gör skillnad, inte i efterhand. Måste alla byråer arbeta exakt lika? Nej. Koncernen bestämmer vad som är standard och vad som är byråns eget. En byrå med tung offentlig sektor behåller sina program för det, inom samma plattform och samma uppföljning.',
    imagePosition: 'left',
  },
  {
    _type: 'featureSplitBlock',
    _key: key(),
    eyebrow: 'Löfte: en kapacitet · Steg 5',
    heading: 'Låt kapaciteten följa behovet över byråerna',
    body: 'Samma system i alla byråer betyder att en kollega i Göteborg kan gå in i ett uppdrag i Sundsvall utan att lära sig något nytt. Uppdragsansvarig och kund är fortfarande byråns. Högsäsongen fördelas över koncernen i stället för att köpas med övertid.',
    imagePosition: 'right',
  },
]

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; heading?: string; items?: { title?: string }[] }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex(
    (b) => b._type === 'featureGridBlock' && b.items?.[0]?.title === 'Sätt koncernens metodik en gång',
  )
  if (index === -1) throw new Error('STEGEN featureGridBlock not found — already replaced?')

  const newBlocks = [...doc.blocks]
  newBlocks.splice(index, 1, ...newSteps)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Replaced block at index ${index} with ${newSteps.length} featureSplitBlock items.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
