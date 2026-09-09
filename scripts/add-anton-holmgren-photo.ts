// Adds Anton Holmgren's photo — added to web-bits/Team after the
// initial seed-team.ts run, which had no image file for him yet.
// Run with: npx sanity exec scripts/add-anton-holmgren-photo.ts --with-user-token
import fs from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'

const client = getCliClient()
const ASSET_DIR = '/Users/danielbillingham/Documents/senseworks/web-bits/Team'
const FILENAME = 'antonHolmgren.png'
const DOC_ID = 'teamMember-anton-holmgren'

async function run() {
  const stream = fs.createReadStream(path.join(ASSET_DIR, FILENAME))
  const asset = await client.assets.upload('image', stream, { filename: FILENAME })
  await client
    .patch(DOC_ID)
    .set({
      photo: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    })
    .commit()
  console.log(`Added photo for Anton Holmgren (${DOC_ID}).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
