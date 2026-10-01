'use client'
import { useEffect, useRef, type CSSProperties } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { renderNumberedEyebrow } from '@/components/ui/numberedEyebrow'
import { Media } from '@/components/ui/Media'
import { urlFor } from '@/lib/sanity/image'
import type { MediaField } from '@/lib/sanity/media'

function isRealImage(
  media?: MediaField
): media is NonNullable<MediaField> & { mediaType: 'image'; image: NonNullable<NonNullable<MediaField>['image']> } {
  return !!media && media.mediaType === 'image' && !!media.image
}

// Bypasses Media for a real image — same reasoning as Full Width
// Single's own CropFadeImage: Media has no hook for a fixed
// object-position at full (100%) scale or a mask, both of which this
// needs (object-top, so a tall app screenshot crops from the bottom
// rather than the vertical center; the same bottom fade Full Width
// Single uses, desktop only — --media-fade-bottom is 'none' below
// md:). Falls back to Media for anything else (video/lottie/an image
// type with no asset uploaded yet).
function PanelImage({
  media,
  alt,
  className,
  imageStyle,
}: {
  media?: MediaField
  alt: string
  className: string
  // TEMP, testing only (Dan: "let's just test locally a minute") — a
  // mobile-only scale/anchor experiment, not yet a named token or a
  // real decision. Plain inline style rather than a Tailwind class
  // since scale/transform-origin aren't part of any --theme namespace
  // Tailwind maps to a utility, and arbitrary-value classes are banned
  // project-wide regardless.
  imageStyle?: CSSProperties
}) {
  if (isRealImage(media)) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={urlFor(media.image).url()}
          alt={media.alt || alt}
          fill
          // Was "50vw" (copied from Full Width Single's two-image SPLIT
          // case) — wrong here, this is always one full-width image per
          // slide, not half. That alone was already fetching a lower-res
          // image than the display actually needed; on top of that, a
          // CSS transform (the mobile scale experiment above) stretches
          // the already-downloaded bitmap with no way for `sizes` to
          // know that's coming — so mobile asks for extra headroom
          // (roughly the slide's ~100vw times the 2.25 scale factor) to
          // still look sharp after being blown up. Desktop isn't scaled.
          sizes="(max-width: 767px) 225vw, 100vw"
          className="object-cover object-top"
          style={{
            maskImage: 'var(--media-fade-bottom)',
            WebkitMaskImage: 'var(--media-fade-bottom)',
            ...imageStyle,
          }}
        />
      </div>
    )
  }
  return <Media media={media} alt={alt} className={className} />
}

export type ScrollStackPanelData = {
  eyebrow?: string
  heading?: string
  body?: string
  media?: MediaField
}

type SpacingValue = 'loose' | 'medium' | 'tight' | 'none'

type HorizontalScrollStackBlockProps = {
  panels: ScrollStackPanelData[]
  spacing?: SpacingValue
}

// Same four tiers/values as the shared "Section spacing" field, applied
// as a margin-bottom on this block's own outer wrapper — same reasoning
// as Full Width Single's own SECTION_GAP_MB_CLASS (this block can't
// route through SectionShell itself: desktop's pinned stage needs
// bespoke full-bleed markup).
const SECTION_GAP_MB_CLASS: Record<SpacingValue, string> = {
  loose: 'mb-section-gap-loose',
  medium: 'mb-section-gap-medium',
  tight: 'mb-section-gap-tight',
  none: 'mb-none',
}

