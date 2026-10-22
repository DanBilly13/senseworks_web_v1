import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type HeroTextBlockProps = {
  eyebrow?: string
  headline: string
  subhead?: string
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
  // Overrides the space below (empty: the hero's own page-top space).
  spaceBelow?: 'medium' | 'tight'
  // A full-width background in CTA Banner's colours; none by default.
  tone?: 'none' | 'default' | 'inverse' | 'accent'
}

const SECTION_BG: Record<NonNullable<HeroTextBlockProps['tone']>, string> = {
  none: '',
  default: 'bg-muted',
  inverse: 'bg-foreground',
  accent: 'bg-accent',
}

export function HeroTextBlock({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  boundary = true,
  headlineSize,
  spaceBelow,
  tone = 'none',
}: HeroTextBlockProps) {
  const dark = tone === 'inverse'
  return (
    <SectionShell
      py={boundary ? 'section-edge' : 'loose'}
      // With a background, the space below sits inside the coloured band.
      pad={boundary || tone !== 'none' ? 'both' : 'bottom'}
      pb={spaceBelow}
      sectionClassName={SECTION_BG[tone]}
    >
      <SectionIntro
        as="h1"
        display={headlineSize === 'display'}
        // On dark: light text, with the eyebrow and button in the accent.
        tone={dark ? 'inverse' : 'default'}
        eyebrowColor={dark ? 'text-accent' : undefined}
        eyebrow={eyebrow}
        heading={headline}
        body={subhead}
        maxWidth="none"
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
