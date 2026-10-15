import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCustomerStory, type CustomerStoryDoc } from '@/lib/sanity/customerStories'
import { productLabels } from '@/lib/customerStoryProducts'
import { SiteFooter, SiteHeader } from '@/components/layout/SiteNavigation'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import { ArticleBody } from '@/components/ui/ArticleBody'
import { AuthorByline } from '@/components/knowledge-bank/AuthorByline'
import { ArticleActions } from '@/components/knowledge-bank/ArticleActions'
import { LikeProvider } from '@/components/knowledge-bank/LikeProvider'

// The customer story template, laid out like a magazine feature:
// - a full-content-width hero: date, headline and standfirst on the
//   left half, a portrait photo on the right half;
// - an "At a glance" fact box, for readers who skim;
// - the story in the 8-column article text column (same body styles as
//   a Knowledge Bank article), opening with a drop cap. The customer's
//   quotes stay in the running text, as in a magazine; the one quote
//   that's set large is the Hero quote, shown wherever the editor drops
//   a "Pull quote" item into the body — breaking out of the column.
// The browser tab title is the story's headline; the search-result
// description is its one-line summary (the summary isn't shown on the
// page itself — it's the card's line).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const story = await getCustomerStory(slug, locale)
  if (!story) return {}
  return {
    title: `${story.title || story.companyName} – Senseworks`,
    ...(story.summary ? { description: story.summary } : {}),
  }
}

export default async function CustomerStoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const story = await getCustomerStory(slug, locale)

  if (!story) notFound()

  const products = productLabels(story.products)
  const headline = story.title || story.companyName
  // The body's opening paragraph, so the fact box can sit right after it.
  const body = story.body ?? []
  const ledeCount = body[0]?._type === 'block' && (body[0].style ?? 'normal') === 'normal' ? 1 : 0
  const lede = body.slice(0, ledeCount)
  const rest = body.slice(ledeCount)

  return (
    <>
      <SiteHeader locale={locale} />
      <LikeProvider articleSlug={`customer-story-${slug}`}>
        <SectionShell pt="section-edge" pb="medium">
          <div className="grid grid-cols-1 items-center gap-2xl md:grid-cols-2">
            {/* Kicker ("Customer story · Audit / Analytics"), headline,
                standfirst (the h1 intro's subtitle style) — SectionIntro, so
                the gaps between them follow the site-wide half-line-height
                rule — then the byline: who interviewed them, and when, with
                like/share, as a magazine feature opens. */}
            <div className="flex flex-col gap-large">
              <SectionIntro
                as="h1"
                eyebrow={['Customer story', products.join(' / ')].filter(Boolean).join(' · ')}
                heading={headline}
                body={story.subtitle}
              />
              {/* Ruled above and below like a Knowledge Bank byline, and
                  capped at the standfirst's own width (md:max-w-subtitle),
                  so the row and its like/share end where the text does. */}
              <div className="flex items-center justify-between gap-medium border-y border-border py-medium md:max-w-subtitle">
                <AuthorByline author={story.author} publishedAt={story.publishedAt} locale={locale} label="Interviewed by" />
                <ArticleActions />
              </div>
            </div>
            {/* Square, cropped to fill; the gradient placeholder until a
                cover image is set. */}
            <Media
              media={story.coverImage ? { mediaType: 'image', image: story.coverImage } : null}
              alt={headline}
              className="aspect-square w-full rounded-lg"
            />
          </div>
        </SectionShell>
        {/* The gap above is the hero's own Medium section spacing. */}
        <SectionShell pt="none" py="section-edge" maxWidth="page" className="article-grid story-body">
          {/* The opening paragraph (with its drop cap) runs straight on
              from the hero; the "At a glance" box follows it, like a
              magazine sidebar, then the rest of the story. */}
          {!!lede.length && (
            <ArticleBody
              value={lede}
              // The opening paragraph carries the drop cap (.story-lede in
              // globals.css) — only when the story opens with one; a Q&A
              // that opens with a question gets none.
              blockStyles={{
                normal: ({ children }) => (
                  <p className="story-lede mb-medium text-article-body text-foreground">{children}</p>
                ),
              }}
            />
          )}
          <AtAGlance story={story} products={products} locale={locale} />
          {!!rest.length && (
            <ArticleBody
              value={rest}
              extraTypes={{ pullQuote: () => <PullQuote story={story} /> }}
              // Subheads are the body text, just bold — same size, and the
              // same face (Inter, set via .story-body in globals.css, not
              // the heading face, which reads smaller at this size), so
              // the story reads as one continuous piece.
              blockStyles={{
                h2: ({ children }) => (
                  <h2 className="mt-large mb-small text-article-body font-bold text-foreground">{children}</h2>
                ),
              }}
            />
          )}
          <div className="mt-large flex items-center justify-between gap-medium border-t border-border pt-medium">
            <AuthorByline author={story.author} publishedAt={story.publishedAt} locale={locale} label="Interviewed by" />
            <ArticleActions />
          </div>
          <div className="mt-large">
            <a href={`/${locale}/customer-stories`} className="text-body-sm font-medium underline underline-offset-4">
              ← All customer stories
            </a>
          </div>
        </SectionShell>
      </LikeProvider>
      <SiteFooter locale={locale} />
    </>
  )
}

