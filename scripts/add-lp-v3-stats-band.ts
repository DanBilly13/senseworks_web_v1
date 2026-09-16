// Replaces lp/v3's "Över 90 byråer..." sectionHeadlineBlock (right
// before the Logo Cloud) with the same Stats Band content already
// live on lp/v2 — same heading and stats, minus the subtext body,
// per Dan's request to drop that when porting it over.
// Run with: npx sanity exec scripts/add-lp-v3-stats-band.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const DOC_ID = '7RAvjHZFNddW6ezWMHunXm'
const BLOCK_KEY = 'v3k8'

const STATS_BAND_BLOCK = {
  _key: BLOCK_KEY,
  _type: 'statsBandBlock',
  heading: 'Beprövat av Nordens ledande byråer',
  items: [
    { _key: 'v3stat1', value: '70%', label: 'byråer i daglig drift' },
    { _key: 'v3stat2', value: '1 000+', label: 'revisorer' },
    { _key: 'v3stat3', value: '20%', label: 'kortare uppdragstid' },
    { _key: 'v3stat4', value: '7M', label: 'revisioner' },
  ],
}

async function run() {
  const result = await client
    .patch(DOC_ID)
    .set({ [`blocks[_key=="${BLOCK_KEY}"]`]: STATS_BAND_BLOCK })
    .commit()

  console.log('Patched. New _rev:', result._rev)
}

run()
