import { getCliClient } from 'sanity/cli'
const client = getCliClient()
async function run() {
  const doc = await client.fetch(
    `*[_type == "page" && slug.current == "lp/v1"][0]{_id, "blocks": blocks[]{_type, _key, heading, headline}}`,
  )
  console.log(JSON.stringify(doc.blocks.filter((b: any) => b.heading || b.headline), null, 2))
}
run()
