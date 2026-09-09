import { getCliClient } from 'sanity/cli'
const client = getCliClient()
async function run() {
  const docs = await client.fetch(
    `*[_type == "page" && slug.current == "home"]{_id, language, "blocks": blocks[]{_type, _key}}`,
  )
  console.log(JSON.stringify(docs, null, 2))
}
run()
