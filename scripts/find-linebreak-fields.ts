// Finds every string field on lp/v1 and lp/v2 containing an embedded
// newline, and reports which block type/component renders it — to check
// whether that renderer already splits on "\n" into separate paragraphs.
// Run with: npx sanity exec scripts/find-linebreak-fields.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

function walk(obj: any, path: string, blockType: string, cb: (blockType: string, path: string, value: string) => void) {
  if (typeof obj === 'string') {
    if (obj.includes('\n')) cb(blockType, path, obj)
    return
  }
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => walk(item, `${path}[${i}]`, blockType, cb))
    return
  }
  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith('_')) continue
      walk(value, path ? `${path}.${key}` : key, blockType, cb)
    }
  }
}

async function run() {
  const docs = await client.fetch<{ slug: string; blocks: any[] }[]>(
    `*[_type == "page" && slug.current in ["lp/v1", "lp/v2"]]{"slug": slug.current, blocks}`,
  )

  for (const doc of docs) {
    doc.blocks.forEach((block, index) => {
      walk(block, '', block._type, (blockType, path, value) => {
        console.log(`${doc.slug} [${index}] ${blockType}.${path} — "${value.slice(0, 50).replace(/\n/g, '|')}..."`)
      })
    })
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
