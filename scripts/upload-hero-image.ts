// Uploads Hero01.webp as a Sanity image asset and sets it on the first
// mediaBlock (the big hero-adjacent media) on both lp/v1 and lp/v2.
// Run with: npx sanity exec scripts/upload-hero-image.ts --with-user-token
import { getCliClient } from 'sanity/cli'
import { createReadStream } from 'fs'

const client = getCliClient()

const IMAGE_PATH =
  '/Users/danielbillingham/Documents/senseworks/web-bits/Graphics/Still Images/Hero01.webp'

async function run() {
  const asset = await client.assets.upload('image', createReadStream(IMAGE_PATH), {
    filename: 'Hero01.webp',
  })
  console.log(`Uploaded Hero01.webp -> ${asset._id}`)

  for (const slug of ['lp/v1', 'lp/v2']) {
    const doc = await client.fetch<{
      _id: string
      blocks: { _key: string; _type: string }[]
    }>(`*[_type == "page" && slug.current == $slug][0]{_id, blocks}`, { slug })

    if (!doc) throw new Error(`${slug} page not found`)

    const index = doc.blocks.findIndex((b) => b._type === 'mediaBlock')
    if (index === -1) throw new Error(`No mediaBlock found on ${slug}`)

    await client
      .patch(doc._id)
      .set({
        [`blocks[${index}].media`]: {
          _type: 'media',
          mediaType: 'image',
          alt: 'Hero',
          image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
        },
      })
      .commit()
    console.log(`Set Hero01.webp on ${slug}'s first mediaBlock (index ${index}).`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
