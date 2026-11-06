'use client'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type HeroScrollZoomBlockProps = {
  headline: string
  headlineSize?: 'h1' | 'display'
  body?: string
  ctaLabel?: string
  ctaHref?: string
  media?: MediaField
  // Dark (accent headline, white body) or Accent (dark text).
  tone?: 'dark' | 'accent'
}

// The media's size at the start, as a share of its full size.
const START_SCALE = 0.25

const clamp = (v: number) => Math.min(1, Math.max(0, v))

const BRANDMARK_MASK = {
  aspectRatio: '61 / 18',
  maskImage: 'url(/senseworks-brandmark-pos.svg)',
  maskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskImage: 'url(/senseworks-brandmark-pos.svg)',
  WebkitMaskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
}

// Experimental: a dark screen with the headline in the accent (or an
// accent screen with dark text), laid out like milknetwork.com — the
// headline top left, the body and button bottom right, the Senseworks
// mark bottom left — with the image/video small on top of it. The hero pins while you scroll (.hero-scroll-zoom, globals.css):
// the text stays put while the media grows over it to the content
// width (7:4), covering it all exactly as the pin lets go — from there the page scrolls on as normal. With
// reduced motion: one still screen, the media at half size over the text.
export function HeroScrollZoomBlock({
  headline,
  headlineSize = 'display',
  body,
  ctaLabel,
  ctaHref,
  media,
  tone = 'dark',
}: HeroScrollZoomBlockProps) {
  const dark = tone !== 'accent'
  const markColor = dark ? 'bg-background' : 'bg-foreground'
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // Functions, not keyframe ranges: Framer hands plain ranges to the
  // browser's own scroll animations, which let an animation snap back
  // once the scroll ran past its end.
  const mediaScale = useTransform(scrollYProgress, (p) => START_SCALE + (1 - START_SCALE) * clamp(p))

  return (
    // Pulled up under the floating header, like the other full-bleed heroes.
    <div
      ref={ref}
      className={`relative mb-section-edge w-full ${dark ? 'bg-foreground' : 'bg-accent'} ${reduced ? '' : 'hero-scroll-zoom'}`}
      style={{ marginTop: 'calc(var(--header-height, 0px) * -1)' }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* The frame is where the media ends up: the page's content
            width at 7:4, centred between the floating header and the
            screen's bottom edge (below 1280px wide, all of that height
            — 7:4 there is too short to hold the text), and narrower when the
            screen is too short for 7:4 at that width
            (.hero-scroll-zoom-frame, globals.css). The text is laid out
            inside the same frame, so the media covers all of it at
            full size. */}
        <div
          className="absolute inset-0 mx-auto flex w-full max-w-page items-center justify-center px-edge md:px-gutter"
          style={{ paddingBlock: 'var(--header-height, 0px)' }}
        >
          <div className="hero-scroll-zoom-frame relative">
            <div className="absolute inset-0 flex flex-col justify-between gap-large px-medium py-large md:p-large xl:p-xl">
              <SectionIntro
                as="h1"
                display={headlineSize === 'display'}
                heading={headline}
                maxWidth="none"
                headingMaxWidth="none"
                tone={dark ? 'inverse' : 'default'}
                headingColor={dark ? 'text-accent' : undefined}
              />
              <div className="grid grid-cols-1 items-end gap-large md:grid-cols-3 xl:grid-cols-2">
                <div className="flex flex-col items-start gap-medium-large md:col-span-2 md:col-start-2 xl:col-span-1">
                  {body && (
                    <p className={`text-h3 font-bold text-pretty whitespace-pre-line ${dark ? 'text-background' : 'text-foreground'}`}>{body}</p>
                  )}
                  {/* On phones the mark sits beside the button, to save
                      the height (the text has to fit the frame). */}
                  <div className="flex w-full items-center justify-between gap-large md:w-auto">
                    {ctaLabel && ctaHref && (
                      <Button href={ctaHref} variant={dark ? 'filled-accent' : 'filled-dark'}>
                        {ctaLabel}
                      </Button>
                    )}
                    <div aria-hidden="true" className={`ml-auto h-large md:hidden ${markColor}`} style={BRANDMARK_MASK} />
                  </div>
                </div>
                {/* The Senseworks mark, as a mask so it takes the text colour. */}
                <div aria-hidden="true" className={`hidden h-xl md:row-start-1 md:block ${markColor}`} style={BRANDMARK_MASK} />
              </div>
            </div>
            <motion.div
              className="absolute inset-0 overflow-hidden rounded-lg"
              style={{ scale: reduced ? START_SCALE * 2 : mediaScale }}
            >
              <Media media={media} alt="" ariaHidden className="size-full" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
