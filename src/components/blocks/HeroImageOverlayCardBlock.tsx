'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type HeroImageOverlayCardBlockProps = {
  eyebrow?: string
  headline: string
  subhead?: string
  ctaLabel?: string
  ctaHref?: string
  media?: MediaField
  cardBackground?: 'dark' | 'gradient'
  cardWidth?: '50' | '100'
  spacing?: 'loose' | 'medium' | 'tight'
}

// Matches SectionShell's own loose/medium/tight tiers (see globals.css)
// — this Hero can't route through SectionShell itself (full-bleed,
// header pull-up, and the desktop scroll wrapper all need bespoke
// markup), so the gap below it is applied by hand here instead.
const MB_CLASS = {
  loose: 'mb-section-gap-loose',
  medium: 'mb-section-gap-medium',
  tight: 'mb-section-gap-tight',
}

// Its own block/file (was a `layout` option inside heroBlock/HeroBlock.tsx)
// once the desktop version grew a real scroll-driven interaction and
// its own layout-specific fields — everything below
// MobileImageOverlayCard is specific to this one Hero and doesn't
// belong mixed in with the other, much simpler Hero variants.
export function HeroImageOverlayCardBlock(props: HeroImageOverlayCardBlockProps) {
  return (
    <>
      {/* Both versions render — hidden via CSS, not a client-side
          isDesktop check — so there's no layout flash while that
          would resolve, same tradeoff as any other mobile/desktop
          split markup on this site (e.g. the header's nav). The
          desktop version's scroll tracking runs against a
          display:none element on mobile, which is harmless (it's
          just idle) but worth knowing if you go looking for it. */}
      <div className="md:hidden">
        <MobileImageOverlayCard {...props} />
      </div>
      <div className="hidden md:block">
        <DesktopImageOverlayCard {...props} />
      </div>
    </>
  )
}

function CardIntro({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  isDark,
}: {
  eyebrow?: string
  headline: string
  subhead?: string
  ctaLabel?: string
  ctaHref?: string
  isDark: boolean
}) {
  return (
    <SectionIntro
      as="h1"
      eyebrow={eyebrow}
      heading={headline}
      body={subhead}
      headingMaxWidth="none"
      tone={isDark ? 'inverse' : 'default'}
      // Yellow accent for the dark card only — the gradient card's
      // own background is already close to this same accent yellow
      // (see --gradient-accent), so accent text/button there would
      // have poor contrast; that variant keeps its default styling.
      eyebrowColor={isDark ? 'text-accent' : undefined}
      cta={
        ctaLabel &&
        ctaHref && (
          <Button href={ctaHref} variant={isDark ? 'filled-accent' : 'filled-dark'}>
            {ctaLabel}
          </Button>
        )
      }
    />
  )
}

// The original overlay treatment, unchanged: card stacks above the
// video in plain normal flow, both full width, no forced section
// height, no scroll interaction. Mobile keeps this simple layout
// rather than getting the desktop version's shrink-on-scroll sequence
// — that's a desktop-appropriate technique, and mobile was already
// deliberately simplified to this plain stack in an earlier pass.
function MobileImageOverlayCard({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  media,
  cardBackground = 'dark',
  spacing = 'loose',
}: HeroImageOverlayCardBlockProps) {
  const isDark = cardBackground === 'dark'
  return (
    // No header pull-up here (unlike HeroBackdropBlock/HeroBlock's
    // full-bleed layouts) — that trick only reads right when the
    // header is transparent enough to see through, or the covered
    // content is decorative background, neither true here: the header
    // is opaque, and this card's own top padding (24px on mobile) is
    // shorter than the header's height, so pulling it up just hid the
    // eyebrow behind an opaque bar (confirmed by hand on a live
    // deploy). Same reasoning as the desktop version's own top offset.
    <section className={`relative ${MB_CLASS[spacing]}`}>
      <div className="relative z-10 mx-auto flex w-full max-w-page flex-col px-medium-large">
        {/* -mx-medium-large breaks out to full-bleed (cancels this
            wrapper's own px-medium-large) — negative margin-right
            alone wouldn't stretch the box, but this is a flex child,
            and stretch sizing does account for negative margins,
            unlike a plain block's width:auto. No rounded corners
            either — edge-to-edge doesn't read as a floating card. */}
        <div
          className={[
            'hero-overlay-card-padding -mx-medium-large',
            isDark ? 'bg-foreground' : 'bg-accent-gradient',
          ].join(' ')}
        >
          <CardIntro
            eyebrow={eyebrow}
            headline={headline}
            subhead={subhead}
            ctaLabel={ctaLabel}
            ctaHref={ctaHref}
            isDark={isDark}
          />
        </div>
      </div>
      {/* border-b only (not the desktop version's all-round border) —
          this video is full-bleed, so a border on the left/right/top
          would just sit off-screen; the bottom edge is the only one
          that visibly meets other page content. Same grey as the
          desktop version's border-border token (#e0e0e0). */}
      <div className="relative aspect-media w-full border-b border-border">
        <Media media={media} alt={headline} className="size-full" />
      </div>
    </section>
  )
}

