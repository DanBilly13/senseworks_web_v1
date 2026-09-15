// Fixes the heroBlock subhead on the lp/v3 draft: it accidentally had
// the headline text pasted in front of the real subhead, pushing it to
// 275 characters against the field's 200-char limit. Trims it back to
// just the intended copy (199 characters).
// Run with: npx sanity exec scripts/fix-lp-v3-hero-subhead.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const DOC_ID = 'drafts.7RAvjHZFNddW6ezWMHunXm'
const BLOCK_KEY = 'e2efe95a7e24'
const NEW_SUBHEAD =
  'En gemensam plattform för hela koncernen — med full stöd för ISA, KISA och ISA for LCE. Ni får central metodik, delad bemanning och överblick i realtid, medan varje byrå behåller sitt eget varumärke.'

async function run() {
  const result = await client
    .patch(DOC_ID)
    .set({ [`blocks[_key=="${BLOCK_KEY}"].subhead`]: NEW_SUBHEAD })
    .commit()

  console.log('Patched. New subhead length:', NEW_SUBHEAD.length)
  console.log('Result _rev:', result._rev)
}

run()
