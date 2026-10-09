import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import { PlayOnScrollMedia } from '@/components/ui/PlayOnScrollMedia'
import { ArticleImage } from '@/components/knowledge-bank/ArticleImage'
import type { MediaField } from '@/lib/sanity/media'

type BackgroundType = 'image' | 'color' | 'gradient'
type BackgroundColor = 'foreground' | 'accent' | 'surface'
type TextTone = 'light' | 'dark'

type HeroBackdropBlockProps = {
  backgroundType?: BackgroundType
  backgroundImage?: MediaField
  backgroundColor?: BackgroundColor
  textTone?: TextTone
  eyebrow?: string
  headline: string
  subhead?: string
  ctaLabel?: string
  ctaHref?: string
  ctaNote?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  showcaseMedia?: MediaField
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  // 'display' draws the headline one step above the standard h1.
  headlineSize?: 'h1' | 'display'
}

// Margin-bottom after the hero (outside its backdrop, before the next
// block) — same four tiers as every other block's Section spacing.
// Medium is the default because it's exactly the old fixed
// mb-section-edge (120px desktop / 64px mobile), so heroes that never
// set this look unchanged.
const SECTION_GAP_MB_CLASS: Record<NonNullable<HeroBackdropBlockProps['spacing']>, string> = {
  loose: 'mb-section-gap-loose',
  medium: 'mb-section-gap-medium',
  tight: 'mb-section-gap-tight',
  none: 'mb-none',
}

const BACKGROUND_COLOR_CLASS: Record<BackgroundColor, string> = {
  foreground: 'bg-foreground',
  accent: 'bg-accent',
  surface: 'bg-surface',
}

export function HeroBackdropBlock({
  backgroundType = 'image',
  backgroundImage,
  backgroundColor = 'foreground',
  textTone = 'light',
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  ctaNote,
  secondaryCtaLabel,
  secondaryCtaHref,
  showcaseMedia,
  spacing = 'medium',
  headlineSize,
}: HeroBackdropBlockProps) {
  // Only a plain image gets to set its own height from its real aspect
  // ratio (via the asset ref's encoded dimensions) — video/lottie/
  // reactAnimation don't carry that same kind of intrinsic ratio here,
  // so they keep the fixed aspect-media box below.
  const showcaseIsImage = showcaseMedia?.mediaType === 'image' && !!showcaseMedia.image

  return (
    // Experimental composition, not settled tokens yet. The text zone
    // uses top/bottom padding (2x section-edge on top, 1.5x on the
    // bottom) instead of a vh-based min-height, so the "starts a way
    // down the page" delayed reveal comes from the same token every
    // other page-boundary spacing already uses — it scales if that
    // token ever changes, and it's just as much room on a short mobile
    // screen as a tall desktop one, unlike a min-height tied to
    // viewport height. No gap to the showcase media below any more —
    // the zone's own bottom padding already provides that space.
    <section
      className={[
        'relative',
        SECTION_GAP_MB_CLASS[spacing],
        backgroundType === 'color' ? BACKGROUND_COLOR_CLASS[backgroundColor] : '',
        backgroundType === 'gradient' ? 'bg-accent-gradient' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      // Same page-top pull-up as the full-bleed image Hero — see
      // HeroBlock's HeroImageOverlay for the full rationale. No fixed
      // height here any more — the section's own height now just
      // follows its content (text zone's padding + the showcase
      // media's natural height).
      style={{ marginTop: 'calc(var(--header-height, 0px) * -1)' }}
    >
      {backgroundType === 'image' && (
        <div className="absolute inset-0">
          <Media media={backgroundImage} alt={headline} className="size-full" />
        </div>
      )}
      {backgroundType === 'image' && (
        <div className="absolute inset-0 bg-foreground/55" aria-hidden="true" />
      )}
      {/* pb-section-edge here (inside the backdrop) is separate from
          the section's own bottom margin above (outside it, before
          the next block) — without it the showcase media sat flush
          against the very edge of its own colored/gradient/image
          background, with only page background (not this hero's own
          backdrop) providing any breathing room below it. */}
      <div className="relative mx-auto flex w-full max-w-page flex-col px-medium-large pb-section-edge">
        <div
          style={{
            paddingTop: 'calc(var(--spacing-section-edge) * 2)',
            // Halved from 1.5x — Dan wanted the text-to-showcase gap
            // tighter than the original section-edge-derived spacing.
            paddingBottom: 'calc(var(--spacing-section-edge) * 0.75)',
          }}
        >
          <SectionIntro
            as="h1"
            display={headlineSize === 'display'}
            eyebrow={eyebrow}
            heading={headline}
            body={subhead}
            maxWidth="md"
            headingMaxWidth="subtitle"
            tone={textTone === 'light' ? 'inverse' : 'default'}
            cta={
              ctaLabel &&
              ctaHref && (
                <div className="flex flex-col items-start gap-small-medium">
                  <div className="flex flex-wrap items-center gap-medium-large">
                    <Button href={ctaHref} variant={textTone === 'light' ? 'filled-accent' : 'filled-dark'}>
                      {ctaLabel}
                    </Button>
                    {secondaryCtaLabel && secondaryCtaHref && (
                      <a
                        href={secondaryCtaHref}
                        className={[
                          'text-body-sm font-medium underline underline-offset-4',
                          textTone === 'light' ? 'text-background' : 'text-foreground',
                        ].join(' ')}
                      >
                        {secondaryCtaLabel}
                      </a>
                    )}
                  </div>
                  {ctaNote && (
                    <p
                      className={[
                        'text-body-sm',
                        textTone === 'light' ? 'text-background/70' : 'text-muted-foreground',
                      ].join(' ')}
                    >
                      {ctaNote}
                    </p>
                  )}
                </div>
              )
            }
          />
        </div>
        {showcaseIsImage ? (
          <ArticleImage image={showcaseMedia.image!} alt={headline} className="rounded-lg" />
        ) : (
          <PlayOnScrollMedia
            media={showcaseMedia}
            alt={headline}
            // Mobile: full-bleed (break out of this wrapper's own
            // px-medium-large via a matching negative margin), no
            // rounded corners, no shadow, border top/bottom only —
            // reads as a strip of content, not a floating card, which
            // doesn't work at that size. No w-full here on purpose:
            // with the negative margin, w-full (100% of the PADDED
            // parent) leaves a gap the width of one side's padding —
            // negative margin-right doesn't stretch an element's own
            // width, only margin-left repositions it, so width:auto
            // (the block default) is what actually lets the box
            // expand to fill both reclaimed sides correctly. md: the
            // desktop card treatment — light grey border-border (not
            // the near-black border-foreground this had before) all
            // the way round, rounded-lg, w-full (back to 100% of the
            // normal, non-negative-margined parent), and a shadow a
            // step up from the scrollReveal video card's shadow-lg —
            // shadow-xl for more spread/blur, shadow-foreground/15
            // (the site's ink token at 15% instead of Tailwind's
            // default ~10% black) for more opacity.
            className="-mx-medium-large aspect-media border-y border-border md:mx-0 md:w-full md:rounded-lg md:border md:shadow-xl md:shadow-foreground/15"
          />
        )}
      </div>
    </section>
  )
}
