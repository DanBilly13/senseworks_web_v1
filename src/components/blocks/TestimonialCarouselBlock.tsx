'use client'
import { UserOutlined } from '@ant-design/icons'
import { Button } from '@/components/ui/Button'
import { CarouselNav, CarouselScroller, useCarousel } from '@/components/ui/Carousel'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { SECTION_GAP_PB_CLASS } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type TestimonialItem = {
  quote: string
  authorName: string
  authorRole?: string
  media?: MediaField
}
type TestimonialCarouselBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  items?: TestimonialItem[]
}

export function TestimonialCarouselBlock({
  eyebrow,
  heading,
  body,
  ctaLabel,
  ctaHref,
  spacing = 'loose',
  items = [],
}: TestimonialCarouselBlockProps) {
  const { scrollerRef, firstCardRef, atStart, atEnd, updateEdges, scrollByCard } = useCarousel(items.length)

  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <section className={SECTION_GAP_PB_CLASS[spacing]}>
      {/* This header text isn't itself boxed — the cards below are —
          so it gets the plain 32px-from-edge mobile treatment (same as
          SectionShell's default px), not the 8px boxed one. Text here
          and text inside the boxed cards below (8px section + 24px
          card padding) end up on the same 32px line either way. */}
      <div className="mx-auto flex w-full max-w-page flex-col px-large md:px-medium-large">
        <div className="flex flex-wrap items-end justify-between gap-medium-large">
          {/* min-w-0 + flex-1 so headingMaxWidth="wide" (80%) resolves
              against the space actually left over after the nav
              buttons, not the whole row — otherwise a long heading
              claims the full row width and pushes the buttons onto
              their own (left-aligned) line instead of staying pinned
              right next to it. */}
          <div className="min-w-0 flex-1">
            <SectionIntro
              as="h2"
              eyebrow={eyebrow}
              heading={heading}
              body={body}
              maxWidth="sm"
              headingMaxWidth="wide"
              cta={
                ctaLabel &&
                ctaHref && (
                  <Button href={ctaHref} variant="ghost">
                    {ctaLabel}
                  </Button>
                )
              }
            />
          </div>
          <CarouselNav
            label="testimonials"
            atStart={atStart}
            atEnd={atEnd}
            onStep={scrollByCard}
          />
        </div>
      </div>
      <CarouselScroller scrollerRef={scrollerRef} onScroll={updateEdges} className="mt-2xl">
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
    </section>
  )
}
