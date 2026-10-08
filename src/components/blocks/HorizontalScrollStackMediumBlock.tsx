'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Media } from '@/components/ui/Media'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { ItemHeading } from '@/components/ui/ItemHeading'
import type { MediaField } from '@/lib/sanity/media'

type Slide = {
  media?: MediaField
  title: string
  body?: string
  note?: string
}
type SpacingValue = 'loose' | 'medium' | 'tight' | 'none'
type HorizontalScrollStackMediumBlockProps = {
  eyebrow?: string
  heading?: string
  headingLevel?: 'h2' | 'h3'
  body?: string
  tone?: 'default' | 'dark'
  headingLayout?: 'stacked' | 'inline'
  titleSize?: 'h3' | 'h4' | 'h5'
  spacing?: SpacingValue
  slides?: Slide[]
}

// Same four tiers as the shared "Section spacing" field, as a margin
// below the block (same reasoning as Horizontal Scroll Stack's own).
const SECTION_GAP_MB_CLASS: Record<SpacingValue, string> = {
  loose: 'mb-section-gap-loose',
  medium: 'mb-section-gap-medium',
  tight: 'mb-section-gap-tight',
  none: 'mb-none',
}

// The Horizontal Scroll Stack's pinned, scroll-driven motion with the
// Media Carousel's slides (an image the size of a Feature Split image,
// caption underneath), under a left-aligned title that stays put.
//
// Desktop: the section pins in place and the page's own vertical scroll
// slides the row sideways, one pixel of scroll per pixel of travel, so
// it ends with the last slide the same distance from the right edge
// that the first started from the left. No snapping — the row follows
// the scroll continuously. Mobile: a plain vertical stack, like the
// Horizontal Scroll Stack.
export function HorizontalScrollStackMediumBlock({
  eyebrow,
  heading,
  headingLevel = 'h2',
  body,
  tone = 'default',
  headingLayout = 'inline',
  titleSize = 'h5',
  spacing = 'loose',
  slides = [],
}: HorizontalScrollStackMediumBlockProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // How far the row has to move to bring the last slide to rest: its
  // full width minus the screen's. Measured, not computed, so it holds
  // for any screen width, slide count or caption length.
  const [travel, setTravel] = useState(0)

  useEffect(() => {
    const measure = () => {
      const stage = stageRef.current
      const track = trackRef.current
      if (!stage || !track) return
      setTravel(Math.max(0, track.scrollWidth - stage.clientWidth))
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (stageRef.current) observer.observe(stageRef.current)
    if (trackRef.current) observer.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [slides.length])

  // With no slides the wrapper below never renders, and a target ref
  // that's never attached makes useScroll throw.
  const { scrollYProgress } = useScroll({
    target: slides.length ? wrapperRef : undefined,
    offset: ['start start', 'end end'],
  })
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel])

  // D7: a block with no content simply doesn't render. After the hooks
  // above, never before — hooks can't be called conditionally.
  if (!slides.length) return null

  const dark = tone === 'dark'

  const title = (eyebrow || heading) && (
    <div className="mx-auto w-full max-w-page px-large md:px-medium-large">
      <SectionIntro
        as={headingLevel}
        eyebrow={eyebrow}
        heading={heading}
        body={body}
        align="left"
        maxWidth="md"
        tone={dark ? 'inverse' : 'default'}
      />
    </div>
  )

  const renderSlide = (slide: Slide) => (
    <>
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
    </>
  )

  return (
    <div className={SECTION_GAP_MB_CLASS[spacing]}>
      {/* Mobile: title, then the slides one under the other. */}
      <div
        className={`flex flex-col gap-2xl py-section-edge md:hidden ${dark ? 'bg-foreground text-background' : ''}`}
      >
        {title}
        <div className="mx-auto flex w-full max-w-page flex-col gap-2xl px-large">
          {slides.map((slide, i) => (
            <div key={i} className="flex flex-col gap-medium">
              {renderSlide(slide)}
            </div>
          ))}
        </div>
      </div>
      {/* Desktop: tall wrapper (one screen plus the row's travel), with
          a screen-high stage pinned inside it. */}
      <div
        ref={wrapperRef}
        className={`relative hidden md:block ${dark ? 'bg-foreground text-background' : ''}`}
        style={{ height: `calc(100vh + ${travel}px)` }}
      >
        <div ref={stageRef} className="sticky top-0 flex h-screen flex-col justify-center gap-2xl overflow-hidden">
          {title}
          <motion.div
            ref={trackRef}
            className="media-carousel-inset flex w-max items-start gap-large"
            style={{ x }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="scroll-stack-medium-slide flex shrink-0 flex-col gap-medium">
                {renderSlide(slide)}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