// Desktop: no pin/scroll-jacking — the video is a `position: sticky`
// box (not `fixed`) that shrinks in normal document flow, so the
// wrapper shrinks in lockstep with it and content below (Logo Cloud
// etc.) naturally rides into view as it happens, not just once fully
// released. Sticky's own release (once this wrapper's bottom scrolls
// past) does the "carry it away" job — the sticky box has already
// shrunk to its small resting size by release time, so there's no
// full-viewport-tall box left behind to leave a gap. Card exits via
// opacity, not a translateY percentage — deliberately, so it's
// unaffected by the box it's sitting in shrinking underneath it (a
// %-based transform recalculates against its own element's current
// size, which would otherwise drag the card back into view as the
// box shrinks). Replaced an earlier pin-and-morph version (manual
// position:fixed/absolute phase-tracking, a long held scroll-through)
// once this simpler, snappier approach won out.
function DesktopImageOverlayCard({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  media,
  cardBackground = 'dark',
  cardWidth = '50',
  spacing = 'loose',
}: HeroImageOverlayCardBlockProps) {
  const isDark = cardBackground === 'dark'
  const wrapperRef = useRef<HTMLDivElement>(null)

  // useLayoutEffect, not useEffect — same reasoning as headerHeight
  // below: avoids a one-frame window where this reads its default
  // (0, 0) on a real, on-screen paint.
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const update = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  const contentWidth = Math.min(1440, viewportSize.width - 48)
  const contentHeight = (contentWidth * 5) / 7

  // Reads --header-height as a number (HeaderBlock sets it via JS, not
  // a static value) so the pull-up below can animate against it rather
  // than jump. A MutationObserver on <html>'s style attribute catches
  // it the moment HeaderBlock sets/updates it, not just on mount/resize.
  // useLayoutEffect, not useEffect — matches HeaderBlock's own
  // measurement (also useLayoutEffect). With a plain useEffect, the
  // very first paint briefly used headerHeight's default (0) before
  // this ran, snapping videoStickyTop to the wrong value for one real,
  // on-screen frame — invisible to the eye, but HeaderBlock's own
  // scroll tracking could sample exactly that frame and read the
  // correction a moment later as "the video just moved", triggering a
  // spurious hide-then-show right at the start of a scroll.
  const [headerHeight, setHeaderHeight] = useState(0)
  useLayoutEffect(() => {
    const read = () => {
      const px = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height'))
      setHeaderHeight(Number.isFinite(px) ? px : 0)
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] })
    window.addEventListener('resize', read)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', read)
    }
  }, [])

  // Two separate scroll budgets, not one: SHRINK_VH is how much scroll
  // the shrink itself takes, DWELL_VH is extra scroll held afterward
  // at the fully-settled size before release. Both matter because
  // `position: sticky` releases based on its OWN CURRENT height — as
  // the box shrinks, it needs less remaining wrapper space to keep
  // sticking, so it naturally lets go sooner the smaller it gets. With
  // only one combined budget (no explicit dwell), release happened
  // *before* the shrink was anywhere near done — confirmed by hand,
  // the video was still mostly full-size when it started scrolling
  // away. Completing the shrink within SHRINK_VH specifically (not
  // smeared across the whole wrapper, which was the original bug) is
  // what actually fixes that — once sticky height stops shrinking
  // (clamped at its settled contentHeight), release can't happen
  // before wrapperHeight - contentHeight worth of scroll, which is
  // already past SHRINK_VH for any viewport taller than the settled
  // video (~700px — true for virtually every real screen). DWELL_VH
  // is a small buffer on top of that guarantee, not the thing doing
  // the work — it was 60 (matching SHRINK_VH) at first, which worked
  // but meant the wrapper's total height doubled for no real benefit,
  // pushing the next block's own reveal (which starts as soon as
  // you're scrolling through this wrapper's *extra* height, whether
  // still stuck or not) needlessly far down the page. Bumped from 15
  // once videoStickyTop's settled offset doubled (see below) — a
  // bigger resting `top` eats into the same buffer (sticky needs more
  // remaining wrapper space to hold a box parked further down), so it
  // was cut close to release right as the shrink finished.
  const SHRINK_VH = 60
  const DWELL_VH = 25

  // Tells HeaderBlock's own scroll handler when it can stop forcing the
  // nav visible — see the comment there for why it needs this at all.
  // A plain number, computed once per render from ordinary state, NOT
  // read off the sticky video box's own live, animated position: an
  // earlier version tracked that box's on-screen movement directly,
  // which sounds more "honest" but broke in practice — Framer Motion
  // updates that box's style across several async-ish pieces of state
  // (headerHeight, viewportSize, scroll progress), and if the header's
  // own scroll tick ever sampled the box mid-update (most likely right
  // at the start, before everything has settled), it read the
  // in-progress value as "the video actually moved", and prematurely
  // hid the nav for a frame before snapping back. A plain, stateless
  // number has nothing to get out of sync with itself — even if it's
  // briefly wrong for one render (e.g. before viewportSize/headerHeight
  // have their real values), the very next render just recomputes it
  // fresh; there's no history to corrupt.
  //
  // The number itself: position:sticky can only hold the video at
  // `top: headerHeight*2` for as long as the wrapper has that much
  // room left below the current scroll position (its offset plus its
  // own settled height) — past that point it has to start releasing
  // for real. That's wrapperBottomDoc - headerHeight*2 - contentHeight,
  // where wrapperBottomDoc (the wrapper's own bottom, in document
  // coordinates) is headerHeight (its top) plus its own height. Add a
  // small buffer so the nav leaves just after the video actually
  // starts moving, not the instant it's theoretically allowed to.
  const KEEP_NAV_VISIBLE_SLACK_PX = 12
  const wrapperHeightPx = ((100 + SHRINK_VH + DWELL_VH) / 100) * (viewportSize.height || 0)
  const wrapperBottomDoc = headerHeight + wrapperHeightPx
  const navReleaseScrollY =
    wrapperBottomDoc - headerHeight * 2 - (contentHeight || 0) + KEEP_NAV_VISIBLE_SLACK_PX

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ['start start', 'end start'] })
  // 0 at the wrapper's top, 1 once SHRINK_VH of scroll has passed, then
  // clamped at 1 for the remaining DWELL_VH — i.e. the shrink completes
  // early and holds there, rather than stretching across the whole
  // wrapper (which is what let sticky release mid-shrink before).
  const shrinkProgress = useTransform(scrollYProgress, [0, SHRINK_VH / (100 + SHRINK_VH + DWELL_VH)], [0, 1])

  // A plain React state value, not a MotionValue — `useTransform`
  // bound to `style.opacity` specifically got stuck at its initial
  // value here and never updated on scroll (confirmed by hand: the
  // exact same source value bound to `width` instead updated
  // correctly every time). Driving it off the same `scrollYProgress`
  // via a manual subscription sidesteps whatever that is.
  const [cardOpacity, setCardOpacity] = useState(1)
  useEffect(() => {
    return shrinkProgress.on('change', (v) => setCardOpacity(Math.max(0, 1 - v / 0.4)))
  }, [shrinkProgress])
  const videoWidth = useTransform(shrinkProgress, [0, 1], [viewportSize.width || 0, contentWidth || 0])
  // Starts at viewportHeight MINUS headerHeight, not the full viewport
  // — this box never renders under the header (see videoStickyTop,
  // below), header included or not, so it only ever has the space
  // below the header to fill. The other full-bleed heroes on this site
  // (HeroBackdropBlock, HeroBlock) DO pull themselves up under the
  // header instead — that trick only pays off for a hero that stays
  // full-screen for as long as you're looking at it, so it can go
  // edge-to-edge without a gap if the header auto-hides mid-view. This
  // hero starts shrinking (and its own `top` starts moving off its
  // resting value) the instant ANY scrolling happens, before the
  // header's own auto-hide would ever trigger — so that trick would
  // buy nothing here, only cost a permanently nav-covered video.
  const videoHeight = useTransform(
    shrinkProgress,
    [0, 1],
    [(viewportSize.height || 0) - headerHeight, contentHeight || 0],
  )
  const videoRadius = useTransform(shrinkProgress, [0, 1], [0, 16])
  // Controls the resting position once stuck: headerHeight while
  // full-bleed (flush right below the header, never under it), then
  // relaxing to 2x headerHeight as it shrinks, so the settled small
  // video clears the header with a visible gap instead of touching it
  // (a plain 1x headerHeight technically cleared it but read as too
  // tight once the header reappears on scroll-up). No marginTop pull-up
  // needed alongside this — the box's natural in-flow position already
  // starts right after the header, which is exactly where we want it.
  const videoStickyTop = useTransform(shrinkProgress, [0, 1], [headerHeight, headerHeight * 2])
  // Fades in during the dwell (after the shrink's own progress has
  // clamped at 1), not the shrink itself — a finishing touch once the
  // box is already settled, not competing with the resize.
  const videoBorderColor = useTransform(
    scrollYProgress,
    [SHRINK_VH / (100 + SHRINK_VH + DWELL_VH), (SHRINK_VH + DWELL_VH / 2) / (100 + SHRINK_VH + DWELL_VH)],
    ['rgba(224, 224, 224, 0)', 'rgba(224, 224, 224, 1)'],
  )

  const SPACING_PX = { loose: 200, medium: 120, tight: 60 }

  return (
    <div
      ref={wrapperRef}
      // See navReleaseScrollY above for what this number means and why
      // it's computed rather than measured live. Only meaningful on
      // desktop; this whole component tree doesn't render on mobile
      // (see the md:hidden toggle above) — HeaderBlock separately
      // guards against reading it there anyway (offsetParent check).
      data-keep-nav-visible-until={navReleaseScrollY}
      className="relative"
      style={{ height: `${100 + SHRINK_VH + DWELL_VH}vh`, marginBottom: SPACING_PX[spacing] }}
    >
      {/* The sticky box IS the video box — no separate always-full-
          height stage wrapping it, so it actually shrinks (not just
          the video inside it), leaving nothing invisible covering the
          screen once it's small. Card lives INSIDE it (absolute
          inset-0), not as a separate sticky sibling — a sibling has
          its OWN normal-flow position, which starts below this box's
          full-height content, not overlapping it, so it only caught up
          and appeared once already scrolled about a screen's worth
          (confirmed by hand: looked like it slid in from below on
          load). Nesting it means it shares this box's position from
          the very first frame, no separate stickiness to line up. */}
      <motion.div
        className="sticky mx-auto overflow-hidden border"
        style={{
          top: videoStickyTop,
          width: videoWidth,
          height: videoHeight,
          borderRadius: videoRadius,
          borderColor: videoBorderColor,
        }}
      >
        <Media media={media} alt={headline} className="size-full" />
        {/* Opacity only (not a translateY percentage) — a %-based
            transform recalculates against this box's OWN current size,
            which is shrinking underneath it, and would visibly drag
            the card back into view as that happens. */}
        <motion.div
          style={{ opacity: cardOpacity }}
          className="absolute inset-0 z-10 mx-auto flex w-full max-w-page flex-col justify-center px-medium-large"
        >
          <div
            className={[
              'hero-overlay-card-padding rounded-lg',
              cardWidth === '50' ? 'w-1/2' : 'w-full',
              isDark ? 'bg-foreground' : 'bg-accent-gradient',
            ].join(' ')}
          >
            <CardIntro
              eyebrow={eyebrow}
              headline={headline}
              subhead={subhead}
              ctaLabel={ctaLabel}
              ctaHref={ctaHref}
              isDark={isDark}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

