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
  subhead?: string
  ctaLabel?: string
  ctaHref?: string
  media?: MediaField
}

// The media's size and strength at the start, as a share of the screen.
const START_SCALE = 0.25
const START_OPACITY = 0.35

const clamp = (v: number) => Math.min(1, Math.max(0, v))

// Experimental: a dark screen with the headline in the accent over the
// image/video, small and faded behind it. The hero pins while you
// scroll (.hero-scroll-zoom, globals.css): the text fades out over the
// first third and the media grows to fill the screen and comes up to
// full strength, filling it exactly as the pin lets go — from there the
// page scrolls on as normal. With reduced motion: one still screen, the
// text over the faded media.
export function HeroScrollZoomBlock({ headline, headlineSize = 'display', subhead, ctaLabel, ctaHref, media }: HeroScrollZoomBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // Functions, not keyframe ranges: Framer hands plain ranges to the
  // browser's own scroll animations, which let the text's fade snap
  // back once the scroll ran past its end.
  const textOpacity = useTransform(scrollYProgress, (p) => 1 - clamp(p / 0.35))
  const mediaScale = useTransform(scrollYProgress, (p) => START_SCALE + (1 - START_SCALE) * clamp(p))
  const mediaOpacity = useTransform(scrollYProgress, (p) => START_OPACITY + (1 - START_OPACITY) * clamp(p / 0.6))

  return (
    // Pulled up under the floating header, like the other full-bleed heroes.
    <div
      ref={ref}
      className={`relative mb-section-edge w-full bg-foreground ${reduced ? '' : 'hero-scroll-zoom'}`}
      style={{ marginTop: 'calc(var(--header-height, 0px) * -1)' }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={reduced ? { scale: START_SCALE * 2, opacity: START_OPACITY } : { scale: mediaScale, opacity: mediaOpacity }}
        >
          <Media media={media} alt="" ariaHidden className="size-full" />
        </motion.div>
        <motion.div
          className="relative mx-auto flex h-full w-full max-w-page flex-col justify-center px-large md:px-gutter"
          style={reduced ? undefined : { opacity: textOpacity }}
        >
          <SectionIntro
            as="h1"
            display={headlineSize === 'display'}
            heading={headline}
            body={subhead}
            align="center"
            headingMaxWidth="none"
            tone="inverse"
            headingColor="text-accent"
            cta={
              ctaLabel &&
              ctaHref && (
                <Button href={ctaHref} variant="filled-accent">
                  {ctaLabel}
                </Button>
              )
            }
          />
        </motion.div>
      </div>
    </div>
  )
}
