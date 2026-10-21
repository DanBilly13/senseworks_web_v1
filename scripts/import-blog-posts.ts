// One-off: imports every post from the old site's News section
// (senseworks.io/nyheter) as Blog post documents — Swedish, plus English
// where the old site had a real translation (its /en/ pages otherwise
// show the Swedish text), cover and inline images uploaded, authors
// linked to Team members, tagged News or Insights, and linked to the
// full customer story where there is one. Dry run:
//   MIGRATE_DATASET=production npx sanity exec scripts/import-blog-posts.ts --with-user-token
// Add MIGRATE_APPLY=1 to write. Re-running replaces the posts (ids are
// blogPost-<slug>); Sanity reuses already-uploaded images.
/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-expect-error -- jsdom ships no type definitions; this one-off script only needs JSDOM.
import { JSDOM } from 'jsdom'
import { getCliClient } from 'sanity/cli'

const dataset = process.env.MIGRATE_DATASET
const apply = process.env.MIGRATE_APPLY === '1'
if (!dataset) throw new Error('MIGRATE_DATASET not set')
const client = getCliClient({ apiVersion: '2024-01-01' }).withConfig({ dataset })

const BASE = 'https://www.senseworks.io'
const get = async (url: string) => (await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })).text()
const doc = (html: string) => new JSDOM(html).window.document
const key = () => Math.random().toString(36).slice(2, 10)

// Webflow saved Adsum's post under Höglandets' slug with "-2"; it gets
// its own (the old address redirects, see next.config.ts).
const SLUG_FIXES: Record<string, string> = {
  'hoglandets-revisionsbyra-valjer-senseworks-revision-2': 'adsum-revision-valjer-senseworks-revision',
}
// Written in English but filed as Swedish on the old site: the text goes
// into both languages, as the old site showed it.
const ENGLISH_ONLY = new Set([
  'zeyad-haroun-on-ally-and-the-future-of-ai-in-auditing',
  'senseworks-starts-data-analytics-collaboration-with-lulea-university-of-technology',
])
// Funding, partnerships, launches, awards, events, new hires and board
// members, customers choosing Senseworks. Everything else is Insights.
const NEWS = new Set([
  'senseworks-starts-data-analytics-collaboration-with-lulea-university-of-technology',
  'senseworks-tilldelas-finansiering-fran-vinnova-for-att-utveckla-senseworks-dataanalys-plattform',
  'ai-verktyg-kan-spara-revisionsbranschen-3-miljoner-arbetstimmar',
  'maneki',
  'fineasity-investerar-i-senseworks-analys-for-att-ersatta-transaktionsanalys',
  'motiverat-nar-atrakta-valjer-senseworks-analys',
  'traffa-helene-willberg-styrelseproffs-och-investerare-i-senseworks',
  'sara-uhlen-radgivare-investerare-styrelseledamot-i-senseworks',
  'vi-traffade-peter-ny-cro-pa-senseworks',
  'vi-traffade-linnea-och-josefine---vara-nya-customer-success-managers-pa-senseworks',
  'senseworks-tar-in-30-miljoner-for-att-transformera-revisionsbranschen',
  'senseworks-och-wesoft-integrerar-sina-system-tatare-och-skapar-en-komplett-mjukvarusvit-for-framtidens-sme-byraer',
  'hoglandets-revisionsbyra-valjer-senseworks-revision',
  'hoglandets-revisionsbyra-valjer-senseworks-revision-2',
  'munka-ljungby-revision-valjer-senseworks-revision',
  'spiris-senseworks-tillsammans-for-framtidens-byra',
  'kungsbron-och-senseworks-forst-i-sverige-med-isa-lce',
  'warmare-utses-till-arets-framtidsbyra-2025',
  'framtidsresan',
  'baker-tilly-blickar-mot-framtiden-tillsammans-med-senseworks',
  'retora-tar-klivet-in-i-framtiden-med-senseworks',
])
// Posts with a full customer story (one with its own body).
const CUSTOMER_STORY: Record<string, string> = {
  'hoglandets-revisionsbyra-valjer-senseworks-revision': 'customerStory-hoglandets-revisionsbyra',
  'hoglandets-revisionsbyra-valjer-senseworks-revision-2': 'customerStory-adsum-revision',
  'baker-tilly-blickar-mot-framtiden-tillsammans-med-senseworks': 'customerStory-baker-tilly-mlt',
  'vad-kravs-for-att-bygga-framtidens-revisionsbyra': 'customerStory-goteborgs-revision',
  'retora-tar-klivet-in-i-framtiden-med-senseworks': 'customerStory-retora',
}

