import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import { ScrollRevealStage } from './ScrollRevealStage'
import type { MediaField } from '@/lib/sanity/media'
import { BAND_BG, type BandTone } from '@/components/ui/BandFill'

type HeroBlockProps = {
  layout?: 'split' | 'splitEven' | 'imageOverlay' | 'scrollReveal'
  eyebrow?: string
  headline: string
  subhead?: string
  ctaLabel?: string
  ctaHref?: string
  media?: MediaField
  // scrollReveal only, below. Whether the sticky media spans the
  // full browser width or is capped/centered at max-w-page like
  // everything else on the site.
  mediaWidth?: 'full' | 'content'
  // Side-by-side only: its image inside the page column (rounded) or
  // edge to edge. Unset: content width, as before the option.
  imageWidth?: 'content' | 'full'
  // Side-by-side and 50/50: the image's shape. Unset: 7:5.
  imageRatio?: '7:5' | '7:4'
  // 50/50 only: the image beside the text in the page column, or
  // filling the screen's right half (see HeroSplitHalf). Unset: column.
  splitImage?: 'column' | 'half'
  // 50/50 on half the screen only: the background behind the text.
  tone?: BandTone
  // 50/50 on half the screen only: two media stacked in the half, no
  // gap — media on top, secondMedia (or media again) below.
  stack?: 'single' | 'stacked'
  secondMedia?: MediaField
  // 'display' draws the headline one step above the standard h1.
  headlineSize?: 'h1' | 'display'
  // The headline types itself out on load (ui/TypingText).
  typingHeadline?: boolean
}

export function HeroBlock({ layout = 'split', ...props }: HeroBlockProps) {
  if (layout === 'scrollReveal') return <HeroScrollReveal {...props} />
  if (layout === 'imageOverlay') return <HeroImageOverlay {...props} />
  if (layout === 'splitEven') return props.splitImage === 'half' ? <HeroSplitHalf {...props} /> : <HeroSplitEven {...props} />
  return <HeroSplit {...props} />
}

type HeroVariantProps = Omit<HeroBlockProps, 'layout'>

const RATIO_CLASS = { '7:5': 'aspect-media', '7:4': 'aspect-hero' }

