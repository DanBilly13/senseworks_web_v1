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
  tone?: 'default' | 'dark' | 'accentDark'
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
    // The slide width (desktop), set as --slide-w on the stage
    // (globals.css, .scroll-stack-medium-slide). In order of priority:
    // 1. a Feature Split image's width (the row less the 460px text
    //    column and the 64px gap), when it fits the screen with our Loose
    //    spacing above and below (200px on a tall screen, easing to 48px
    //    at 900px) plus the header;
    // 2. otherwise narrower, keeping that spacing — down to half the
    //    Feature Split width, so it always reads as a scroll stack, never
    //    a row of small cards that all fit on screen;
    // 3. and below that, the spacing gives instead (the stage centres it).
    // Each caption is measured at the width it would have (a hidden copy),
    // so a narrower slide's taller caption is counted, with no feedback
    // loop. Only on load and when the screen changes.
    const sizeSlides = () => {
      const stage = stageRef.current
      const track = trackRef.current
      if (!stage || !track || !window.matchMedia?.('(min-width: 768px)').matches) return
      const root = getComputedStyle(document.documentElement)
      const px = (name: string) => parseFloat(root.getPropertyValue(name)) || 0
      const rem = parseFloat(root.fontSize) || 16
      const page = px('--container-page') * rem
      const featureSplit = Math.min(window.innerWidth, page) - 2 * px('--page-gutter') - 64 - 28.75 * rem
      const header = px('--header-height')
      const vh = window.innerHeight
      const space = Math.min(px('--spacing-section-gap-loose') || 200, Math.max(48, (vh - 900) * 0.6))
      const gap = parseFloat(getComputedStyle(stage).rowGap) || 0
      const title = stage.firstElementChild !== track ? (stage.firstElementChild as HTMLElement).offsetHeight + gap : 0
      const captions = Array.from(track.children, (slide) => slide.lastElementChild as HTMLElement | null).filter(
        (el): el is HTMLElement => !!el,
      )
      const slideGap = track.firstElementChild ? parseFloat(getComputedStyle(track.firstElementChild).rowGap) || 0 : 0
      const captionAt = (width: number) =>
        Math.max(
          0,
          ...captions.map((caption) => {
            const copy = caption.cloneNode(true) as HTMLElement
            copy.style.cssText = `position:absolute;visibility:hidden;left:-9999px;top:0;width:${width * 0.95}px`
            stage.appendChild(copy)
            const height = copy.offsetHeight
            copy.remove()
            return height + slideGap
          }),
        )
      const fits = (width: number) => width / 1.4 + title + captionAt(width) + 2 * space + header <= vh
      const max = Math.max(352, featureSplit)
      const min = Math.max(352, featureSplit / 2)
      let width = max
      if (!fits(max)) {
        let lo = min
        let hi = max
        for (let i = 0; i < 14; i++) {
          const mid = (lo + hi) / 2
          if (fits(mid)) lo = mid
          else hi = mid
        }
        width = lo
      }
      stage.style.setProperty('--slide-w', `${Math.floor(width)}px`)
      measure()
    }
    // Again on the next frame: the header's height (--header-height) and
    // the fonts may only settle just after the first paint.
    let frame = 0
    const measureTwice = () => {
      sizeSlides()
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(sizeSlides)
    }
    measureTwice()
    const observer = new ResizeObserver(measure)
    if (stageRef.current) observer.observe(stageRef.current)
    if (trackRef.current) observer.observe(trackRef.current)
    window.addEventListener('resize', measureTwice)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', measureTwice)
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

  // The dark accent gradient takes the same white text as Dark. On desktop
  // the gradient sits on the pinned stage, so its corner glow stays put
  // while the slides scroll past; the tall wrapper behind is plain black.
  const dark = tone === 'dark' || tone === 'accentDark'
  const gradient = tone === 'accentDark'

  const title = (eyebrow || heading) && (
    <div className="mx-auto w-full max-w-page px-large md:px-gutter">
      <SectionIntro
        as={headingLevel}
        eyebrow={eyebrow}
        heading={heading}
        body={body}
        align="left"
        maxWidth="md"
        // Desktop: the headline 80% of the row, the body 60%.
        headingMaxWidth="fourFifths"
        bodyMaxWidth="threeFifths"
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
      {/* 95% of the slide width on desktop (was 80%), full width on mobile. */}
      <div className="flex w-full flex-col gap-small-medium md:w-19/20">
        <ItemHeading
          as={titleSize}
          title={slide.title}
          description={slide.body}
          layout={headingLayout}
          tone={dark ? 'inverse' : 'default'}
          gap="medium"
          // Unbalanced, so the text actually runs to the 95% width
          // instead of wrapping early to even out its lines.
          balance={false}
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
        className={`flex flex-col gap-2xl py-section-edge md:hidden ${gradient ? 'bg-accent-gradient-dark text-background' : dark ? 'bg-foreground text-background' : ''}`}
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
        <div
          ref={stageRef}
          className={`sticky top-0 flex h-screen flex-col justify-center gap-2xl overflow-hidden ${gradient ? 'bg-accent-gradient-dark' : ''}`}
        >
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
