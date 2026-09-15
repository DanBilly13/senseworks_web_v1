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
    <section
      className={[
        'relative mb-section-edge min-h-screen',
        backgroundType === 'color' ? BACKGROUND_COLOR_CLASS[backgroundColor] : '',
        backgroundType === 'gradient' ? 'bg-accent-gradient' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      // Same page-top pull-up as the full-bleed image Hero — see
      // HeroBlock's HeroImageOverlay for the full rationale.
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
      <div className="relative mx-auto flex w-full max-w-page flex-col gap-2xl px-medium-large py-section-edge">
        <SectionIntro
          as="h1"
          eyebrow={eyebrow}
          heading={headline}
          body={subhead}
          maxWidth="md"
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
        {/* Experimental starting point, not a settled token yet — 50%
            of the viewport height for the showcase media. Easy to
            dial in once we've seen a few real images in it live. */}
        <div className="w-full overflow-hidden rounded-lg" style={{ height: '50vh' }}>
          <Media media={showcaseMedia} alt={headline} className="size-full" />
        </div>
      </div>
    </section>
  )
}