// Shared markup for a single slide — same content shape as Full Width
// Single (numbered eyebrow, heading, body, image), always on the
// inverse/dark tone (this prototype hasn't got a per-panel tone field
// yet — one more thing to settle once the motion itself feels right).
// Media sits between the heading and the body (Full Width Single's
// "afterHeading" layout) — heading-to-media keeps this container's own
// gap-2xl (64px); media-to-body is narrower (32px, half that), so the
// body pulls itself up by the difference (64 − 32) via a negative
// marginTop rather than the gap simply being smaller for that one pair.
function PanelContent({ panel, mobileImageStyle }: { panel: ScrollStackPanelData; mobileImageStyle?: CSSProperties }) {
  return (
    // Mobile: 32px top/left/right (matches the sitewide edge line every
    // other full-bleed block lands on — this panel has no outer margin
    // of its own to make up the difference, unlike Dark Banner's boxed
    // 8px+24px split), but 64px on the bottom specifically. Desktop
    // unchanged at a flat p-2xl (64px all sides).
    <div className="flex h-full flex-col justify-center gap-2xl bg-foreground px-large pt-large pb-2xl text-background md:p-2xl">
      <SectionIntro
        as="h2"
        eyebrow={panel.eyebrow && renderNumberedEyebrow(panel.eyebrow, true, true)}
        eyebrowColor="text-background"
        heading={panel.heading}
        align="left"
        maxWidth="lg"
        tone="inverse"
      />
      {panel.media && (
        <PanelImage
          media={panel.media}
          alt={panel.heading ?? ''}
          className="aspect-media w-full rounded-lg md:aspect-media-wide md:rounded-t-lg md:rounded-b-none"
          imageStyle={mobileImageStyle}
        />
      )}
      {panel.body && (
        <p
          className="max-w-prose-lg text-scroll-stack-body text-background/80"
          style={panel.media ? { marginTop: 'calc(var(--spacing-large) - var(--spacing-2xl))' } : undefined}
        >
          {panel.body}
        </p>
      )}
    </div>
  )
}

// Desktop-only pinned slide — its opacity is purely a function of its
// own distance from `activeIndex` (the continuous "which slide is
// centered right now" position driven by scroll, shared across every
// panel). Not yet reached (still to the right, distance negative):
// fades UP from 30% as it approaches. Already passed (now to the
// left, distance positive): fades back DOWN to 30% as it recedes.
// Dan's explicitly unsure whether the passed side should keep fading
// all the way to 0 instead of floors at 30% — that's the main thing
// to play with once this is live; the 0.3 floor on both sides is just
// the starting point, not a settled decision.
function ScrollStackPanel({
  index,
  activeIndex,
  panel,
}: {
  index: number
  activeIndex: MotionValue<number>
  panel: ScrollStackPanelData
}) {
  const opacity = useTransform(activeIndex, [index - 1, index, index + 1], [0.1, 1, 0.1])
  return (
    <motion.div className="h-full w-scroll-panel shrink-0" style={{ opacity }}>
      <PanelContent panel={panel} />
    </motion.div>
  )
}

