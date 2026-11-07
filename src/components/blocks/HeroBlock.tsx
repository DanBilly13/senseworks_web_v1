import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro, headlineLineHeight } from '@/components/ui/SectionIntro'
import { phoneDisplay, phoneOr, ResponsiveMedia } from '@/components/ui/phone'
import { Media } from '@/components/ui/Media'
import { ScrollRevealStage } from './ScrollRevealStage'
import { hasMedia, type MediaField } from '@/lib/sanity/media'
import { BAND_BG, type BandTone } from '@/components/ui/BandFill'

type HeroBlockProps = {
  layout?: 'split' | 'splitEven' | 'imageOverlay' | 'overlap' | 'scrollReveal'
  eyebrow?: string
  headline: string
  body?: string
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
  // Side-by-side, 50/50 and Overlap: the image's shape. Unset: 7:5.
  imageRatio?: '7:5' | '7:4' | '7:3'
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
  // Full-bleed image overlay only: the headline in the accent (the
  // eyebrow-to-button rest stays white).
  headlineColor?: 'default' | 'accent'
  // Full-bleed image overlay only: the hero stays put and the rest of
  // the page scrolls up over it (the wrapper is BlockRenderer's).
  pinned?: boolean
  // The Mobile tab: phone versions, 'inherit' (or unset) = same as desktop.
  mobileHeadlineSize?: 'inherit' | 'h1' | 'display'
  mobileMedia?: MediaField
  mobileRatio?: 'inherit' | '7:5' | '7:4' | '1:1' | '4:5'
  mobileAlign?: 'inherit' | 'left' | 'center'
}

export function HeroBlock({ layout = 'split', ...props }: HeroBlockProps) {
  if (layout === 'scrollReveal') return <HeroScrollReveal {...props} />
  if (layout === 'imageOverlay') return <HeroImageOverlay {...props} />
  if (layout === 'overlap') return <HeroOverlap {...props} />
  if (layout === 'splitEven') return props.splitImage === 'half' ? <HeroSplitHalf {...props} /> : <HeroSplitEven {...props} />
  return <HeroSplit {...props} />
}

type HeroVariantProps = Omit<HeroBlockProps, 'layout'>

const RATIO_CLASS = { '7:5': 'aspect-media', '7:4': 'aspect-hero', '7:3': 'aspect-hero-wide' }
const MD_RATIO_CLASS = { '7:5': 'md:aspect-media', '7:4': 'md:aspect-hero', '7:3': 'md:aspect-hero-wide' }
const PHONE_RATIO_CLASS = { '7:5': 'aspect-media', '7:4': 'aspect-hero', '1:1': 'aspect-square', '4:5': 'aspect-4/5' }
// The image's shape: the desktop one, or the Mobile tab's on phones.
const ratioClass = (desktop: HeroBlockProps['imageRatio'] = '7:5', phone: HeroBlockProps['mobileRatio']) => {
  const d = RATIO_CLASS[desktop] ? desktop : '7:5'
  return !phone || phone === 'inherit' ? RATIO_CLASS[d] : `${PHONE_RATIO_CLASS[phone]} ${MD_RATIO_CLASS[d]}`
}
// SectionIntro's headline sizes: desktop's, and the phone's.
const sizes = (headlineSize: HeroBlockProps['headlineSize'], mobileHeadlineSize: HeroBlockProps['mobileHeadlineSize']) => ({
  display: headlineSize === 'display',
  phoneDisplay: phoneDisplay(mobileHeadlineSize, headlineSize === 'display'),
})

