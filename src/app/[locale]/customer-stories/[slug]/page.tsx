import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { getPage } from '@/lib/sanity/getPage'
import type { PageBlock } from '@/lib/sanity/getPage'
import { getCustomerStory, type CustomerStoryDoc } from '@/lib/sanity/customerStories'
import { splitProducts } from '@/lib/customerStoryProducts'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Tag } from '@/components/ui/Tag'
import { Media } from '@/components/ui/Media'
import { ArticleBody } from '@/components/ui/ArticleBody'

// The customer story template, laid out like a magazine feature:
// - a full-content-width hero: date, headline and standfirst on the
//   left half, a portrait photo on the right half;
// - an "At a glance" fact box, for readers who skim;
// - the story in the 8-column article text column (same body styles as
//   a Knowledge Bank article), opening with a drop cap. The customer's
//   quotes stay in the running text, as in a magazine; the one quote
//   that's set large is the Hero quote, shown wherever the editor drops
//   a "Pull quote" item into the body — breaking out of the column.
export default async function CustomerStoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const [home, story] = await Promise.all([getPage('home', locale), getCustomerStory(slug, locale)])

  if (!home || !story) notFound()

  const header = home.blocks.find((block) => block._type === 'headerBlock')
  const footer = home.blocks.find((block) => block._type === 'footerBlock')
  const products = splitProducts(story.products)
  const headline = story.title || story.companyName

  return (
    <>
      {header && <BlockRenderer blocks={[header as PageBlock]} />}
      <SectionShell pt="section-edge" pb="none">
        <div className="grid grid-cols-1 items-center gap-2xl md:grid-cols-2">
          {/* Date as the eyebrow, headline, standfirst (the h1 intro's
              subtitle style) — SectionIntro, so the gaps between them
              follow the site-wide half-line-height rule. */}
          <div className="flex flex-col gap-large">
            <SectionIntro
              as="h1"
              eyebrow={new Date(story.publishedAt).toLocaleDateString(locale === 'sv' ? 'sv-SE' : 'en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              heading={headline}
              body={story.subtitle}
            />
            {!!products.length && (
              <div className="flex flex-wrap gap-xs">
                {products.map((product) => (
                  <Tag key={product}>{product}</Tag>
                ))}
              </div>
            )}
          </div>
          {/* Portrait (4:5) — suits a photo of the person interviewed;
              the gradient placeholder until a cover image is set. */}
          <Media
            media={story.coverImage ? { mediaType: 'image', image: story.coverImage } : null}
            alt={headline}
            className="aspect-4/5 w-full rounded-lg"
          />
        </div>
      </SectionShell>
      {/* 64px below the hero — the site-wide intro-to-content gap. */}
      <SectionShell pt="none" py="section-edge" maxWidth="page" className="article-grid story-drop-cap mt-2xl">
        <AtAGlance story={story} products={products} />
        {!!story.body?.length && (
          <ArticleBody
            value={story.body}
            extraTypes={{ pullQuote: () => <PullQuote story={story} /> }}
          />
        )}
        <div className="mt-large border-t border-border pt-medium">
          <a href={`/${locale}/customer-stories`} className="text-body-sm font-medium underline underline-offset-4">
            ← All customer stories
          </a>
        </div>
      </SectionShell>
      {footer && <BlockRenderer blocks={[footer as PageBlock]} />}
    </>
  )
}

// The fact box: who the customer is, in one glance.
function AtAGlance({ story, products }: { story: CustomerStoryDoc; products: string[] }) {
  const facts: [string, ReactNode][] = [
    ['Company', story.companyName],
    ['Location', story.location],
    ['Size', story.companySize],
    ['Customer since', story.customerSince],
    ['Uses', products.join(' + ')],
    [
      'Interviewed',
      story.personName && (
        <>
          {story.personName}
          {story.personRole && <span className="block font-normal text-muted-foreground">{story.personRole}</span>}
        </>
      ),
    ],
  ]
  const shown = facts.filter(([, value]) => value)
  if (shown.length < 2) return null
  return (
    <aside className="mb-xl rounded-lg border border-border bg-background p-medium-large md:p-large" aria-label="At a glance">
      <p className="mb-medium text-caption font-bold tracking-wider text-muted-foreground uppercase">At a glance</p>
      <dl className="grid grid-cols-2 gap-x-large gap-y-medium md:grid-cols-3">
        {shown.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-xs">
            <dt className="text-caption text-muted-foreground">{label}</dt>
            <dd className="text-body-sm font-semibold text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

// The one quote set large: breaks out of the text column to the full
// content width, between thin rules, attributed underneath.
function PullQuote({ story }: { story: CustomerStoryDoc }) {
  if (!story.quote) return null
  return (
    <figure className="article-grid-wide my-2xl border-y border-foreground py-2xl text-center">
      <blockquote className="mx-auto w-full max-w-prose-xl font-heading text-h2 font-bold text-balance text-foreground">
        &ldquo;{story.quote}&rdquo;
      </blockquote>
      {(story.personName || story.personRole) && (
        <figcaption className="mt-large text-caption font-bold tracking-wider text-muted-foreground uppercase">
          {[story.personName, story.personRole].filter(Boolean).join(', ')}
        </figcaption>
      )}
    </figure>
  )
}
