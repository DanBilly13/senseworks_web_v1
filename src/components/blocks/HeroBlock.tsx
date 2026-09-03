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
      <div className="flex flex-col gap-large md:flex-row md:items-start md:justify-between md:gap-2xl">
        <div className="md:max-w-prose-md md:flex-1">
          <SectionIntro as="h1" eyebrow={eyebrow} heading={headline} />
        </div>
        {(subhead || (ctaLabel && ctaHref)) && (
          <div className="flex flex-col gap-medium md:max-w-prose-xs md:shrink-0">
            {/* Reserves the same height as the eyebrow in the left
                column (same text/gap, just unpainted) so the body text
                below it lines up with the h1's top, not the eyebrow's —
                the two columns don't share a heading level to align
                against otherwise. Only needed once the columns actually
                sit side by side (md:) — on the stacked mobile layout
                it would just add a blank gap above the subtext. */}
            {eyebrow && (
              <p
                className="hidden text-caption font-semibold uppercase md:invisible md:block"
                aria-hidden="true"
              >
                {eyebrow}
              </p>
            )}
            {subhead && <p className="text-body-lg text-muted-foreground">{subhead}</p>}
            {ctaLabel && ctaHref && (
              <div>
                <Button href={ctaHref}>{ctaLabel}</Button>
              </div>
            )}
          </div>
        )}
      </div>
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