// The fact box: who the customer is, in one glance.
// "1-10" → "1–10 employees" / "1–10 anställda" (the Size field stores
// the range; the word follows the page's language).
function sizeLabel(range: string | undefined, locale: string) {
  if (!range) return undefined
  return `${range.replace('-', '–')} ${locale === 'sv' ? 'anställda' : 'employees'}`
}

function AtAGlance({ story, products, locale }: { story: CustomerStoryDoc; products: string[]; locale: string }) {
  // Three fixed columns of two — who (name, company), the firm (size,
  // location), the relationship (customer since, uses). Fixed, so a
  // fact a story doesn't have leaves its slot empty instead of shifting
  // the others. The interviewee needs no label: their name and role
  // speak for themselves (screen readers still hear "Interviewed").
  type Fact = { label: string; value: ReactNode; labelShown: boolean }
  const columns: Fact[][] = [
    [
      {
        label: 'Interviewed',
        value: story.personName && (
          <>
            {story.personName}
            {story.personRole && <span className="block font-normal text-background/70">{story.personRole}</span>}
          </>
        ),
        labelShown: false,
      },
      { label: 'Company', value: story.companyName, labelShown: true },
    ],
    [
      { label: 'Size', value: sizeLabel(story.companySize, locale), labelShown: true },
      { label: 'Location', value: story.location, labelShown: true },
    ],
    [
      { label: 'Customer since', value: story.customerSince, labelShown: true },
      { label: 'Uses', value: products.join(' + '), labelShown: true },
    ],
  ]
  const shown = columns.flat().filter((fact) => fact.value)
  if (shown.length < 2) return null
  return (
    // Dark, like the customer story cards.
    <aside className="my-medium rounded-lg bg-foreground p-medium-large text-background md:p-large" aria-label="At a glance">
      <p className="mb-medium text-caption font-bold tracking-wider text-background/70 uppercase">At a glance</p>
      {/* Mobile: one list in the same order. */}
      <dl className="grid grid-cols-1 gap-x-large gap-y-medium md:grid-cols-3">
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col gap-medium">
            {column
              .filter((fact) => fact.value)
              .map((fact) => (
                <div key={fact.label} className="flex flex-col gap-xs">
                  <dt className={fact.labelShown ? 'text-caption text-background/70' : 'sr-only'}>{fact.label}</dt>
                  <dd className="text-body-sm font-semibold text-background">{fact.value}</dd>
                </div>
              ))}
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
