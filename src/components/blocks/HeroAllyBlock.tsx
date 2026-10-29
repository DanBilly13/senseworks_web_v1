import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Ally3D } from '@/components/ally3d/Ally3D'

type HeroAllyBlockProps = {
  eyebrow?: string
  headline: string
  subhead?: string
  ctaLabel?: string
  ctaHref?: string
  ctaNote?: string
  headlineSize?: 'h1' | 'display'
  typingHeadline?: boolean
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

// The gaps between eyebrow, headline, subtext and button: half the
// site's usual (which is half the headline's line height), so the text
// sits tighter and leaves Ally more of the screen (Dan's call).
const textGap = (display: boolean) =>
  `calc(var(--text-${display ? 'display' : 'h1'}--full-line-height) / 4)`

const SECTION_GAP_MB_CLASS: Record<NonNullable<HeroAllyBlockProps['spacing']>, string> = {
  loose: 'mb-section-gap-loose',
  medium: 'mb-section-gap-medium',
  tight: 'mb-section-gap-tight',
  none: 'mb-none',
}

// Experimental: a hero at least one screen tall on the accent gradient,
// with the 3D Ally (components/ally3d) rising from the bottom edge below
// the text — big, and cropped hard by the bottom of the hero — her head
// following the cursor. She fills whatever height the text leaves, and
// always gets at least some of it (.hero-ally-stage), so a long headline
// makes the hero taller rather than running into her. Her size and crop
// are in globals.css.
export function HeroAllyBlock({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  ctaNote,
  headlineSize,
  typingHeadline = false,
  spacing = 'medium',
}: HeroAllyBlockProps) {
  return (
    <section
      className={`hero-ally-section relative flex min-h-svh flex-col overflow-hidden bg-accent-gradient ${SECTION_GAP_MB_CLASS[spacing]}`}
      // Pulled up under the fixed header, like the other heroes (see
      // HeroBackdropBlock), so the gradient runs to the top of the screen.
      style={{ marginTop: 'calc(var(--header-height, 0px) * -1)' }}
    >
      <div
        className="relative mx-auto w-full max-w-page px-medium-large pb-2xl md:px-gutter"
        style={{ paddingTop: 'calc(var(--spacing-section-edge) * 2)' }}
      >
        <SectionIntro
          as="h1"
          display={headlineSize === 'display'}
          typing={typingHeadline}
          eyebrow={eyebrow}
          heading={headline}
          body={subhead}
          maxWidth="md"
          // The headline runs the full row (no 85% cap like the other
          // heroes), so it takes fewer lines and leaves Ally more room.
          headingMaxWidth="none"
          headingGap={textGap(headlineSize === 'display')}
          bodyGap={textGap(headlineSize === 'display')}
          ctaGap={textGap(headlineSize === 'display')}
          cta={
            ctaLabel &&
            ctaHref && (
              <div className="flex flex-col items-start gap-small-medium">
                <Button href={ctaHref} variant="filled-dark">
                  {ctaLabel}
                </Button>
                {ctaNote && <p className="text-body-sm text-muted-foreground">{ctaNote}</p>}
              </div>
            )
          }
        />
      </div>
      <div className="hero-ally-stage relative flex-1">
        <Ally3D className="hero-ally pointer-events-none absolute top-0 left-1/2 -translate-x-1/2" />
      </div>
    </section>
  )
}
