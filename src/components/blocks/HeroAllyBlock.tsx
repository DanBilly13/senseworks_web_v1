import { Button } from '@/components/ui/Button'
import { SectionIntro, headlineLineHeight } from '@/components/ui/SectionIntro'
import { gapMbClass, itemsClass, phoneDisplay, phoneOr } from '@/components/ui/phone'
import { Ally3D } from '@/components/ally3d/Ally3D'
import { BAND_BG } from '@/components/ui/BandFill'
import { StickToBottom } from '@/components/ui/StickToBottom'

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
  // Stays put while the rest of the page scrolls up over it (the
  // wrapper is BlockRenderer's, which also takes over the gap below).
  pinned?: boolean
  // The Mobile tab: phone versions, 'inherit' (or unset) = same as desktop.
  mobileHeadlineSize?: 'inherit' | 'h1' | 'display'
  mobileAlign?: 'inherit' | 'left' | 'center'
  // Phones: Ally under the text, or no Ally (the hero as tall as its text).
  mobileAlly?: 'show' | 'hide'
  mobileSpacing?: 'inherit' | 'loose' | 'medium' | 'tight' | 'none'
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
const textGap = (display: boolean) => `calc(${headlineLineHeight(display)} / var(--hero-ally-gap-divisor))`

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
  pinned = false,
  mobileHeadlineSize,
  mobileAlign,
  mobileAlly = 'show',
  mobileSpacing,
}: HeroAllyBlockProps) {
  // On Dark and the dark gradient: white text, the button in the accent.
  const dark = tone === 'dark' || tone === 'accentDark'
  const phoneAlign = phoneOr(mobileAlign, align)
  const display = headlineSize === 'display'
  const noAlly = mobileAlly === 'hide'
  return (
    <section
      className={`hero-ally-section flex flex-col overflow-hidden ${noAlly ? 'md:min-h-svh' : 'min-h-svh'} ${SECTION_BG[tone]} ${pinned ? 'relative md:sticky md:top-0' : `relative ${gapMbClass(spacing, phoneOr(mobileSpacing, spacing))}`}`}
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
          display={display}
          phoneDisplay={phoneDisplay(mobileHeadlineSize, display)}
          typing={typingHeadline}
          typingCursorClassName={dark ? 'text-accent' : undefined}
          tone={dark ? 'inverse' : 'default'}
          align={align}
          phoneAlign={phoneAlign}
          eyebrow={eyebrow}
          heading={headline}
          body={body}
          maxWidth="md"
          // The headline runs the full row (no 85% cap like the other
          // heroes), so it takes fewer lines and leaves Ally more room.
          headingMaxWidth="none"
          headingGap={textGap(display)}
          bodyGap={textGap(display)}
          ctaGap={textGap(display)}
          cta={
            ctaLabel &&
            ctaHref && (
              <div className={`flex flex-col gap-small-medium ${itemsClass(align, phoneAlign)}`}>
                <Button href={ctaHref} variant={dark ? 'filled-accent' : 'filled-dark'}>
                  {ctaLabel}
                </Button>
                {ctaNote && <p className={`text-body-sm ${dark ? 'text-background/80' : 'text-muted-foreground'}`}>{ctaNote}</p>}
              </div>
            )
          }
        />
      </div>
      {pinned && <StickToBottom />}
      <div className={`hero-ally-stage relative flex-1 ${noAlly ? 'max-md:hidden' : ''}`}>
        <Ally3D className="hero-ally pointer-events-none absolute left-1/2" />
      </div>
    </section>
  )
}
