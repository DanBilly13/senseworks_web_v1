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
  // How big the headline is drawn, named after the type styles. Purely
  // visual: it's always an h2 on the page, since every page starts
  // with a Hero and the Hero is the page's one h1.
  size?: 'display' | 'h1' | 'h2' | 'h3'
  // Optional id, so a "#anchor" link (e.g. the menu's Pricing link)
  // lands on this headline.
  anchor?: string
}

export function SectionHeadlineBlock({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  align = 'center',
  spacing = 'loose',
  size = 'h2',
  anchor,
}: SectionHeadlineBlockProps) {
  return (
    <SectionShell py={spacing} id={anchor}>
      <SectionIntro
        as="h2"
        // Display draws at the display size; styleAs h1 gives it the
        // h1-size body underneath (the h5 subtitle style).
        styleAs={size === 'display' ? 'h1' : size}
        display={size === 'display'}
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
