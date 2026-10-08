'use client'
import { useEffect, useRef, useState } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Media } from '@/components/ui/Media'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { ItemHeading } from '@/components/ui/ItemHeading'
import { SECTION_GAP_PB_CLASS } from '@/components/ui/SectionShell'
import type { MediaField } from '@/lib/sanity/media'

type Slide = {
  media?: MediaField
  title: string
  body?: string
  note?: string
}
type MediaCarouselBlockProps = {
  eyebrow?: string
  heading?: string
  body?: string
  tone?: 'default' | 'dark'
  // Same two type options as Bento Grid's cards. Inline (the default
  // here) runs the title and text on as one line, title bold.
  headingLayout?: 'stacked' | 'inline'
  titleSize?: 'h3' | 'h4' | 'h5'
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  slides?: Slide[]
}

// A dark band keeps its bottom gap as margin, outside the band, instead
// of padding inside it.
const SECTION_GAP_MB_CLASS: Record<NonNullable<MediaCarouselBlockProps['spacing']>, string> = {
  loose: 'mb-section-gap-loose',
  medium: 'mb-section-gap-medium',
  tight: 'mb-section-gap-tight',
  none: 'mb-none',
}

// A row of slides that scrolls sideways and runs off the right edge of
// the screen. Each slide's image is the same size as the one in a
// Feature Split block (see .media-carousel-slide in globals.css), with
// its caption underneath. The optional heading and text sit above the
// row, left-aligned, outside the scroller — they stay put while the
// slides move.
export function MediaCarouselBlock({
  eyebrow,
  heading,
  body,
  tone = 'default',
  headingLayout = 'inline',
  titleSize = 'h5',
  spacing = 'loose',
  slides = [],
}: MediaCarouselBlockProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const firstSlideRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateEdges = () => {
    const el = scrollerRef.current
    if (!el) return
    // A small tolerance, not an exact comparison: scroll-snap can settle
    // a couple of pixels off the true edge.
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }

  useEffect(() => {
    updateEdges()
  }, [slides.length])

  const scrollBySlide = (direction: 1 | -1) => {
    const el = scrollerRef.current
    const slide = firstSlideRef.current
    if (!el || !slide || !el.scrollBy) return
    const gap = parseFloat(getComputedStyle(el).columnGap || '0')
    el.scrollBy({ left: direction * (slide.offsetWidth + gap), behavior: 'smooth' })
  }

  // D7: a block with no content simply doesn't render.
  if (!slides.length) return null

  const dark = tone === 'dark'
  const buttonClass = dark
    ? 'flex size-xl items-center justify-center rounded-full bg-background text-foreground disabled:opacity-30'
    : 'flex size-xl items-center justify-center rounded-full bg-foreground text-background disabled:opacity-30'

  return (
    <section
      className={
        dark
          ? `bg-foreground py-section-edge text-background ${SECTION_GAP_MB_CLASS[spacing]}`
          : SECTION_GAP_PB_CLASS[spacing]
      }
    >
      {(eyebrow || heading) && (
        <div className="mx-auto mb-2xl w-full max-w-page px-large md:px-medium-large">
          <SectionIntro
            as="h2"
            eyebrow={eyebrow}
            heading={heading}
            body={body}
            maxWidth="md"
            tone={dark ? 'inverse' : 'default'}
          />
        </div>
      )}
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        className="media-carousel-inset scrollbar-hide flex snap-x snap-mandatory items-start gap-medium overflow-x-auto scroll-smooth md:gap-large"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            ref={index === 0 ? firstSlideRef : undefined}
            className="media-carousel-slide flex shrink-0 snap-start flex-col gap-medium"
          >
            <Media
              media={slide.media}
              alt={slide.title}
              className={`aspect-media w-full rounded-lg border ${dark ? 'border-background/20' : 'border-border'}`}
            />
            <div className="flex w-full flex-col gap-small-medium md:w-4/5">
              <ItemHeading
                as={titleSize}
                title={slide.title}
                description={slide.body}
                layout={headingLayout}
                tone={dark ? 'inverse' : 'default'}
                gap="medium"
              />
              {slide.note && (
                <p className={`text-caption ${dark ? 'text-background/60' : 'text-muted-foreground'}`}>
                  {slide.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-2xl flex w-full max-w-page justify-end gap-small px-large md:px-medium-large">
        <button
          type="button"
          onClick={() => scrollBySlide(-1)}
          disabled={atStart}
          aria-label="Previous slide"
          className={buttonClass}
        >
          <LeftOutlined />
        </button>
        <button
          type="button"
          onClick={() => scrollBySlide(1)}
          disabled={atEnd}
          aria-label="Next slide"
          className={buttonClass}
        >
          <RightOutlined />
        </button>
      </div>
    </section>
  )
}
