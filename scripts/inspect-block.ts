import { getCliClient } from 'sanity/cli'
const client = getCliClient()
async function run() {
  const doc = await client.fetch(
    `*[_type == "page" && slug.current == "lp/v1"][0]{_id, blocks}`,
  )
  const idx = doc.blocks.findIndex((b: any) => b.heading === 'Därför går det att lova')
  console.log('index', idx)
  console.log(JSON.stringify(doc.blocks[idx], null, 2))
}
run()
