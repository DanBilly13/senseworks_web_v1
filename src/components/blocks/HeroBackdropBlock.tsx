import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
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
  showcaseMedia?: MediaField
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
  showcaseMedia,
}: HeroBackdropBlockProps) {
  // Only a plain image gets to set its own height from its real aspect
  // ratio (via the asset ref's encoded dimensions) — video/lottie/
  // reactAnimation don't carry that same kind of intrinsic ratio here,
  // so they keep the fixed aspect-media box below.
  const showcaseIsImage = showcaseMedia?.mediaType === 'image' && !!showcaseMedia.image

  return (
    // Experimental composition, not settled tokens yet. The text zone
    // uses top/bottom padding of double the standard section-edge gap
    // (not a vh-based min-height) so the "starts a way down the page"
    // delayed reveal comes from the same token every other page-
    // boundary spacing already uses — it scales if that token ever
    // changes, and it's just as much room on a short mobile screen as
    // a tall desktop one, unlike a min-height tied to viewport height.
    <section
      className={[
        'relative mb-section-edge',
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
          the section's own mb-section-edge above (outside it, before
          the next block) — without it the showcase media sat flush
          against the very edge of its own colored/gradient/image
          background, with only page background (not this hero's own
          backdrop) providing any breathing room below it. */}
      <div className="relative mx-auto flex w-full max-w-page flex-col gap-2xl px-medium-large pb-section-edge">
        <div
          style={{
            paddingTop: 'calc(var(--spacing-section-edge) * 2)',
            paddingBottom: 'calc(var(--spacing-section-edge) * 2)',
          }}
        >
          <SectionIntro
            as="h1"
            eyebrow={eyebrow}
            heading={headline}
            body={subhead}
            maxWidth="md"
            headingMaxWidth="subtitle"
            tone={textTone === 'light' ? 'inverse' : 'default'}
            cta={
              ctaLabel &&
              ctaHref && (
                <Button href={ctaHref} variant={textTone === 'light' ? 'filled-light' : 'filled-dark'}>
                  {ctaLabel}
                </Button>
              )
            }
          />
        </div>
        {showcaseIsImage ? (
          <ArticleImage image={showcaseMedia.image!} alt={headline} className="rounded-lg" />
        ) : (
          <Media media={showcaseMedia} alt={headline} className="aspect-media w-full rounded-lg" />
        )}
      </div>
    </section>
  )
}