const uploaded = new Map<string, any>()
async function image(url: string) {
  if (!apply) return { _type: 'image', asset: { _type: 'reference', _ref: `(would upload ${url.slice(-40)})` } }
  if (!uploaded.has(url)) {
    const buffer = Buffer.from(await (await fetch(url)).arrayBuffer())
    const filename = decodeURIComponent(url.split('/').pop() ?? 'image').replace(/^[a-f0-9]{24}_/, '')
    const asset = await client.assets.upload('image', buffer, { filename })
    uploaded.set(url, { _type: 'image', asset: { _type: 'reference', _ref: asset._id } })
  }
  return uploaded.get(url)
}

// Webflow rich text → Portable Text.
const clean = (text: string) => text.replace(/‍/g, '').replace(/\s+/g, ' ')
async function toBlocks(html: string) {
  const root = doc(`<div id="r">${html}</div>`).getElementById('r')!
  const blocks: any[] = []
  const inline = (el: Element) => {
    const markDefs: any[] = []
    const children: any[] = []
    const walk = (node: Node, marks: string[]) => {
      if (node.nodeType === 3) {
        const text = clean(node.textContent ?? '')
        if (text) children.push({ _type: 'span', _key: key(), text, marks })
        return
      }
      if (node.nodeType !== 1) return
      const tag = (node as Element).tagName
      if (tag === 'BR') return void children.push({ _type: 'span', _key: key(), text: '\n', marks })
      let next = marks
      if (tag === 'STRONG' || tag === 'B') next = [...marks, 'strong']
      if (tag === 'EM' || tag === 'I') next = [...marks, 'em']
      if (tag === 'A') {
        const href = (node as Element).getAttribute('href')
        if (href) {
          const markKey = key()
          markDefs.push({ _type: 'link', _key: markKey, href: href.startsWith('/') ? `${BASE}${href}` : href })
          next = [...marks, markKey]
        }
      }
      node.childNodes.forEach((child) => walk(child, next))
    }
    el.childNodes.forEach((child) => walk(child, []))
    // Trim the outer whitespace the HTML formatting left behind.
    if (children.length) {
      children[0].text = children[0].text.replace(/^\s+/, '')
      children[children.length - 1].text = children[children.length - 1].text.replace(/\s+$/, '')
    }
    return { children: children.filter((span) => span.text), markDefs }
  }
  const text = (el: Element) => clean(el.textContent ?? '').trim()
  const push = async (el: Element) => {
    const tag = el.tagName
    if (tag === 'FIGURE' || (tag === 'DIV' && el.querySelector(':scope > img'))) {
      const img = el.querySelector('img')
      if (!img?.getAttribute('src')) return
      const caption = el.querySelector('figcaption') ? text(el.querySelector('figcaption')!) : ''
      return void blocks.push({ ...(await image(img.getAttribute('src')!)), _key: key(), ...(img.alt ? { alt: img.alt } : {}), ...(caption ? { caption } : {}) })
    }
    if (tag === 'UL' || tag === 'OL') {
      for (const li of el.querySelectorAll(':scope > li')) {
        const { children, markDefs } = inline(li)
        if (children.length) blocks.push({ _type: 'block', _key: key(), style: 'normal', listItem: tag === 'UL' ? 'bullet' : 'number', level: 1, children, markDefs })
      }
      return
    }
    const style = { P: 'normal', H1: 'h2', H2: 'h2', H3: 'h3', H4: 'h4', H5: 'h4', H6: 'h4', BLOCKQUOTE: 'blockquote' }[tag]
    if (!style) {
      for (const child of el.children) await push(child)
      return
    }
    if (!text(el)) return
    const { children, markDefs } = inline(el)
    // An all-bold paragraph ending in "?" is an interview question.
    const allBold = children.every((span: any) => span.marks.includes('strong') || !span.text.trim())
    if (style === 'normal' && allBold && /\?\s*$/.test(text(el))) {
      return void blocks.push({ _type: 'block', _key: key(), style: 'question', children: children.map((s: any) => ({ ...s, marks: s.marks.filter((m: string) => m !== 'strong') })), markDefs })
    }
    blocks.push({ _type: 'block', _key: key(), style, children, markDefs })
  }
  for (const child of root.children) await push(child)
  return blocks
}

