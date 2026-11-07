'use client'
import { usePathname } from 'next/navigation'
import { CarouselNav, CarouselScroller, useCarousel } from '@/components/ui/Carousel'
import { SECTION_GAP_PB_CLASS } from '@/components/ui/SectionShell'
import { StoryCard, type StoryCardData, type StoryCardTone } from '@/components/customer-stories/StoryCard'
import type { EditorialLinkStyle, EditorialMark } from '@/components/ui/EditorialCard'

// No eyebrow/heading/body of its own — pair it with a Section Headline
// block above it.
type CaseStudyGridBlockProps = {
  // Card style: Light or Dark story cards.
  tone?: 'light' | 'dark' | 'none'
  // Editorial cards (ui/EditorialCard): boxed light/dark, or no fill.
  cardDesign?: 'standard' | 'editorial'
  cardMark?: EditorialMark
  linkStyle?: EditorialLinkStyle
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  // Resolved in the page query from the Customer story documents,
  // filtered by the block's "Which stories" setting (all, audit or
  // analytics — a story ticked for both shows under either), newest
  // first, in the page's language with English as the fallback.
  stories?: StoryCardData[]
}

// A carousel of customer story cards, same mechanics as Testimonial
// Carousel (see ui/Carousel): a full-bleed snap-scrolling row, its
// first card lined up with the page content, stepped with prev/next
// buttons underneath. On mobile the card box (not its text) sits on the
// 32px heading line, at both ends of the row (.carousel-inset-on-line).
export function CaseStudyGridBlock({ tone = 'light', spacing = 'loose', stories = [], cardDesign = 'standard', cardMark, linkStyle }: CaseStudyGridBlockProps) {
  const { scrollerRef, firstCardRef, atStart, atEnd, canScroll, updateEdges, scrollByCard } = useCarousel<HTMLAnchorElement>(stories.length)
  // Every route lives under a locale segment, so the first path segment
  // is "en"/"sv" — the story links stay in the page's language.
  const locale = usePathname().split('/')[1] || 'en'

  // D7: a block with no content simply doesn't render.
  if (!stories.length) return null

  return (
    <section className={SECTION_GAP_PB_CLASS[spacing]}>
      <CarouselScroller scrollerRef={scrollerRef} onScroll={updateEdges} className="carousel-inset-on-line">
        {stories.map((story, index) => (
          <StoryCard
            key={story.slug}
            ref={index === 0 ? firstCardRef : undefined}
            story={story}
            locale={locale}
            tone={(tone === 'dark' ? 'dark' : 'default') satisfies StoryCardTone}
            editorial={
              cardDesign === 'editorial'
                ? { surface: tone === 'dark' ? 'dark' : tone === 'none' ? 'none' : 'white', mark: cardMark, linkStyle }
                : undefined
            }
            className="w-80 shrink-0 snap-start md:w-96"
          />
        ))}
      </CarouselScroller>
      {/* Prev/next under the cards, right-aligned to the page content
          edge — only when there's something to scroll. */}
      {canScroll && (
        <div className="mx-auto mt-medium-large flex w-full max-w-page justify-end px-edge md:px-gutter">
          <CarouselNav label="case studies" atStart={atStart} atEnd={atEnd} onStep={scrollByCard} />
        </div>
      )}
    </section>
  )
}
