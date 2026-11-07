import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { hasMedia, type MediaField } from '@/lib/sanity/media'
import { gapMbClass, itemsClass, phoneDisplay, phoneOr, ResponsiveMedia } from '@/components/ui/phone'

type BackgroundType = 'none' | 'image' | 'color' | 'gradient'
type BackgroundColor = 'dark' | 'accent' | 'light'
type Gap = 'loose' | 'medium' | 'tight' | 'none'

type HeroBackdropTextBlockProps = {
  backgroundType?: BackgroundType
  backgroundImage?: MediaField
  backgroundColor?: BackgroundColor
  textTone?: 'light' | 'dark'
  eyebrow?: string
  headline: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  ctaNote?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
  spacing?: Gap
  headlineSize?: 'h1' | 'display'
  typingHeadline?: boolean
  // The Mobile tab: phone versions, 'inherit' (or unset) = same as desktop.
  mobileHeadlineSize?: 'inherit' | 'h1' | 'display'
  mobileAlign?: 'inherit' | 'left' | 'center'
  mobileBackgroundImage?: MediaField
  mobileSpacing?: 'inherit' | Gap
}

const BACKGROUND_COLOR_CLASS: Record<BackgroundColor, string> = {
  dark: 'bg-foreground',
  accent: 'bg-accent',
  light: 'bg-surface',
}

// The space above the eyebrow (below the floating header) and below the
// last line of text: the same, twice the page-edge space less the
// header's height, and never less than the page-edge space.
const EDGE_SPACE = 'max(var(--spacing-section-edge), calc(var(--spacing-section-edge) * 2 - var(--header-height, 0px)))'

// Hero — Backdrop's look (the same backdrop, text, button, link and note)
// without its showcase media: just the text on the backdrop.
export function HeroBackdropTextBlock({
  backgroundType = 'image',
  backgroundImage,
  backgroundColor = 'dark',
  textTone = 'light',
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  ctaNote,
  secondaryCtaLabel,
  secondaryCtaHref,
  spacing = 'medium',
  headlineSize,
  typingHeadline = false,
  mobileHeadlineSize,
  mobileAlign,
  mobileBackgroundImage,
  mobileSpacing,
}: HeroBackdropTextBlockProps) {
  const light = textTone === 'light'
  const phoneAlign = phoneOr(mobileAlign, 'left')
  // An image background with nothing in it draws nothing.
  const hasBackgroundImage = backgroundType === 'image' && hasMedia(backgroundImage)

  return (
    <section
      className={[
        'relative',
        gapMbClass(spacing, phoneOr(mobileSpacing, spacing)),
        backgroundType === 'color' ? BACKGROUND_COLOR_CLASS[backgroundColor] : '',
        backgroundType === 'gradient' ? 'bg-accent-gradient' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      // Pulled up under the floating header, like Hero — Backdrop, so the
      // backdrop runs to the top of the screen.
      style={{ marginTop: 'calc(var(--header-height, 0px) * -1)' }}
    >
      {hasBackgroundImage && (
        <>
          <div className="absolute inset-0">
            <ResponsiveMedia media={backgroundImage} phone={mobileBackgroundImage} alt={headline} className="size-full" />
          </div>
          <div className="absolute inset-0 bg-foreground/55" aria-hidden="true" />
        </>
      )}
      <div
        className="relative mx-auto w-full max-w-page px-medium-large md:px-gutter"
        style={{ paddingTop: `calc(var(--header-height, 0px) + ${EDGE_SPACE})`, paddingBottom: EDGE_SPACE }}
      >
        <SectionIntro
          as="h1"
          display={headlineSize === 'display'}
          phoneDisplay={phoneDisplay(mobileHeadlineSize, headlineSize === 'display')}
          phoneAlign={phoneAlign}
          typing={typingHeadline}
          typingCursorClassName={light ? 'text-accent' : undefined}
          eyebrow={eyebrow}
          heading={headline}
          body={body}
          maxWidth="md"
          headingMaxWidth="heroHeadline"
          tone={light ? 'inverse' : 'default'}
          cta={
            ctaLabel &&
            ctaHref && (
              <div className={`flex flex-col gap-small-medium ${itemsClass('left', phoneAlign)}`}>
                <div className={`flex flex-wrap items-center gap-medium-large ${phoneAlign === 'center' ? 'justify-center md:justify-start' : ''}`}>
                  <Button href={ctaHref} variant={light ? 'filled-accent' : 'filled-dark'}>
                    {ctaLabel}
                  </Button>
                  {secondaryCtaLabel && secondaryCtaHref && (
                    <a
                      href={secondaryCtaHref}
                      className={`text-body-sm font-medium underline underline-offset-4 ${light ? 'text-background' : 'text-foreground'}`}
                    >
                      {secondaryCtaLabel}
                    </a>
                  )}
                </div>
                {ctaNote && <p className={`text-body-sm ${light ? 'text-background/70' : 'text-muted-foreground'}`}>{ctaNote}</p>}
              </div>
            )
          }
        />
      </div>
    </section>
  )
}
