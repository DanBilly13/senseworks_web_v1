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
}

export function HeroTextBlock({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  boundary = true,
}: HeroTextBlockProps) {
  return (
    <SectionShell py={boundary ? 'section-edge' : 'loose'} pad={boundary ? 'both' : 'bottom'}>
      <SectionIntro
        as="h1"
        eyebrow={eyebrow}
        heading={headline}
        body={subhead}
        maxWidth="md"
        headingMaxWidth="none"
        cta={
          ctaLabel &&
          ctaHref && (
            <Button href={ctaHref}>{ctaLabel}</Button>
          )
        }
      />
    </SectionShell>
  )
}
