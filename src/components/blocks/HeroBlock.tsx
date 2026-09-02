import { Button } from '@/components/ui/Button'

type HeroBlockProps = {
  eyebrow?: string
  headline: string
  subhead?: string
  ctaLabel?: string
  ctaHref?: string
}

export function HeroBlock({ eyebrow, headline, subhead, ctaLabel, ctaHref }: HeroBlockProps) {
  return (
    <section className="py-3xl">
      <div className="mx-auto flex w-full max-w-page flex-col gap-medium px-medium-large">
        {eyebrow && (
          <p className="text-caption font-semibold text-muted-foreground uppercase">{eyebrow}</p>
        )}
        <h1 className="max-w-prose-md text-h1 font-semibold text-foreground">{headline}</h1>
        {subhead && (
          <p className="max-w-prose-sm text-body-lg text-muted-foreground">{subhead}</p>
        )}
        {ctaLabel && ctaHref && (
          <div>
            <Button href={ctaHref}>{ctaLabel}</Button>
          </div>
        )}
        {/* FR-003: grey placeholder container, no real asset required.
            D15: contained within the page-width cap, not full-bleed.
            aspect-media (7:5) instead of a fixed height so it scales
            correctly with the column's actual rendered width. */}
        <div
          className="mt-medium-large aspect-media w-full rounded-lg bg-muted"
          role="img"
          aria-label="Placeholder image"
        />
      </div>
    </section>
  )
}
