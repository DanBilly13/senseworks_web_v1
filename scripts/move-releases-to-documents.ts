// One-off: releases become documents and get their own page.
// 1. Home's hand-typed Release Cards become Release documents (shipped,
//    their "1 Oct 2026" dates as real dates); Home's block then shows
//    the newest 4 automatically.
// 2. Creates the Releases page (/releases): a text hero, the Releases
//    Timeline and a closing CTA banner, English and Swedish.
// 3. Adds "Releases" / "Släpp" to the shared header, after Data.
// 4. Home's release heading gets its agreed Swedish wording.
// Dry run:
//   MIGRATE_DATASET=production npx sanity exec scripts/move-releases-to-documents.ts --with-user-token
// Add MIGRATE_APPLY=1 to write.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCliClient } from 'sanity/cli'

const dataset = process.env.MIGRATE_DATASET
const apply = process.env.MIGRATE_APPLY === '1'
if (!dataset) throw new Error('MIGRATE_DATASET not set')
const client = getCliClient({ apiVersion: '2024-01-01' }).withConfig({ dataset, perspective: 'raw' })

const drafts: string[] = await client.fetch('*[_id in ["drafts.page-home-en", "drafts.siteNavigation", "drafts.page-releases"]]._id')
if (drafts.length) throw new Error(`Publish or discard these drafts first: ${drafts.join(', ')}`)

const home = await client.getDocument('page-home-en')
const block = home?.blocks?.find((b: any) => b._key === 'home-releases')
if (!block) throw new Error('No Release Cards block on Home')

const MONTHS: Record<string, string> = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
const toIsoDate = (typed?: string) => {
  const match = typed?.match(/^(\d{1,2}) (\w{3})\w* (\d{4})$/)
  if (!match || !MONTHS[match[2]]) throw new Error(`Can't read the date "${typed}"`)
  return `${match[3]}-${MONTHS[match[2]]}-${match[1].padStart(2, '0')}`
}
const slugify = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)

const releases = (block.cards ?? []).map((card: any) => {
  const date = toIsoDate(card.date?.en ?? card.date)
  return {
    _id: `release-${slugify(card.title?.en ?? card.title)}`,
    _type: 'release',
    title: card.title,
    ...(card.description ? { description: card.description } : {}),
    ...(card.tag ? { tag: card.tag } : {}),
    stage: card.stage ?? 'shipped',
    date,
    ...(card.media ? { media: card.media } : {}),
    ...(card.team?.length ? { team: card.team } : {}),
  }
})

const releasesPage = {
  _id: 'page-releases',
  _type: 'page',
  title: { en: 'Releases', sv: 'Släpp' },
  slug: { _type: 'slug', current: 'releases' },
  theme: 'default',
  navigation: 'full',
  seoTitle: { en: 'Releases | Senseworks', sv: 'Släpp | Senseworks' },
  seoDescription: {
    en: "What's rolling out in Senseworks now, what we've shipped month by month, and what we're building next.",
    sv: 'Det som rullas ut i Senseworks nu, det vi har släppt månad för månad och det vi bygger härnäst.',
  },
  blocks: [
    {
      _key: 'releases-hero',
      _type: 'heroTextBlock',
      eyebrow: { en: "We're shipping", sv: 'Vi släpper' },
      headline: { en: 'New in Senseworks', sv: 'Nytt i Senseworks' },
      subhead: {
        en: "What's rolling out now, what we've shipped month by month, and what we're building next.",
        sv: 'Det som rullas ut nu, det vi har släppt månad för månad och det vi bygger härnäst.',
      },
    },
    {
      _key: 'releases-timeline',
      _type: 'releaseTimelineBlock',
      rollingOutHeading: { en: 'Rolling out', sv: 'Rullas ut' },
      rollingOutBody: { en: 'Coming to everyone.', sv: 'På väg till alla.' },
      shippedHeading: { en: 'Shipped', sv: 'Släppt' },
      developmentHeading: { en: 'In development', sv: 'Under utveckling' },
      developmentBody: { en: "What we're building next.", sv: 'Det vi bygger härnäst.' },
    },
    {
      _key: 'releases-cta',
      _type: 'ctaBannerBlock',
      tone: 'inverse',
      heading: { en: 'Missing something in Senseworks?', sv: 'Saknar du något i Senseworks?' },
      body: {
        en: 'Tell us what would make your work easier. It shapes what we build next.',
        sv: 'Berätta vad som skulle göra ditt arbete enklare. Det styr vad vi bygger härnäst.',
      },
      ctaLabel: { en: 'Get in touch', sv: 'Hör av dig' },
      ctaHref: '#book-meeting',
    },
  ],
}

const nav = await client.getDocument('siteNavigation')
const navLinks: any[] = nav?.header?.navLinks ?? []
const hasLink = navLinks.some((link) => link.href === '/en/releases')
const afterData = navLinks.findIndex((link) => link._key === 'nav-data') + 1 || navLinks.length
const newNavLinks = hasLink
  ? navLinks
  : [...navLinks.slice(0, afterData), { _key: 'nav-releases', label: { en: 'Releases', sv: 'Släpp' }, href: '/en/releases' }, ...navLinks.slice(afterData)]

for (const release of releases) console.log(`release ${release._id}: ${release.title?.en} (${release.date})`)
console.log('nav:', newNavLinks.map((link) => link.label?.en).join(' | '))

if (apply) {
  let tx = client.transaction()
  for (const release of releases) tx = tx.createOrReplace(release)
  tx = tx
    .createOrReplace(releasesPage)
    .patch('page-home-en', (patch) =>
      patch
        .set({ 'blocks[_key=="home-releases"].count': 4, 'blocks[_key=="home-changelog"].headline.sv': 'Det här har vi\nsläppt nyligen.' })
        .unset(['blocks[_key=="home-releases"].cards']),
    )
    .patch('siteNavigation', (patch) => patch.set({ 'header.navLinks': newNavLinks }))
  await tx.commit({ visibility: 'sync' })
  console.log('applied')
}
