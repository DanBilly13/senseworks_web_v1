import { getCliClient } from 'sanity/cli'
const client = getCliClient()
async function run() {
  const doc = await client.fetch(
    `*[_type == "page" && slug.current == "lp/v1"][0]{_id, "blocks": blocks[]{_type, _key}}`,
  )
  console.log(JSON.stringify(doc, null, 2))
}
run()