function HeroSplit({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  media,
  headlineSize,
  typingHeadline,
  mobileHeadlineSize,
  mobileMedia,
  mobileRatio,
  imageWidth = 'content',
  imageRatio = '7:5',
  tone = 'none',
}: HeroVariantProps) {
  const ratio = ratioClass(imageRatio, mobileRatio)
  const dark = tone === 'dark' || tone === 'accentDark'
  // Full screen width: the image leaves the page column (square
  // corners, edge to edge). Either way the image sits as far below
  // the text as the text sits below the top of the hero (Dan's call,
  // rather than the usual 64px intro-to-content gap).
  const full = imageWidth === 'full'
  const section = (
    <SectionShell py="section-edge" pad="both" pb={full ? 'none' : undefined} className="flex flex-col gap-section-edge">
      {/* Headline two thirds of the row, subtext one third (from 1280
          wide — on narrower screens a third is too thin for the H4
          body, so half each), a generous gutter between them, the
          subtext sitting on the headline's bottom. */}
      <div className="grid grid-cols-1 items-end gap-large md:grid-cols-2 md:gap-2xl lg:gap-3xl xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionIntro
            as="h1"
            {...sizes(headlineSize, mobileHeadlineSize)}
            typing={typingHeadline}
            eyebrow={eyebrow}
            heading={headline}
            headingMaxWidth="none"
            tone={dark ? 'inverse' : 'default'}
            typingCursorClassName={dark ? 'text-accent' : undefined}
          />
        </div>
        {(body || (ctaLabel && ctaHref)) && (
          <div className="flex flex-col gap-medium">
            {body && (
              <p className={`max-w-prose-md text-h4 font-bold text-pretty ${dark ? 'text-background' : 'text-foreground'}`}>{body}</p>
            )}
            {ctaLabel && ctaHref && (
              // Doubles the subhead-to-button gap (16px container gap +
              // this) from 16px to 32px, matching SectionIntro's own
              // body-to-cta doubling — this column doesn't go through
              // SectionIntro, so it needs the same bump applied by hand.
              <div className={body ? 'mt-medium' : ''}>
                <Button href={ctaHref} variant={dark ? 'filled-accent' : undefined}>
                  {ctaLabel}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* D15: contained within the page-width cap, not full-bleed.
          aspect-media (7:5) instead of a fixed height so it scales
          correctly with the column's actual rendered width. Media
          itself falls back to a grey box when no asset is set. */}
      {!full && <ResponsiveMedia media={media} phone={mobileMedia} alt={headline} className={`${ratio} w-full rounded-lg`} />}
    </SectionShell>
  )
  // A background fills behind the whole hero (the full-width image
  // too), with the gap to the next block outside it.
  const bg = tone !== 'none' ? BAND_BG[tone] : ''
  if (!full) return bg ? <div className={`mb-section-edge w-full ${bg}`}>{section}</div> : section
  return (
    <div className={`mb-section-edge w-full ${bg}`}>
      {section}
      <ResponsiveMedia media={media} phone={mobileMedia} alt={headline} className={`${ratio} mt-section-edge w-full`} />
    </div>
  )
}

function HeroSplitEven({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  media,
  headlineSize,
  typingHeadline,
  mobileHeadlineSize,
  mobileMedia,
  mobileRatio,
  mobileAlign,
  imageRatio = '7:5',
}: HeroVariantProps) {
  return (
    <SectionShell py="section-edge" pad="both">
      <div className="grid grid-cols-1 gap-stack md:grid-cols-2 md:items-center">
        <SectionIntro
          as="h1"
          {...sizes(headlineSize, mobileHeadlineSize)} typing={typingHeadline}
          eyebrow={eyebrow}
          heading={headline}
          body={body}
          maxWidth="md"
          phoneAlign={phoneOr(mobileAlign, 'left')}
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
        <ResponsiveMedia media={media} phone={mobileMedia} alt={headline} className={`${ratioClass(imageRatio, mobileRatio)} w-full rounded-lg`} />
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
  body,
  ctaLabel,
  ctaHref,
  media,
  headlineSize,
  typingHeadline,
  mobileHeadlineSize,
  mobileMedia,
  mobileRatio,
  mobileAlign,
  tone = 'none',
  stack = 'single',
  secondMedia,
}: HeroVariantProps) {
  const dark = tone === 'dark' || tone === 'accentDark'
  return (
    <section className="hero-split-half mb-section-edge grid w-full grid-cols-1 md:grid-cols-2">
      {/* The background sits behind the text half only, so a gradient
          shows whole rather than half hidden under the image. */}
      <div
        className={`hero-split-half-text flex flex-col justify-center px-edge py-section-edge md:pl-large md:pr-2xl ${tone !== 'none' ? BAND_BG[tone] : ''}`}
      >
        <SectionIntro
          as="h1"
          {...sizes(headlineSize, mobileHeadlineSize)}
          typing={typingHeadline}
          eyebrow={eyebrow}
          heading={headline}
          body={body}
          maxWidth="md"
          phoneAlign={phoneOr(mobileAlign, 'left')}
          tone={dark ? 'inverse' : 'default'}
          typingCursorClassName={dark ? 'text-accent' : undefined}
          cta={ctaLabel && ctaHref && <Button href={ctaHref} variant={dark ? 'filled-accent' : 'filled-dark'}>{ctaLabel}</Button>}
        />
      </div>
      {/* The wrapper owns the sizing (Media's own root is relative).
          Stacked: two halves, no gap, from tablet up — phones show
          the top one only. */}
      <div className={`relative md:aspect-auto ${PHONE_RATIO_CLASS[phoneOr(mobileRatio, '7:5')]}`}>
        <div className="absolute inset-0 flex flex-col">
          <ResponsiveMedia media={media} phone={mobileMedia} alt={headline} className="min-h-0 w-full flex-1" />
          {stack === 'stacked' && (
            <Media media={hasMedia(secondMedia) ? secondMedia : media} alt={headline} ariaHidden className="hidden min-h-0 w-full flex-1 md:block" />
          )}
        </div>
      </div>
    </section>
  )
}

// The Senseworks mark as a mask, so it takes the text colour.
const BRANDMARK_MASK = {
  aspectRatio: '61 / 18',
  maskImage: 'url(/senseworks-brandmark-pos.svg)',
  maskSize: 'contain',
  maskRepeat: 'no-repeat',
  WebkitMaskImage: 'url(/senseworks-brandmark-pos.svg)',
  WebkitMaskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
}

// A big headline across the top, its last line running over the top
// of an image that fills the right of the page column and runs off
// the screen's right edge (.hero-overlap-media, globals.css); the body
// and button down the left under the headline, the Senseworks mark at
// the bottom left. Phones stack it: headline, body, button, image.
function HeroOverlap({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  media,
  headlineSize,
  typingHeadline,
  mobileHeadlineSize,
  mobileMedia,
  mobileRatio,
  tone = 'none',
  imageRatio = '7:5',
}: HeroVariantProps) {
  const dark = tone === 'dark' || tone === 'accentDark'
  // How far the image reaches up under the headline: half its line.
  const overlap = `calc(var(--text-${headlineSize === 'display' ? 'display' : 'h1'}--full-line-height) * 0.5)`
  return (
    <section
      className={`hero-overlap mb-section-edge w-full overflow-hidden py-section-edge ${tone !== 'none' ? BAND_BG[tone] : ''}`}
      style={{ '--hero-overlap': overlap } as React.CSSProperties}
    >
      <div className="relative z-10 mx-auto w-full max-w-page px-edge md:px-gutter">
        <SectionIntro
          as="h1"
          {...sizes(headlineSize, mobileHeadlineSize)}
          typing={typingHeadline}
          eyebrow={eyebrow}
          heading={headline}
          maxWidth="none"
          headingMaxWidth="none"
          tone={dark ? 'inverse' : 'default'}
          typingCursorClassName={dark ? 'text-accent' : undefined}
        />
      </div>
      <div className="hero-overlap-row mx-auto mt-stack grid w-full max-w-page grid-cols-1 gap-stack px-edge md:grid-cols-2 md:gap-xl md:px-gutter xl:grid-cols-3">
        <div className="hero-overlap-text flex flex-col items-start justify-between gap-stack">
          <div className="flex flex-col items-start gap-medium-large">
            {body && (
              <p className={`text-h3 font-bold text-pretty whitespace-pre-line ${dark ? 'text-background' : 'text-foreground'}`}>{body}</p>
            )}
            {ctaLabel && ctaHref && (
              <Button href={ctaHref} variant={dark ? 'filled-accent' : 'filled-dark'}>
                {ctaLabel}
              </Button>
            )}
          </div>
          <div aria-hidden="true" className={`hidden h-xl md:block ${dark ? 'bg-background' : 'bg-foreground'}`} style={BRANDMARK_MASK} />
        </div>
        <div className={`hero-overlap-media relative xl:col-span-2 ${ratioClass(imageRatio, mobileRatio)}`}>
          <ResponsiveMedia media={media} phone={mobileMedia} alt={headline} className="size-full" />
        </div>
      </div>
    </section>
  )
}

function HeroImageOverlay({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  media,
  headlineSize,
  typingHeadline,
  mobileHeadlineSize,
  mobileMedia,
  mobileAlign,
  headlineColor,
  pinned,
}: HeroVariantProps) {
  const overlayGap = `calc(${headlineLineHeight(headlineSize === 'display')} / 4)`
  return (
    <section
      // Pinned (from tablet up; phones just scroll): sticky instead, with the gap to the next block moved
      // into the covering panel (BlockRenderer) so it isn't a strip of
      // page showing between the hero and the content scrolling over.
      className={`min-h-screen ${pinned ? 'relative md:sticky md:top-0' : 'relative mb-section-edge'}`}
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
        <ResponsiveMedia media={media} phone={mobileMedia} alt={headline} className="size-full" />
      </div>
      {/* Flat scrim (not a directional gradient) so light text stays
          legible over whatever the eventual image is, regardless of
          where the text sits — it's vertically centered here, not
          pinned to one edge. */}
      <div className="absolute inset-0 bg-foreground/85" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-page flex-col justify-center px-medium-large md:px-gutter py-section-edge">
        <SectionIntro
          as="h1"
          {...sizes(headlineSize, mobileHeadlineSize)} typing={typingHeadline}
          eyebrow={eyebrow}
          heading={headline}
          body={body}
          maxWidth="md"
          headingMaxWidth="heroHeadline"
          phoneAlign={phoneOr(mobileAlign, 'left')}
          tone="inverse"
          headingColor={headlineColor === 'accent' ? 'text-accent' : undefined}
          subtitleColor={headlineColor === 'accent' ? 'text-background' : undefined}
          typingCursorClassName="text-accent"
          // Half the usual eyebrow/headline/body/button gaps (a quarter
          // of the headline's line-height instead of half), at Dan's
          // request, so the text reads as one tight block over the image.
          headingGap={overlayGap}
          bodyGap={overlayGap}
          ctaGap={overlayGap}
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
  body,
  ctaLabel,
  ctaHref,
  media,
  mediaWidth = 'full',
  headlineSize,
  typingHeadline,
  mobileHeadlineSize,
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
            {...sizes(headlineSize, mobileHeadlineSize)} typing={typingHeadline}
            eyebrow={eyebrow}
            heading={headline}
            body={body}
            headingMaxWidth="none"
            align="center"
            // Half the usual body-to-button gap (a quarter of the
            // headline's line-height instead of half), at Dan's request.
            ctaGap={`calc(${headlineLineHeight(headlineSize === 'display')} / 4)`}
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