function parsePost(html: string) {
  const d = doc(html)
  const rich = d.querySelector('.w-richtext')
  return {
    title: clean(d.querySelector('h1')?.textContent ?? '').trim(),
    date: (d.body.textContent?.match(/20\d\d-\d\d-\d\d/) ?? [])[0],
    cover: d.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? undefined,
    bodyHtml: rich?.innerHTML ?? '',
    bodyText: clean(rich?.textContent ?? '').trim(),
  }
}

const list = doc(await get(`${BASE}/nyheter`))
const cards = new Map<string, { author?: string; cover?: string }>()
for (const a of list.querySelectorAll('a[href*="/nyheter/"]')) {
  const slug = a.getAttribute('href')!.split('/nyheter/')[1]
  if (!slug || cards.has(slug)) continue
  const card = a.closest('[role="listitem"], .w-dyn-item') ?? a
  const texts = [...card.querySelectorAll('*')].filter((e) => !e.children.length).map((e) => e.textContent?.trim()).filter(Boolean)
  cards.set(slug, { author: texts[texts.length - 1] as string, cover: card.querySelector('img')?.getAttribute('src') ?? undefined })
}

const team: { _id: string; name: string }[] = await client.fetch('*[_type == "teamMember"]{ _id, name }')
const docs: any[] = []
const problems: string[] = []
for (const [oldSlug, card] of cards) {
  const sv = parsePost(await get(`${BASE}/nyheter/${oldSlug}`))
  const enPage = parsePost(await get(`${BASE}/en/nyheter/${oldSlug}`))
  const englishOnly = ENGLISH_ONLY.has(oldSlug)
  const hasEnglish = englishOnly || (!!enPage.bodyText && enPage.bodyText.slice(0, 200) !== sv.bodyText.slice(0, 200))
  const author = team.find((member) => member.name === card.author)
  if (!author) problems.push(`${oldSlug}: no team member "${card.author}"`)
  if (!sv.date) problems.push(`${oldSlug}: no date`)
  const svBody = await toBlocks(sv.bodyHtml)
  const enBody = hasEnglish ? (englishOnly ? svBody : await toBlocks(enPage.bodyHtml)) : undefined
  const coverUrl = sv.cover ?? card.cover
  const slug = SLUG_FIXES[oldSlug] ?? oldSlug
  docs.push({
    // Document ids are capped at 128 characters; the slug (the address) isn't.
    _id: `blogPost-${slug.slice(0, 110).replace(/-+$/, '')}`,
    _type: 'blogPost',
    title: { sv: sv.title, ...(hasEnglish ? { en: englishOnly ? sv.title : enPage.title } : {}) },
    slug: { _type: 'slug', current: slug },
    tag: NEWS.has(oldSlug) ? 'news' : 'insights',
    publishedAt: sv.date,
    ...(author ? { author: { _type: 'reference', _ref: author._id } } : {}),
    ...(coverUrl ? { coverImage: await image(coverUrl) } : {}),
    ...(CUSTOMER_STORY[oldSlug] ? { customerStory: { _type: 'reference', _ref: CUSTOMER_STORY[oldSlug] } } : {}),
    body: { sv: svBody, ...(enBody ? { en: enBody } : {}) },
  })
  const styles = svBody.reduce((acc: Record<string, number>, b: any) => ((acc[b.listItem ?? b.style ?? b._type] = (acc[b.listItem ?? b.style ?? b._type] ?? 0) + 1), acc), {})
  console.log(`${sv.date} ${hasEnglish ? 'EN' : '  '} ${docs.at(-1).tag.padEnd(8)} ${slug.slice(0, 60).padEnd(60)} ${JSON.stringify(styles)}`)
}
console.log(`\n${docs.length} posts, ${docs.filter((d) => d.title.en).length} with English, ${docs.filter((d) => d.tag === 'news').length} News`)
if (problems.length) console.log('Problems:\n' + problems.join('\n'))

if (apply) {
  let tx = client.transaction()
  for (const post of docs) tx = tx.createOrReplace(post)
  await tx.commit({ visibility: 'sync' })
  console.log('applied')
}
