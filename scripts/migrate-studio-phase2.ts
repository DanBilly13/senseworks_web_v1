// Studio phase 2 (Nov 2026): renames the stored block fields and values
// to match what Studio shows — heading → headline, a hero's subhead →
// body, size/headingLevel → headlineSize (Card Grid's → titleSize), and
// background values that say what they are (inverse → dark, default →
// light/none/white…). The mapping itself is src/lib/sanity/upgradeBlock.ts,
// the same function the site runs every block through, so the two can't
// disagree.
//
// Every page document is covered: published, drafts and scheduled
// versions. Each write is guarded by the document's revision, so an edit
// made in Studio meanwhile makes that write fail instead of being lost
// (run it again and it picks up where it left off).
//
// Dry run (reads only, lists what would change):
//   npx sanity exec scripts/migrate-studio-phase2.ts --with-user-token
// Write:
//   npx sanity exec scripts/migrate-studio-phase2.ts --with-user-token -- --write
import { getCliClient } from 'sanity/cli'
import { needsUpgrade, upgradeBlock } from '../src/lib/sanity/upgradeBlock'

const client = getCliClient({ apiVersion: '2024-01-01' }).withConfig({ perspective: 'raw' })
const write = process.argv.includes('--write')

type Block = { _type: string; _key: string; [key: string]: unknown }
type Doc = { _id: string; _rev: string; blocks?: Block[] }

async function run() {
  const docs: Doc[] = await client.fetch(`*[_type == "page" && defined(blocks)]{ _id, _rev, blocks }`)
  let changedDocs = 0
  let changedBlocks = 0
  const tx = client.transaction()
  for (const doc of docs) {
    const stale = (doc.blocks ?? []).filter(needsUpgrade)
    if (!stale.length) continue
    changedDocs++
    changedBlocks += stale.length
    console.log(`${doc._id}: ${stale.length} blocks (${[...new Set(stale.map((b) => b._type))].join(', ')})`)
    tx.patch(doc._id, (patch) => patch.ifRevisionId(doc._rev).set({ blocks: doc.blocks!.map(upgradeBlock) }))
  }
  console.log(`\n${changedBlocks} blocks in ${changedDocs} of ${docs.length} page documents need upgrading.`)
  if (!write) {
    console.log('Dry run: nothing written. Add -- --write to apply.')
    return
  }
  if (!changedDocs) return
  // One transaction: every page changes together, or none does.
  const result = await tx.commit()
  console.log(`Written in one transaction (${result.transactionId}).`)
  const left: number = await client.fetch(`count(*[_type == "page" && defined(blocks)])`)
  console.log(`Checked ${left} page documents afterwards.`)
}

run()
