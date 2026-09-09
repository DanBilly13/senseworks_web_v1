// Replaces the headingless ctaBannerBlock right after the second large
// testimonial on lp/v2 with the new featureSplitDarkBlock — same text,
// no heading/subhead/media for now, per instruction.
// Run with: npx sanity exec scripts/swap-lp-v2-feature-split-dark.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const TARGET_BODY =
  'Med Senseworks får ni fulla konfigurationsmöjligheter och en skräddarsydd känsla, men till en transparent kostnad. Vi tar utvecklingsinvesteringen och bär den tekniska risken. Ni kan hämta hem synergieffekterna och avkastningen direkt, i stället för att vänta på ett it-projekt.'

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; body?: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v2"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v2 page not found')

  const index = doc.blocks.findIndex(
    (b) => b._type === 'ctaBannerBlock' && b.body === TARGET_BODY,
  )
  if (index === -1) throw new Error('Target ctaBannerBlock not found — already replaced?')

  const newBlocks = [...doc.blocks]
  newBlocks.splice(index, 1, {
    _key: 'v2featuresplitdark1',
    _type: 'featureSplitDarkBlock',
    body: TARGET_BODY,
    ctaLabel: 'Boka möte',
    ctaHref: '#',
    imagePosition: 'right',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- narrow fetch type above doesn't model every block shape
  } as any)

  await client.patch(doc._id).set({ blocks: newBlocks }).commit()
  console.log(`Replaced block at index ${index} with featureSplitDarkBlock.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
