// One-off: moves the header and footer out of every page into the shared
// "Site navigation" document. Takes the Home page's (the most up-to-date
// copy), gives the header's "#pricing" link the full "/en/home#pricing"
// so it works from any page, keeps LP v3's Swedish button text as the
// button's Swedish label, sets lp/* pages to the landing-page navigation,
// then removes the header/footer blocks from all pages. Dry run:
//   MIGRATE_DATASET=production npx sanity exec scripts/share-site-navigation.ts --with-user-token
// Add MIGRATE_APPLY=1 to write.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCliClient } from 'sanity/cli'

const dataset = process.env.MIGRATE_DATASET
const apply = process.env.MIGRATE_APPLY === '1'
if (!dataset) throw new Error('MIGRATE_DATASET not set')
const client = getCliClient({ apiVersion: '2024-01-01' }).withConfig({ dataset, perspective: 'raw' })

const drafts: string[] = await client.fetch('*[_type in ["page", "siteNavigation"] && _id in path("drafts.**")]._id')
if (drafts.length) throw new Error(`Publish or discard these drafts first: ${drafts.join(', ')}`)

const pages: any[] = await client.fetch('*[_type == "page"]')
const home = pages.find((page) => page.slug?.current === 'home')
const lp = pages.find((page) => page.slug?.current === 'lp/v3')
const header = home?.blocks?.find((block: any) => block._type === 'headerBlock')
const footer = home?.blocks?.find((block: any) => block._type === 'footerBlock')
if (!header || !footer) throw new Error('Home has no header/footer block to share')

const withoutKey = ({ _key, hidden, ...rest }: any) => rest
const sharedHeader = {
  ...withoutKey(header),
  navLinks: header.navLinks?.map((link: any) => (link.href === '#pricing' ? { ...link, href: '/en/home#pricing' } : link)),
  ctaLabel: { ...header.ctaLabel, ...(lp ? { sv: lp.blocks?.find((b: any) => b._type === 'headerBlock')?.ctaLabel?.en } : {}) },
}

let tx = client.transaction().createOrReplace({
  _id: 'siteNavigation',
  _type: 'siteNavigation',
  header: sharedHeader,
  footer: withoutKey(footer),
})
for (const page of pages) {
  const blocks = (page.blocks ?? []).filter((block: any) => block._type !== 'headerBlock' && block._type !== 'footerBlock')
  const removed = (page.blocks?.length ?? 0) - blocks.length
  const navigation = page.slug?.current?.startsWith('lp/') ? 'landing' : 'full'
  console.log(`${page.slug?.current}: remove ${removed} header/footer block(s), navigation ${navigation}`)
  tx = tx.patch(page._id, (patch) => patch.set({ blocks, navigation }))
}
console.log('Site navigation header CTA:', JSON.stringify(sharedHeader.ctaLabel))
if (apply) {
  await tx.commit({ visibility: 'sync' })
  console.log('applied')
}
