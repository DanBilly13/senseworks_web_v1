'use client'
import { CarouselNav, CarouselScroller, useCarousel } from '@/components/ui/Carousel'
import { SECTION_GAP_PB_CLASS } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type CaseStudyItem = {
  companyName: string
  // Short facts line under the name (size, offices, what they switched
  // from) and which Senseworks products they use.
  facts?: string
  products?: string
  quote?: string
  personName?: string
  personRole?: string
  ctaLabel?: string
  ctaHref?: string
  media?: MediaField
}
type CardTone = 'default' | 'dark' | 'accent'
// No eyebrow/heading/body of its own — pair it with a Section Headline
// block above it.
type CaseStudyGridBlockProps = {
  tone?: CardTone
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  items?: CaseStudyItem[]
}

// Same three looks as Card Grid. dark: black card, light text. accent:
// accent-colored card, plain dark text (accent-foreground resolves to
// the foreground color).
const TONE_CARD_CLASS: Record<CardTone, string> = {
  default: 'border border-border bg-background text-foreground',
  dark: 'bg-foreground text-background',
  accent: 'bg-accent text-foreground',
}
const TONE_MUTED_CLASS: Record<CardTone, string> = {
  default: 'text-muted-foreground',
  dark: 'text-background/70',
  accent: 'text-foreground/70',
}

// A carousel, same mechanics as Testimonial Carousel (see ui/Carousel):
// a full-bleed snap-scrolling row of cards, its first card lined up
// with the page content, stepped with prev/next buttons underneath.
export function CaseStudyGridBlock({
  tone = 'default',
  spacing = 'loose',
  items = [],
}: CaseStudyGridBlockProps) {
  const { scrollerRef, firstCardRef, atStart, atEnd, canScroll, updateEdges, scrollByCard } = useCarousel(items.length)

  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <section className={SECTION_GAP_PB_CLASS[spacing]}>
      <CarouselScroller scrollerRef={scrollerRef} onScroll={updateEdges}>
        {items.map((item, index) => (
          <div
            key={index}
            ref={index === 0 ? firstCardRef : undefined}
            className={`flex w-80 shrink-0 snap-start flex-col gap-medium-large rounded-lg p-medium-large md:w-96 md:p-large ${TONE_CARD_CLASS[tone]}`}
          >
            {item.media?.mediaType ? (
              <Media
                media={item.media}
                alt={`${item.companyName} logo`}
                className="h-xl w-3xl rounded-md"
                fit="contain"
              />
            ) : (
              <h3 className="text-h4 font-bold">{item.companyName}</h3>
            )}
            {(item.facts || item.products) && (
              <div className="flex flex-col gap-small">
                {item.facts && <p className={`text-body-sm ${TONE_MUTED_CLASS[tone]}`}>{item.facts}</p>}
                {item.products && (
                  <p className="text-body-sm font-semibold">{item.products}</p>
                )}
              </div>
            )}
            <div className="flex flex-col gap-small-medium">
              {item.quote && <p className="text-body">&ldquo;{item.quote}&rdquo;</p>}
              {(item.personName || item.personRole) && (
                <div className="flex flex-col">
                  {item.personName && (
                    <span className="text-body-sm font-semibold">
                      {item.personName}
                    </span>
                  )}
                  {item.personRole && (
                    <span className={`text-caption ${TONE_MUTED_CLASS[tone]}`}>{item.personRole}</span>
                  )}
                </div>
              )}
            </div>
            {item.ctaLabel && item.ctaHref && (
              <a
                href={item.ctaHref}
                // On a dark card the link takes the page's accent color
                // (yellow, Audit purple, Analytics green).
                className={`mt-auto text-body-sm font-medium underline underline-offset-4 ${tone === 'dark' ? 'text-accent' : ''}`}
              >
                {item.ctaLabel} →
              </a>
            )}
          </div>
        ))}
      </CarouselScroller>
      {/* Prev/next under the cards, right-aligned to the page content
          edge — only when there's something to scroll (on a wide screen
          all the cards can fit, and two greyed-out buttons look broken). */}
      {canScroll && (
        <div className="mx-auto mt-medium-large flex w-full max-w-page justify-end px-large md:px-medium-large">
          <CarouselNav label="case studies" atStart={atStart} atEnd={atEnd} onStep={scrollByCard} />
        </div>
      )}
    </section>
  )
}
