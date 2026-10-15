// Merges customer stories and articles from one document per language
// into one document per story/article with English/Swedish text pairs
// (see src/sanity/i18n/). Dry run:
//   MIGRATE_DATASET=production npx sanity exec scripts/merge-language-versions.ts --with-user-token
// Add MIGRATE_APPLY=1 to write. Already-merged documents (no `language`)
// are left alone, so it's safe to run twice.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCliClient } from 'sanity/cli'
import { schemaTypes } from '../src/sanity/schemaTypes'
import { mergeLanguageVersions } from '../src/sanity/i18n/migrateToPairs'

const dataset = process.env.MIGRATE_DATASET
const apply = process.env.MIGRATE_APPLY === '1'
if (!dataset) throw new Error('MIGRATE_DATASET not set')
const client = getCliClient({ apiVersion: '2024-01-01' }).withConfig({ dataset, perspective: 'raw' })

const TYPES = ['customerStory', 'article']
// Not yet merged: has a language, or (one stray article) a plain-text
// title rather than an English/Swedish pair.
const docs: any[] = await client.fetch(
  '*[_type in $types && (defined(language) || (defined(title) && !defined(title.en) && !defined(title.sv)))]',
  { types: TYPES },
)

const drafts = docs.filter((doc) => doc._id.startsWith('drafts.'))
if (drafts.length) throw new Error(`Publish or discard these drafts first: ${drafts.map((d) => d._id).join(', ')}`)

// Group the language versions by type + slug.
const groups = new Map<string, { en?: any; sv?: any; ids: string[] }>()
for (const doc of docs) {
  // One article has no language set; its text is Swedish.
  const language = doc.language ?? 'sv'
  if (!doc.language) console.log(`note: ${doc._id} has no language, treated as Swedish`)
  const key = `${doc._type}-${doc.slug?.current}`
  const group = groups.get(key) ?? { ids: [] }
  if (group[language as 'en' | 'sv']) throw new Error(`Two ${language} versions for ${key}`)
  group[language as 'en' | 'sv'] = doc
  group.ids.push(doc._id)
  groups.set(key, group)
}

const oldIds = docs.map((doc) => doc._id)
const referencing: string[] = await client.fetch('*[references($ids)]._id', { ids: oldIds })
if (referencing.length) throw new Error(`Other documents reference these: ${referencing.join(', ')}`)

let tx = client.transaction()
for (const [id, group] of groups) {
  const merged = mergeLanguageVersions(group, schemaTypes as any[], id)
  console.log(`${id} ← ${group.ids.join(' + ')}`)
  tx = tx.createOrReplace(merged as any)
  for (const oldId of group.ids) if (oldId !== id) tx = tx.delete(oldId)
}
console.log(`${groups.size} merged documents from ${docs.length} (dataset ${dataset})`)
if (apply && groups.size) {
  await tx.commit({ visibility: 'sync' })
  console.log('applied')
}
