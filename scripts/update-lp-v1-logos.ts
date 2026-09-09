// Updates the lp/v1 logoCloudBlock: removes JDG and Revideco, adds
// Forvis Mazars and Accru (newly added to web-bits/Graphics/Customer
// Logos).
// Run with: npx sanity exec scripts/update-lp-v1-logos.ts --with-user-token
import { getCliClient } from 'sanity/cli'
import { createReadStream } from 'fs'
import { join } from 'path'

const client = getCliClient()

const LOGO_DIR = '/Users/danielbillingham/Documents/senseworks/web-bits/Graphics/Customer Logos'

const REMOVE_NAMES = ['JDG', 'Revideco']

const ADD_LOGOS = [
  { file: 'forvis-mazars-cp.svg', name: 'Forvis Mazars' },
  { file: 'accru-cp.svg', name: 'Accru' },
]

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string; logos?: { _key: string; name: string }[] }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex((b) => b._type === 'logoCloudBlock')
  if (index === -1) throw new Error('logoCloudBlock not found')

  const existingLogos = doc.blocks[index].logos ?? []
  const keptLogos = existingLogos.filter((logo) => !REMOVE_NAMES.includes(logo.name))
  console.log(`Removing: ${existingLogos.filter((l) => REMOVE_NAMES.includes(l.name)).map((l) => l.name).join(', ')}`)

  const newLogos = []
  for (const { file, name } of ADD_LOGOS) {
    const asset = await client.assets.upload('image', createReadStream(join(LOGO_DIR, file)), {
      filename: file,
    })
    newLogos.push({
      _key: `logo-${file.replace(/\W/g, '')}`,
      name,
      media: {
        _type: 'media',
        mediaType: 'image',
        alt: name,
        image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
      },
    })
    console.log(`Uploaded ${file} -> ${asset._id}`)
  }

  const finalLogos = [...keptLogos, ...newLogos]

  await client
    .patch(doc._id)
    .set({ [`blocks[${index}].logos`]: finalLogos })
    .commit()
  console.log(`Logo strip now: ${finalLogos.map((l) => l.name).join(', ')}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
