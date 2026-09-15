import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
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
  return (
    // Experimental fixed viewport-height composition, not settled
    // tokens yet — 175vh total, split into a 75vh text zone (bottom-
    // aligned) directly above a 100vh showcase-media zone. Inline
    // styles rather than named tokens while these numbers are still
    // being dialed in.
    <section
      className={[
        'relative mb-section-edge',
        backgroundType === 'color' ? BACKGROUND_COLOR_CLASS[backgroundColor] : '',
        backgroundType === 'gradient' ? 'bg-accent-gradient' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      // Same page-top pull-up as the full-bleed image Hero — see
      // HeroBlock's HeroImageOverlay for the full rationale. Total
      // height is the 75vh + 100vh zones below plus the gap between
      // them (--spacing-2xl, the site's standard intro-to-content
      // gap), so neither zone has to give up its own height for it.
      style={{
        height: 'calc(175vh + var(--spacing-2xl))',
        marginTop: 'calc(var(--header-height, 0px) * -1)',
      }}
    >
      {backgroundType === 'image' && (
        <div className="absolute inset-0">
          <Media media={backgroundImage} alt={headline} className="size-full" />
        </div>
      )}
      {backgroundType === 'image' && (
        <div className="absolute inset-0 bg-foreground/55" aria-hidden="true" />
      )}
      <div className="relative mx-auto flex size-full max-w-page flex-col gap-2xl px-medium-large">
        <div className="flex flex-col justify-end" style={{ height: '75vh' }}>
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
        <div className="w-full overflow-hidden rounded-lg" style={{ height: '100vh' }}>
          <Media media={showcaseMedia} alt={headline} className="size-full" />
        </div>
      </div>
    </section>
  )
}
