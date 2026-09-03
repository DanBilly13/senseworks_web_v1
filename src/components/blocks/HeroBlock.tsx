import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'

type HeroBlockProps = {
  eyebrow?: string
  headline: string
  subhead?: string
  ctaLabel?: string
  ctaHref?: string
}

export function HeroBlock({ eyebrow, headline, subhead, ctaLabel, ctaHref }: HeroBlockProps) {
  return (
    <SectionShell className="flex flex-col gap-2xl">
      <SectionIntro
        as="h1"
        eyebrow={eyebrow}
        heading={headline}
        body={subhead}
        maxWidth="md"
        cta={ctaLabel && ctaHref && <Button href={ctaHref}>{ctaLabel}</Button>}
      />
      {/* FR-003: grey placeholder container, no real asset required.
          D15: contained within the page-width cap, not full-bleed.
          aspect-media (7:5) instead of a fixed height so it scales
          correctly with the column's actual rendered width. */}
      <div
        className="aspect-media w-full rounded-lg bg-muted"
        role="img"
        aria-label="Placeholder image"
      />
    </SectionShell>
  )
}