// Still experimental — the motion timing and the opacity floor on the
// "already passed" side are tuned by eye, not settled — but now wired
// into Sanity (2-6 editor-authored slides) rather than demo-only.
// Horizontally scrolls through a handful of full-bleed slides as the
// page scrolls vertically, instead of them stacking on top of each
// other — like Apple's pinned horizontal-scroll product sections. The
// first slide starts centered in the viewport; later slides peek in
// from the right and the one behind dims as the next one takes over.
// Reverts to a plain vertical stack on mobile via a CSS-only
// md:hidden/hidden md:block split (not a JS check) — same pattern as
// Hero Image Overlay Card's own desktop-only scroll rig.
export function HorizontalScrollStackBlock({ panels, spacing = 'loose' }: HorizontalScrollStackBlockProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  // How much extra scroll each panel-to-panel step takes, tuned by eye
  // — not yet settled, part of what we're playing with.
  const DWELL_VH_PER_PANEL = 70
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end end'] })
  // 0 while the first slide is centered, panels.length - 1 once the
  // last one is (clamped at 0 below when there's only one slide, since
  // useTransform's input range can't collapse to a single point).
  const activeIndex = useTransform(scrollYProgress, [0, 1], [0, Math.max(panels.length - 1, 1)])
  // Shifts the track left by one slide-width-plus-gutter per whole
  // step of activeIndex — the CSS calc (not a numeric px transform)
  // is what lets the slide width stay a vw-relative token instead of
  // needing a measured pixel value from JS.
  const trackX = useTransform(
    activeIndex,
    (v) => `calc(-1 * ${v} * (var(--width-scroll-panel) + var(--spacing-medium-large)))`,
  )

  // "Locks into" the nearest slide once scrolling stops, instead of
  // leaving it resting at whatever fractional position the user
  // happened to stop at — a plain debounced scroll listener + a
  // smooth-scroll to the nearest slide's own resting scrollY, rather
  // than real CSS scroll-snap: this isn't a scrollable element with
  // its own snap points, it's the page's own vertical scroll being
  // repurposed to drive a horizontal transform, so there's no overflow
  // container for scroll-snap-type to attach to.
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const SNAP_DELAY_MS = 150
    const SETTLED_THRESHOLD = 0.02

    function snapToNearestSlide() {
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const rect = wrapper.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      // Only while the pinned stage is actually stuck (its top has
      // reached the viewport top but its bottom hasn't yet) — before
      // or after that range, this is just the page's normal scroll
      // and shouldn't get pulled back into this block.
      if (rect.top > 1 || rect.bottom < viewportHeight - 1) return
      const current = activeIndex.get()
      const nearest = Math.round(current)
      if (Math.abs(current - nearest) < SETTLED_THRESHOLD) return
      const scrollableRange = wrapper.offsetHeight - viewportHeight
      const targetProgress = nearest / Math.max(panels.length - 1, 1)
      const targetScrollY = window.scrollY + rect.top + targetProgress * scrollableRange
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' })
    }

    function handleScroll() {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(snapToNearestSlide, SNAP_DELAY_MS)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [activeIndex, panels.length])

  // Editor hasn't added any slides yet — nothing sensible to pin/scroll.
  // After all hooks above, never before — hooks can't be called
  // conditionally.
  if (!panels.length) return null

  return (
    <div className={SECTION_GAP_MB_CLASS[spacing]}>
      {/* No gap — each slide already carries its own full bg-foreground,
          so a flex gap here would show the page's own light background
          through the sliver between adjacent dark slides. */}
      <div className="flex flex-col md:hidden">
        {panels.map((panel, i) => (
          <PanelContent
            key={i}
            panel={panel}
            // TEMP — testing only, see PanelImage's own comment.
            mobileImageStyle={{ transform: 'scale(2.25)', transformOrigin: 'top left' }}
          />
        ))}
      </div>
      <div
        ref={wrapperRef}
        className="relative hidden md:block"
        style={{ height: `${100 + (panels.length - 1) * DWELL_VH_PER_PANEL}vh` }}
      >
        {/* The dark background belongs to the whole pinned section, not
            each individual slide — a slide is only --width-scroll-panel
            (78vw) wide, so without this the page's own light background
            showed through the gutters on either side of it as you
            scrolled. PanelContent's own bg-foreground stays too
            (needed for mobile's separately-stacked slides); here it's
            just redundant with this one, not fighting it. */}
        <div className="sticky top-0 h-screen overflow-hidden bg-foreground">
          <motion.div
            className="flex h-full gap-medium-large"
            style={{
              x: trackX,
              // Centers panel 0 in the viewport at scroll position
              // zero — leading/trailing padding equal to half the
              // leftover space, same amount on both ends so the last
              // panel can also come to rest centered.
              paddingLeft: 'calc((100vw - var(--width-scroll-panel)) / 2)',
              paddingRight: 'calc((100vw - var(--width-scroll-panel)) / 2)',
            }}
          >
            {panels.map((panel, i) => (
              <ScrollStackPanel key={i} index={i} activeIndex={activeIndex} panel={panel} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
