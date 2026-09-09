// Uploads the real customer logos from web-bits/Graphics/Customer Logos
// as Sanity image assets and wires them into the lp/v1 logoCloudBlock
// (replacing its placeholder "Azets"/"Logotyp" entries). The component
// already auto-repeats the set to fill the marquee track, so one entry
// per logo is enough — no manual duplication needed.
// Run with: npx sanity exec scripts/upload-lp-v1-logos.ts --with-user-token
import { getCliClient } from 'sanity/cli'
import { createReadStream } from 'fs'
import { join } from 'path'

const client = getCliClient()

const LOGO_DIR = '/Users/danielbillingham/Documents/senseworks/web-bits/Graphics/Customer Logos'

const LOGOS = [
  { file: 'azets.png', name: 'Azets' },
  { file: 'bakertilly-cp.svg', name: 'Baker Tilly' },
  { file: 'radek-cp.svg', name: 'Radek' },
  { file: 'revideco-logga-cp.svg', name: 'Revideco' },
  { file: 'weAudit-cp.svg', name: 'weAudit' },
  { file: 'JDG-Hack.png', name: 'JDG' },
]

async function run() {
  const doc = await client.fetch<{
    _id: string
    blocks: { _key: string; _type: string }[]
  }>(`*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`)

  if (!doc) throw new Error('lp/v1 page not found')

  const index = doc.blocks.findIndex((b) => b._type === 'logoCloudBlock')
  if (index === -1) throw new Error('logoCloudBlock not found')

  const newLogos = []
  for (const { file, name } of LOGOS) {
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

  await client
    .patch(doc._id)
    .set({ [`blocks[${index}].logos`]: newLogos })
    .commit()
  console.log(`Set ${newLogos.length} real logos on the logoCloudBlock.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
