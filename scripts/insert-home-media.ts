// Inserts a new mediaBlock right after the Hero Text block on the home page.
// Run with: npx sanity exec scripts/insert-home-media.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function run() {
  await client
    .patch('page-home-en')
    .insert('after', 'blocks[_key=="5fbcad100b52"]', [
      { _type: 'mediaBlock', _key: 'mediablock1' },
    ])
    .commit()
  console.log('Inserted mediaBlock after the Hero Text block on the home page.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
