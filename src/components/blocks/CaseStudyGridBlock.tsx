'use client'
import { CarouselNav, CarouselScroller, useCarousel } from '@/components/ui/Carousel'
import { SECTION_GAP_PB_CLASS } from '@/components/ui/SectionShell'
import { CaseStudyCard, type CaseStudyCardData, type CaseStudyCardTone } from '@/components/customer-stories/CaseStudyCard'

// No eyebrow/heading/body of its own — pair it with a Section Headline
// block above it.
type CaseStudyGridBlockProps = {
  tone?: CaseStudyCardTone
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  items?: CaseStudyCardData[]
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
          <CaseStudyCard
            key={index}
            ref={index === 0 ? firstCardRef : undefined}
            item={item}
            tone={tone}
            className="w-80 shrink-0 snap-start md:w-96"
          />
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
