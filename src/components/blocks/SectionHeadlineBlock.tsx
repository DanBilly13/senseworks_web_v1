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
  spacing?: 'loose' | 'medium' | 'tight'
}

export function SectionHeadlineBlock({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  align = 'center',
  spacing = 'loose',
}: SectionHeadlineBlockProps) {
  return (
    <SectionShell py={spacing}>
      <SectionIntro
        as="h2"
        eyebrow={eyebrow}
        heading={headline}
        body={body}
        align={align}
        maxWidth="md"
        cta={ctaLabel && ctaHref && <Button href={ctaHref}>{ctaLabel}</Button>}
      />
    </SectionShell>
  )
}
