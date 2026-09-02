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
    <section className="flex flex-col gap-medium px-medium-large py-3xl">
      {eyebrow && (
        <p className="text-caption font-semibold text-muted-foreground uppercase">{eyebrow}</p>
      )}
      <h1 className="max-w-2xl text-h1 font-semibold text-foreground">{headline}</h1>
      {subhead && <p className="max-w-xl text-body-lg text-muted-foreground">{subhead}</p>}
      {ctaLabel && ctaHref && (
        <div>
          <Button href={ctaHref}>{ctaLabel}</Button>
        </div>
      )}
      {/* FR-003: grey placeholder container, no real asset required */}
      <div
        className="mt-medium-large h-80 w-full rounded-lg bg-muted"
        role="img"
        aria-label="Placeholder image"
      />
    </section>
  )
}
