// Diagnostic: fetches lp/v1 and lp/v2 and checks every known
// max-length-constrained text field against its schema limit, printing
// any violations with their actual length.
// Run with: npx sanity exec scripts/check-max-lengths.ts --with-user-token
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

// field path (dot-notation, [] for array-of) -> schema max
const LIMITS: Record<string, number> = {
  'heroTextBlock.eyebrow': 200, // no schema max actually — string type, skip via undefined check below
  'heroTextBlock.headline': 80,
  'heroTextBlock.subhead': 350,
  'featureSplitBlock.heading': 100,
  'featureSplitBlock.body': 600,
  'featureGridBlock.heading': 100,
  'featureGridBlock.body': 300,
  'featureGridBlock.items[].title': 80,
  'featureGridBlock.items[].description': 600,
  'bentoGridBlock.heading': 100,
  'bentoGridBlock.body': 300,
  'bentoGridBlock.items[].heading': 150,
  'bentoGridBlock.items[].body': 200,
  'testimonialCarouselBlock.heading': 100,
  'testimonialCarouselBlock.body': 300,
  'testimonialCarouselBlock.items[].quote': 220,
  'faqAccordionBlock.items[].question': 120,
  'faqAccordionBlock.items[].answer': 400,
  'ctaBannerBlock.heading': 100,
  'ctaBannerBlock.body': 300,
  'statsBandBlock.heading': 100,
  'statsBandBlock.body': 300,
  'sectionHeadlineBlock.headline': 100,
  'sectionHeadlineBlock.body': 500,
  'testimonialLargeBlock.quote': 320,
  'featureSplitDarkBlock.heading': 100,
  'featureSplitDarkBlock.subhead': 150,
  'featureSplitDarkBlock.body': 300,
}

function check(type: string, field: string, value: unknown, path: string) {
  if (typeof value !== 'string') return
  const key = `${type}.${field}`
  const max = LIMITS[key]
  if (max === undefined) return
  if (value.length > max) {
    console.log(`${path} — ${key}: ${value.length} chars (max ${max}, over by ${value.length - max})`)
    console.log(`  "${value}"`)
  }
}

async function run() {
  const docs = await client.fetch<{ _id: string; slug: string; blocks: any[] }[]>(
    `*[_type == "page" && slug.current in ["lp/v1", "lp/v2"]]{_id, "slug": slug.current, blocks}`,
  )

  for (const doc of docs) {
    doc.blocks.forEach((block, index) => {
      const path = `${doc.slug} [${index}] ${block._type}`
      for (const [field, value] of Object.entries(block)) {
        if (field.startsWith('_')) continue
        if (Array.isArray(value)) {
          value.forEach((item, i) => {
            if (item && typeof item === 'object') {
              for (const [subField, subValue] of Object.entries(item)) {
                check(block._type, `${field}[].${subField}`, subValue, `${path} item[${i}]`)
              }
            }
          })
        } else {
          check(block._type, field, value, path)
        }
      }
    })
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
