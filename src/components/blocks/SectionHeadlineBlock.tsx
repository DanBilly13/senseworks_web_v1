import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type SectionHeadlineBlockProps = {
  eyebrow?: string
  headline: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  align?: 'left' | 'center'
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  // H1 only when this block IS the page's title (e.g. a page with no
  // Hero) — every other section heading stays H2, the default.
  headingLevel?: 'h1' | 'h2'
  // 'display' draws the headline at the site's biggest size, whatever
  // its heading level.
  headlineSize?: 'standard' | 'display'
}

export function SectionHeadlineBlock({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  align = 'center',
  spacing = 'loose',
  headingLevel = 'h2',
  headlineSize,
}: SectionHeadlineBlockProps) {
  return (
    <SectionShell py={spacing}>
      <SectionIntro
        as={headingLevel}
        display={headlineSize === 'display'}
        eyebrow={eyebrow}
        heading={headline}
        body={body}
        align={align}
        maxWidth="lg"
        cta={ctaLabel && ctaHref && <Button href={ctaHref}>{ctaLabel}</Button>}
      />
    </SectionShell>
  )
}
