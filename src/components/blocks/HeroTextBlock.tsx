import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { phoneDisplay, phoneOr } from '@/components/ui/phone'

type HeroTextBlockProps = {
  eyebrow?: string
  headline: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  // False when this block is reused mid-page (e.g. a second "hero-style"
  // moment further down a landing page) rather than as the actual
  // page-top hero — those still want the standard section rhythm, not
  // the page-boundary padding piled on top of the previous section's
  // own bottom padding.
  boundary?: boolean
  // 'display' draws the headline one step above the standard h1.
  headlineSize?: 'h1' | 'display'
  // The headline types itself out on load (ui/TypingText).
  typingHeadline?: boolean
  // Overrides the space below (empty: the hero's own page-top space).
  spaceBelow?: 'medium' | 'tight'
  // A full-width background in CTA Banner's colours; none by default.
  tone?: 'none' | 'light' | 'dark' | 'accent'
  // On Dark: the headline in the accent instead of white.
  headlineColor?: 'default' | 'accent'
  // The Mobile tab: phone versions, 'inherit' (or unset) = same as desktop.
  mobileHeadlineSize?: 'inherit' | 'h1' | 'display'
  mobileAlign?: 'inherit' | 'left' | 'center'
}

const SECTION_BG: Record<NonNullable<HeroTextBlockProps['tone']>, string> = {
  none: '',
  light: 'bg-muted',
  dark: 'bg-foreground',
  accent: 'bg-accent',
}

export function HeroTextBlock({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  boundary = true,
  headlineSize,
  typingHeadline = false,
  spaceBelow,
  tone = 'none',
  headlineColor,
  mobileHeadlineSize,
  mobileAlign,
}: HeroTextBlockProps) {
  const dark = tone === 'dark'
  const accentHeadline = dark && headlineColor === 'accent'
  return (
    <SectionShell
      py={boundary ? 'section-edge' : 'loose'}
      // With a background, the space below sits inside the coloured band.
      pad={boundary || tone !== 'none' ? 'both' : 'bottom'}
      pb={spaceBelow}
      // ...and the gap to the next block sits outside it, or that block
      // starts flush against the colour.
      sectionClassName={tone !== 'none' ? `${SECTION_BG[tone]} mb-section-edge` : undefined}
    >
      <SectionIntro
        as="h1"
        display={headlineSize === 'display'}
        phoneDisplay={phoneDisplay(mobileHeadlineSize, headlineSize === 'display')}
        phoneAlign={phoneOr(mobileAlign, 'left')}
        typing={typingHeadline}
        typingCursorClassName={dark ? 'text-accent' : undefined}
        // On dark: light text, with the eyebrow and button in the accent.
        tone={dark ? 'inverse' : 'default'}
        eyebrowColor={dark ? 'text-accent' : undefined}
        headingColor={accentHeadline ? 'text-accent' : undefined}
        subtitleColor={accentHeadline ? 'text-background' : undefined}
        eyebrow={eyebrow}
        heading={headline}
        body={body}
        maxWidth="none"
        // Desktop: the headline 80% of the row, the subhead 60% (as on
        // Section Headline and Horizontal Scroll Stack Medium).
        headingMaxWidth="fourFifths"
        bodyMaxWidth="threeFifths"
        cta={
          ctaLabel &&
          ctaHref && (
            <Button href={ctaHref} variant={dark ? 'filled-accent' : 'filled-dark'}>
              {ctaLabel}
            </Button>
          )
        }
      />
    </SectionShell>
  )
}