function HeroSplit({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  media,
  headlineSize,
  typingHeadline,
  imageWidth = 'content',
  imageRatio = '7:5',
}: HeroVariantProps) {
  const ratio = RATIO_CLASS[imageRatio] ?? RATIO_CLASS['7:5']
  // Full screen width: the image leaves the page column (square
  // corners, edge to edge), the usual 64px below the text.
  const full = imageWidth === 'full'
  const section = (
    <SectionShell py="section-edge" pad="both" pb={full ? 'none' : undefined} className="flex flex-col gap-2xl">
      <div className="flex flex-col gap-large md:flex-row md:items-start md:justify-between md:gap-2xl">
        <div className="md:max-w-prose-md md:flex-1">
          <SectionIntro as="h1" display={headlineSize === 'display'} typing={typingHeadline} eyebrow={eyebrow} heading={headline} />
        </div>
        {(subhead || (ctaLabel && ctaHref)) && (
          <div className="flex flex-col gap-medium md:max-w-prose-xs md:shrink-0">
            {/* Reserves the same height as the eyebrow in the left
                column (same text/gap, just unpainted) so the body text
                below it lines up with the h1's top, not the eyebrow's —
                the two columns don't share a heading level to align
                against otherwise. Only needed once the columns actually
                sit side by side (md:) — on the stacked mobile layout
                it would just add a blank gap above the subtext. */}
            {eyebrow && (
              <p
                className="hidden text-caption font-bold tracking-wider uppercase md:invisible md:block"
                aria-hidden="true"
              >
                {eyebrow}
              </p>
            )}
            {subhead && <p className="text-body-lg text-muted-foreground">{subhead}</p>}
            {ctaLabel && ctaHref && (
              // Doubles the subhead-to-button gap (16px container gap +
              // this) from 16px to 32px, matching SectionIntro's own
              // body-to-cta doubling — this column doesn't go through
              // SectionIntro, so it needs the same bump applied by hand.
              <div className={subhead ? 'mt-medium' : ''}>
                <Button href={ctaHref}>{ctaLabel}</Button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* D15: contained within the page-width cap, not full-bleed.
          aspect-media (7:5) instead of a fixed height so it scales
          correctly with the column's actual rendered width. Media
          itself falls back to a grey box when no asset is set. */}
      {!full && <Media media={media} alt={headline} className={`${ratio} w-full rounded-lg`} />}
    </SectionShell>
  )
  if (!full) return section
  return (
    <div className="mb-section-edge w-full">
      {section}
      <Media media={media} alt={headline} className={`${ratio} mt-2xl w-full`} />
    </div>
  )
}

function HeroSplitEven({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  media,
  headlineSize,
  typingHeadline,
  imageRatio = '7:5',
}: HeroVariantProps) {
  return (
    <SectionShell py="section-edge" pad="both">
      <div className="grid grid-cols-1 gap-2xl md:grid-cols-2 md:items-center">
        <SectionIntro
          as="h1"
          display={headlineSize === 'display'} typing={typingHeadline}
          eyebrow={eyebrow}
          heading={headline}
          body={subhead}
          maxWidth="md"
          cta={
            ctaLabel &&
            ctaHref && (
              <Button href={ctaHref}>{ctaLabel}</Button>
            )
          }
        />
        {/* D15: contained within the page-width cap, not full-bleed.
            aspect-media (7:5) instead of a fixed height so it scales
            correctly with the column's actual rendered width. */}
        <Media media={media} alt={headline} className={`${RATIO_CLASS[imageRatio] ?? RATIO_CLASS['7:5']} w-full rounded-lg`} />
      </div>
    </SectionShell>
  )
}

// 50/50 with the image filling the screen's right half, edge to edge
// and top to bottom, at least 80% of the screen tall (more if the text
// needs it). The text keeps to the page column's left edge, however
// wide the screen. Phones: the text, then the image full width at 7:5.
function HeroSplitHalf({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  media,
  headlineSize,
  typingHeadline,
  tone = 'none',
  stack = 'single',
  secondMedia,
}: HeroVariantProps) {
  const dark = tone === 'inverse' || tone === 'accentDark'
  return (
    <section className="hero-split-half mb-section-edge grid w-full grid-cols-1 md:grid-cols-2">
      {/* The background sits behind the text half only, so a gradient
          shows whole rather than half hidden under the image. */}
      <div
        className={`hero-split-half-text flex flex-col justify-center px-large py-section-edge md:pr-2xl ${tone !== 'none' ? BAND_BG[tone] : ''}`}
      >
        <SectionIntro
          as="h1"
          display={headlineSize === 'display'}
          typing={typingHeadline}
          eyebrow={eyebrow}
          heading={headline}
          body={subhead}
          maxWidth="md"
          tone={dark ? 'inverse' : 'default'}
          typingCursorClassName={dark ? 'text-accent' : undefined}
          cta={ctaLabel && ctaHref && <Button href={ctaHref} variant={dark ? 'filled-accent' : 'filled-dark'}>{ctaLabel}</Button>}
        />
      </div>
      {/* The wrapper owns the sizing (Media's own root is relative).
          Stacked: two halves, no gap, from tablet up — phones show
          the top one only. */}
      <div className="relative aspect-media md:aspect-auto">
        <div className="absolute inset-0 flex flex-col">
          <Media media={media} alt={headline} className="min-h-0 w-full flex-1" />
          {stack === 'stacked' && (
            <Media media={secondMedia ?? media} alt={headline} ariaHidden className="hidden min-h-0 w-full flex-1 md:block" />
          )}
        </div>
      </div>
    </section>
  )
}

function HeroImageOverlay({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  media,
  headlineSize,
  typingHeadline,
}: HeroVariantProps) {
  return (
    <section
      className="relative mb-section-edge min-h-screen"
      style={{ marginTop: 'calc(var(--header-height, 0px) * -1)' }}
    >
      {/* mb- (not pb-) on purpose: the background image is an absolutely
          positioned child sized to this section's box (inset-0), so
          padding here would just stretch the image further rather than
          create a visible gap. A margin sits outside that box, matching
          the gap other sections get from SectionShell's pad="both". */}
      {/* Pulls up by the fixed header's own height (set as a custom
          property by HeaderBlock) to reclaim the space its in-flow
          spacer takes below it — this hero is the page-top one, so it
          sits truly edge-to-edge under the floating header instead of
          being pushed down by it, keeping min-h-screen a true full
          viewport height. */}
      {/* Full-bleed background (D15 lets section backgrounds go edge to
          edge). This wrapper owns the absolute positioning — Media's
          own root is `relative`, so passing "absolute inset-0" into
          its className would conflict with that. */}
      <div className="absolute inset-0">
        <Media media={media} alt={headline} className="size-full" />
      </div>
      {/* Flat scrim (not a directional gradient) so light text stays
          legible over whatever the eventual image is, regardless of
          where the text sits — it's vertically centered here, not
          pinned to one edge. */}
      <div className="absolute inset-0 bg-foreground/55" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-page flex-col justify-center px-medium-large md:px-gutter py-section-edge">
        <SectionIntro
          as="h1"
          display={headlineSize === 'display'} typing={typingHeadline}
          eyebrow={eyebrow}
          heading={headline}
          body={subhead}
          maxWidth="md"
          headingMaxWidth="heroHeadline"
          tone="inverse"
          typingCursorClassName="text-accent"
          cta={
            ctaLabel &&
            ctaHref && (
              <Button href={ctaHref} variant="filled-accent">
                {ctaLabel}
              </Button>
            )
          }
        />
      </div>
    </section>
  )
}

function HeroScrollReveal({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  media,
  mediaWidth = 'full',
  headlineSize,
  typingHeadline,
}: HeroVariantProps) {
  return (
    // Header pull-up, same as the other full-bleed layouts. No
    // mb-section-edge here unlike the other Hero layouts — position:
    // sticky's release mechanics already force a full extra screen of
    // "dead" scroll before the next block appears (see the comment on
    // ScrollRevealStage's last spacer), which is already far more
    // separation than the 120px every other block gets. Adding
    // section-edge on top of that made an already-long gap longer.
    //
    // The sticky/overlap/dwell mechanics and the reveal-driven video
    // pause live in ScrollRevealStage (a 'use client' component) —
    // split out so this file's other Hero layouts can stay plain
    // Server Components.
    <div className="relative" style={{ marginTop: 'calc(var(--header-height, 0px) * -1)' }}>
      <ScrollRevealStage media={media} alt={headline} mediaWidth={mediaWidth}>
        <div className="mx-auto w-full max-w-page md:px-gutter">
          <SectionIntro
            as="h1"
            display={headlineSize === 'display'} typing={typingHeadline}
            eyebrow={eyebrow}
            heading={headline}
            body={subhead}
            headingMaxWidth="none"
            align="center"
            cta={
              ctaLabel &&
              ctaHref && (
                <Button href={ctaHref} variant="filled-dark">
                  {ctaLabel}
                </Button>
              )
            }
          />
        </div>
      </ScrollRevealStage>
    </div>
  )
}
