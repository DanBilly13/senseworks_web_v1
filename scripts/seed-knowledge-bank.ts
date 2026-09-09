// Seeds placeholder Knowledge Bank content: a handful of tags, two
// authors, and a set of articles (real titles/authors/dates lifted
// from the live Webflow kunskapscenter for continuity — body copy is
// placeholder, pending the real Webflow import).
// Run with: npx sanity exec scripts/seed-knowledge-bank.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const TAGS = ['Guider', 'Analys', 'Integrationer', 'Revision', 'Onboarding'] as const
type TagTitle = (typeof TAGS)[number]

const AUTHORS = [
  { _id: 'author-isak-forslund', name: 'Isak Forslund', role: 'Support' },
  { _id: 'author-linnea-jonsson', name: 'Linnéa Jonsson', role: 'Customer Success' },
]

const ARTICLES: {
  title: string
  subtitle: string
  authorId: string
  publishedAt: string
  tags: TagTitle[]
  body: string[]
}[] = [
  {
    title: 'Senseworks Support: Anslut till Teams',
    subtitle: 'Såhär ansluter du till Senseworks supportkanal på Microsoft Teams',
    authorId: 'author-isak-forslund',
    publishedAt: '2023-10-15',
    tags: ['Guider'],
    body: [
      'Via Microsoft Teams kan du kontakta oss när du har frågor om programmet, upplever problem eller har något annat du vill diskutera.',
      'Placeholder-text — det fullständiga innehållet importeras senare från den befintliga sidan.',
    ],
  },
  {
    title: 'Underlagsöversikt: en praktisk guide för revisionsuppdrag',
    subtitle: 'En praktisk guide för revisionsuppdrag',
    authorId: 'author-linnea-jonsson',
    publishedAt: '2026-05-26',
    tags: ['Guider', 'Revision'],
    body: [
      'En översikt över hur underlag samlas in och struktureras för ett revisionsuppdrag i Senseworks.',
      'Placeholder-text — det fullständiga innehållet importeras senare från den befintliga sidan.',
    ],
  },
  {
    title: 'Bjorn Lunden: Integration - Allt du behöver veta',
    subtitle: 'Externa integrationer',
    authorId: 'author-linnea-jonsson',
    publishedAt: '2026-06-03',
    tags: ['Integrationer'],
    body: [
      'Så kopplar du samman Senseworks med Björn Lundén för att hämta data automatiskt.',
      'Placeholder-text — det fullständiga innehållet importeras senare från den befintliga sidan.',
    ],
  },
  {
    title: 'Modifierad revisionsberättelse i Senseworks',
    subtitle: 'Så hanterar du en modifierad revisionsberättelse',
    authorId: 'author-linnea-jonsson',
    publishedAt: '2026-04-01',
    tags: ['Revision'],
    body: [
      'En genomgång av flödet för en modifierad revisionsberättelse i plattformen.',
      'Placeholder-text — det fullständiga innehållet importeras senare från den befintliga sidan.',
    ],
  },
  {
    title: 'Förstå och dokumentera processer i revisionen',
    subtitle: 'Processdokumentation för revisionsteam',
    authorId: 'author-linnea-jonsson',
    publishedAt: '2026-05-29',
    tags: ['Revision', 'Guider'],
    body: [
      'Hur du dokumenterar en klients processer på ett sätt som håller genom hela uppdraget.',
      'Placeholder-text — det fullständiga innehållet importeras senare från den befintliga sidan.',
    ],
  },
  {
    title: 'Navigera som ett proffs: Analysanvändare',
    subtitle: 'Kom igång snabbare som analysanvändare',
    authorId: 'author-linnea-jonsson',
    publishedAt: '2026-04-17',
    tags: ['Analys', 'Onboarding'],
    body: [
      'Genvägar och vyer i Senseworks Analys som gör att nya användare kommer igång snabbare.',
      'Placeholder-text — det fullständiga innehållet importeras senare från den befintliga sidan.',
    ],
  },
  {
    title: 'Navigera som ett proffs: Revisionsanvändare',
    subtitle: 'Kom igång snabbare som revisionsanvändare',
    authorId: 'author-linnea-jonsson',
    publishedAt: '2026-04-17',
    tags: ['Revision', 'Onboarding'],
    body: [
      'Genvägar och vyer i Senseworks Revision som gör att nya användare kommer igång snabbare.',
      'Placeholder-text — det fullständiga innehållet importeras senare från den befintliga sidan.',
    ],
  },
]

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function toPortableText(paragraphs: string[]) {
  return paragraphs.map((text) => ({
    _type: 'block',
    _key: slugify(text).slice(0, 40),
    style: 'normal',
    children: [{ _type: 'span', _key: `${slugify(text).slice(0, 40)}-span`, text }],
  }))
}

async function run() {
  const tagIds = new Map<TagTitle, string>()
  for (const title of TAGS) {
    const id = `tag-${slugify(title)}`
    tagIds.set(title, id)
    await client.createIfNotExists({
      _id: id,
      _type: 'tag',
      title,
      slug: { _type: 'slug', current: slugify(title) },
    })
  }
  console.log(`Ensured ${TAGS.length} tags.`)

  for (const author of AUTHORS) {
    await client.createIfNotExists({ _id: author._id, _type: 'author', name: author.name, role: author.role })
  }
  console.log(`Ensured ${AUTHORS.length} authors.`)

  for (const article of ARTICLES) {
    const id = `article-${slugify(article.title)}`
    await client.createIfNotExists({
      _id: id,
      _type: 'article',
      title: article.title,
      slug: { _type: 'slug', current: slugify(article.title) },
      subtitle: article.subtitle,
      language: 'sv',
      publishedAt: new Date(article.publishedAt).toISOString(),
      author: { _type: 'reference', _ref: article.authorId },
      tags: article.tags.map((title) => ({
        _type: 'reference',
        _ref: tagIds.get(title),
        _key: tagIds.get(title),
      })),
      body: toPortableText(article.body),
    })
    console.log(`Ensured article: ${article.title}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
