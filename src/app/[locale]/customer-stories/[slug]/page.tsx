import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { getPage } from '@/lib/sanity/getPage'
import type { PageBlock } from '@/lib/sanity/getPage'
import { getCustomerStory, type CustomerStoryDoc } from '@/lib/sanity/customerStories'
import { splitProducts } from '@/lib/customerStoryProducts'
import { BlockRenderer } from '@/components/blocks/BlockRenderer'
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
  // The body's opening paragraph, so the fact box can sit right after it.
  const body = story.body ?? []
  const ledeCount = body[0]?._type === 'block' && (body[0].style ?? 'normal') === 'normal' ? 1 : 0
  const lede = body.slice(0, ledeCount)
  const rest = body.slice(ledeCount)

  return (
    <>
      {header && <BlockRenderer blocks={[header as PageBlock]} />}
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
          {!!lede.length && <ArticleBody value={lede} />}
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
      {footer && <BlockRenderer blocks={[footer as PageBlock]} />}
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
  // [label, value, label shown?] — the interviewee comes first and needs
  // no label: their name and role speak for themselves (screen readers
  // still hear "Interviewed").
  const facts: [string, ReactNode, boolean][] = [
    [
      'Interviewed',
      story.personName && (
        <>
          {story.personName}
          {story.personRole && <span className="block font-normal text-background/70">{story.personRole}</span>}
        </>
      ),
      false,
    ],
    ['Company', story.companyName, true],
    ['Size', sizeLabel(story.companySize, locale), true],
    ['Location', story.location, true],
    ['Customer since', story.customerSince, true],
    ['Uses', products.join(' + '), true],
  ]
  const shown = facts.filter(([, value]) => value)
  if (shown.length < 2) return null
  return (
    // Dark, like the customer story cards.
    <aside className="my-medium rounded-lg bg-foreground p-medium-large text-background md:p-large" aria-label="At a glance">
      <p className="mb-medium text-caption font-bold tracking-wider text-background/70 uppercase">At a glance</p>
      {/* Desktop: three columns of two, filled down each column — who
          (name, company), the firm (size, location), the relationship
          (customer since, uses). Mobile: one list in the same order. */}
      <dl className="grid grid-cols-1 gap-y-medium md:grid-flow-col md:grid-cols-3 md:grid-rows-2 md:gap-x-large">
        {shown.map(([label, value, labelShown]) => (
          <div key={label} className="flex flex-col gap-xs">
            <dt className={labelShown ? 'text-caption text-background/70' : 'sr-only'}>{label}</dt>
            <dd className="text-body-sm font-semibold text-background">{value}</dd>
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
