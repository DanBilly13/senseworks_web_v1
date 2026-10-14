'use client'
import { UserOutlined } from '@ant-design/icons'
import { CarouselNav, CarouselScroller, useCarousel } from '@/components/ui/Carousel'
import { SECTION_GAP_PB_CLASS } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type TestimonialItem = {
  quote: string
  authorName: string
  authorRole?: string
  media?: MediaField
}
// No eyebrow/heading/body of its own — pair it with a Section Headline
// block above it.
type TestimonialCarouselBlockProps = {
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  items?: TestimonialItem[]
}

export function TestimonialCarouselBlock({
  spacing = 'loose',
  items = [],
}: TestimonialCarouselBlockProps) {
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
            className="flex w-80 shrink-0 snap-start flex-col gap-small-medium rounded-lg border border-border bg-background p-medium-large"
          >
            <Media
              media={item.media}
              alt={item.authorName}
              className="size-2xl rounded-full text-muted-foreground"
              fallback={<UserOutlined />}
            />
            <p className="text-body-lg font-medium text-foreground md:font-normal">
              &ldquo;{item.quote}&rdquo;
            </p>
            <div className="flex flex-col">
              <span className="text-body-sm font-semibold text-foreground">
                {item.authorName}
              </span>
              {item.authorRole && (
                <span className="text-caption text-muted-foreground">{item.authorRole}</span>
              )}
            </div>
          </div>
        ))}
      </CarouselScroller>
      {/* Prev/next under the cards, right-aligned to the content edge —
          only when there's something to scroll. Same as Case Study
          Carousel. */}
      {canScroll && (
        <div className="mx-auto mt-medium-large flex w-full max-w-page justify-end px-large md:px-medium-large">
          <CarouselNav label="testimonials" atStart={atStart} atEnd={atEnd} onStep={scrollByCard} />
        </div>
      )}
    </section>
  )
}
