// Field-level translation migration (see src/sanity/i18n/). Dry run:
//   MIGRATE_DATASET=production npx sanity exec scripts/migrate-field-i18n.ts --with-user-token
// Add MIGRATE_APPLY=1 to write. Safe to run twice.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCliClient } from 'sanity/cli'
import { schemaTypes } from '../src/sanity/schemaTypes'
import { migrateDocument } from '../src/sanity/i18n/migrateToPairs'

const dataset = process.env.MIGRATE_DATASET
const apply = process.env.MIGRATE_APPLY === '1'
if (!dataset) throw new Error('MIGRATE_DATASET not set')
const client = getCliClient({ apiVersion: '2024-01-01' }).withConfig({ dataset, perspective: 'raw' })

const docs: any[] = await client.fetch('*[!(_id in path("_.**")) && !(_type match "sanity.*") && !(_type match "system.*")]')
let tx = client.transaction()
let changed = 0
for (const doc of docs) {
  const next = migrateDocument(doc, schemaTypes as any[])
  if (JSON.stringify(next) !== JSON.stringify(doc)) {
    changed++
    console.log('migrate', doc._type, doc._id)
    tx = tx.createOrReplace(next)
  }
}
console.log(`${changed} of ${docs.length} documents change (dataset ${dataset})`)
if (apply && changed) {
  await tx.commit({ visibility: 'sync' })
  console.log('applied')
}
