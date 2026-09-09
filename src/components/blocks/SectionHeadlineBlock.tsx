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
}

export function SectionHeadlineBlock({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  align = 'center',
}: SectionHeadlineBlockProps) {
  return (
    <SectionShell>
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
