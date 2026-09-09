import { getCliClient } from 'sanity/cli'
const client = getCliClient()
async function run() {
  const docs = await client.fetch(
    `*[_type == "page" && slug.current in ["home","lp/v1"]]{_id, "slug": slug.current, "blocks": blocks[]{_type, _key, logos}}`,
  )
  for (const doc of docs) {
    const logoBlock = doc.blocks.find((b: any) => b._type === 'logoCloudBlock')
    console.log(doc._id, doc.slug, JSON.stringify(logoBlock, null, 2))
  }
}
run()
