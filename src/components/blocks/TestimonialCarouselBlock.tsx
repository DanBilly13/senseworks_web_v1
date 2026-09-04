'use client'
import { useEffect, useRef, useState } from 'react'
import { LeftOutlined, RightOutlined, UserOutlined } from '@ant-design/icons'
import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
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
  items?: TestimonialItem[]
}

export function TestimonialCarouselBlock({
  eyebrow,
  heading,
  body,
  ctaLabel,
  ctaHref,
  items = [],
}: TestimonialCarouselBlockProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const firstCardRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = () => {
    const el = scrollerRef.current
    if (!el) return
    // A small tolerance, not an exact 0/max comparison: scroll-snap
    // combined with the scroller's own leading inset can settle a
    // couple of pixels off scrollLeft 0 depending on the browser.
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }

  useEffect(() => {
    updateEdges()
  }, [items.length])

  const scrollByCard = (direction: 1 | -1) => {
    const el = scrollerRef.current
    const card = firstCardRef.current
    if (!el || !card || !el.scrollBy) return
    const gap = parseFloat(getComputedStyle(el).columnGap || '0')
    el.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' })
  }

  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  return (
    <section className="py-3xl">
      <div className="mx-auto flex w-full max-w-page flex-col px-medium-large">
        <div className="flex flex-wrap items-end justify-between gap-medium-large">
          <SectionIntro
            as="h2"
            eyebrow={eyebrow}
            heading={heading}
            body={body}
            maxWidth="sm"
            cta={
              ctaLabel &&
              ctaHref && (
                <Button href={ctaHref} variant="secondary">
                  {ctaLabel}
                </Button>
              )
            }
          />
          <div className="flex gap-small">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={atStart}
              aria-label="Previous testimonials"
              className="flex size-xl items-center justify-center rounded-full bg-foreground text-background disabled:opacity-30"
            >
              <LeftOutlined />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={atEnd}
              aria-label="Next testimonials"
              className="flex size-xl items-center justify-center rounded-full bg-foreground text-background disabled:opacity-30"
            >
              <RightOutlined />
            </button>
          </div>
        </div>
      </div>
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        className="carousel-inset scrollbar-hide mt-2xl flex snap-x snap-mandatory gap-large overflow-x-auto scroll-smooth py-small"
      >
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
            <p className="text-body-lg text-foreground">&ldquo;{item.quote}&rdquo;</p>
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
      </div>
    </section>
  )
}
