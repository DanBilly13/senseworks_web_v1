'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { SectionIntro, HALF_HEADING_LINE_HEIGHT_GAP } from '@/components/ui/SectionIntro'
import { renderNumberedEyebrow } from '@/components/ui/numberedEyebrow'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

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
function PanelContent({ panel }: { panel: ScrollStackPanelData }) {
  return (
    <div className="flex h-full flex-col justify-center gap-2xl bg-foreground p-medium-large text-background md:p-2xl">
      <SectionIntro
        as="h2"
        eyebrow={panel.eyebrow && renderNumberedEyebrow(panel.eyebrow, true, true)}
        eyebrowColor="text-background"
        heading={panel.heading}
        align="left"
        maxWidth="lg"
        tone="inverse"
      />
      {panel.body && (
        <p
          className="max-w-prose-lg text-body text-background/80"
          style={{ marginTop: HALF_HEADING_LINE_HEIGHT_GAP.h2 }}
        >
          {panel.body}
        </p>
      )}
      {panel.media && (
        <Media
          media={panel.media}
          alt={panel.heading ?? ''}
          className="aspect-media w-full rounded-lg md:aspect-media-wide"
        />
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
  const opacity = useTransform(activeIndex, [index - 1, index, index + 1], [0.3, 1, 0.3])
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

  // Editor hasn't added any slides yet — nothing sensible to pin/scroll.
  // After all hooks above, never before — hooks can't be called
  // conditionally.
  if (!panels.length) return null

  return (
    <div className={SECTION_GAP_MB_CLASS[spacing]}>
      <div className="flex flex-col gap-large md:hidden">
        {panels.map((panel, i) => (
          <PanelContent key={i} panel={panel} />
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
