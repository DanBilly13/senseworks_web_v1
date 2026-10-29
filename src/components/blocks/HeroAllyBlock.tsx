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

const SECTION_GAP_MB_CLASS: Record<NonNullable<HeroAllyBlockProps['spacing']>, string> = {
  loose: 'mb-section-gap-loose',
  medium: 'mb-section-gap-medium',
  tight: 'mb-section-gap-tight',
  none: 'mb-none',
}

// Experimental: a hero exactly one screen tall on the accent gradient,
// with the 3D Ally (components/ally3d) rising from the bottom edge
// behind the text — big, and cropped hard by the bottom of the hero —
// her head following the cursor. Her size and crop are .hero-ally in
// globals.css.
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
      className={`hero-ally-section relative h-svh overflow-hidden bg-accent-gradient ${SECTION_GAP_MB_CLASS[spacing]}`}
      // Pulled up under the fixed header, like the other heroes (see
      // HeroBackdropBlock), so the gradient runs to the top of the screen.
      style={{ marginTop: 'calc(var(--header-height, 0px) * -1)' }}
    >
      <Ally3D className="hero-ally pointer-events-none absolute left-1/2 -translate-x-1/2" />
      <div
        className="relative mx-auto w-full max-w-page px-medium-large md:px-gutter"
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
          headingMaxWidth="heroHeadline"
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
    </section>
  )
}
