import { Button } from '@/components/ui/Button'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Ally3D } from '@/components/ally3d/Ally3D'
import { BAND_BG } from '@/components/ui/BandFill'

type HeroAllyBlockProps = {
  eyebrow?: string
  headline: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  ctaNote?: string
  headlineSize?: 'h1' | 'display'
  typingHeadline?: boolean
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  tone?: 'none' | 'light' | 'dark' | 'accent' | 'accentGradient' | 'accentDark'
  align?: 'left' | 'center'
}

// The background, behind the whole hero. Unset is the accent gradient
// she was designed on; None is the page background.
const SECTION_BG: Record<NonNullable<HeroAllyBlockProps['tone']>, string> = {
  none: '',
  light: 'bg-muted',
  ...BAND_BG,
}

// The gaps between eyebrow, headline, subtext and button: from tablet up,
// half the site's usual (which is half the headline's line height), so
// the text sits tighter and leaves Ally more of the screen; phones keep
// the usual (Dan's calls). --hero-ally-gap-divisor is in globals.css.
const textGap = (display: boolean) =>
  `calc(var(--text-${display ? 'display' : 'h1'}--full-line-height) / var(--hero-ally-gap-divisor))`

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
  body,
  ctaLabel,
  ctaHref,
  ctaNote,
  headlineSize,
  typingHeadline = false,
  spacing = 'medium',
  tone = 'accentGradient',
  align = 'left',
}: HeroAllyBlockProps) {
  // On Dark and the dark gradient: white text, the button in the accent.
  const dark = tone === 'dark' || tone === 'accentDark'
  const center = align === 'center'
  return (
    <section
      className={`hero-ally-section relative flex min-h-svh flex-col overflow-hidden ${SECTION_BG[tone]} ${SECTION_GAP_MB_CLASS[spacing]}`}
      // Pulled up under the fixed header, like the other heroes (see
      // HeroBackdropBlock), so the gradient runs to the top of the screen.
      style={{ marginTop: 'calc(var(--header-height, 0px) * -1)' }}
    >
      {/* Above the eyebrow: the header's height plus a gap that grows with
          the screen's height but stops at 80px, so a big screen doesn't
          open a big empty band (.hero-ally-text in globals.css). On top of
          Ally, who rises up beside the button from tablet up. */}
      <div className="hero-ally-text relative z-10 mx-auto w-full max-w-page px-medium-large pb-large md:px-gutter md:pb-none">
        <SectionIntro
          as="h1"
          display={headlineSize === 'display'}
          typing={typingHeadline}
          typingCursorClassName={dark ? 'text-accent' : undefined}
          tone={dark ? 'inverse' : 'default'}
          align={align}
          eyebrow={eyebrow}
          heading={headline}
          body={body}
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
              <div className={`flex flex-col gap-small-medium ${center ? 'items-center' : 'items-start'}`}>
                <Button href={ctaHref} variant={dark ? 'filled-accent' : 'filled-dark'}>
                  {ctaLabel}
                </Button>
                {ctaNote && <p className={`text-body-sm ${dark ? 'text-background/80' : 'text-muted-foreground'}`}>{ctaNote}</p>}
              </div>
            )
          }
        />
      </div>
      <div className="hero-ally-stage relative flex-1">
        <Ally3D className="hero-ally pointer-events-none absolute left-1/2" />
      </div>
    </section>
  )
}
