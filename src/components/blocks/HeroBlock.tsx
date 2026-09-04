import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type HeroBlockProps = {
  layout?: 'split' | 'imageOverlay'
  eyebrow?: string
  headline: string
  subhead?: string
  ctaLabel?: string
  ctaHref?: string
  media?: MediaField
}

export function HeroBlock({ layout = 'split', ...props }: HeroBlockProps) {
  return layout === 'imageOverlay' ? (
    <HeroImageOverlay {...props} />
  ) : (
    <HeroSplit {...props} />
  )
}

type HeroVariantProps = Omit<HeroBlockProps, 'layout'>

function HeroSplit({ eyebrow, headline, subhead, ctaLabel, ctaHref, media }: HeroVariantProps) {
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
      {/* D15: contained within the page-width cap, not full-bleed.
          aspect-media (7:5) instead of a fixed height so it scales
          correctly with the column's actual rendered width. Media
          itself falls back to a grey box when no asset is set. */}
      <Media media={media} alt={headline} className="aspect-media w-full rounded-lg" />
    </SectionShell>
  )
}

function HeroImageOverlay({
  eyebrow,
  headline,
  subhead,
  ctaLabel,
  ctaHref,
  media,
}: HeroVariantProps) {
  return (
    <section className="relative min-h-screen">
      {/* Full-bleed background (D15 lets section backgrounds go edge to
          edge). This wrapper owns the absolute positioning — Media's
          own root is `relative`, so passing "absolute inset-0" into
          its className would conflict with that. */}
      <div className="absolute inset-0">
        <Media media={media} alt={headline} className="size-full" />
      </div>
      {/* Flat scrim (not a directional gradient) so light text stays
          legible over whatever the eventual image is, regardless of
          where the text sits — it's vertically centered here, not
          pinned to one edge. */}
      <div className="absolute inset-0 bg-foreground/55" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-page flex-col justify-center px-medium-large py-3xl">
        <SectionIntro
          as="h1"
          eyebrow={eyebrow}
          heading={headline}
          body={subhead}
          maxWidth="md"
          tone="inverse"
          cta={
            ctaLabel &&
            ctaHref && (
              <Button href={ctaHref} variant="inverse">
                {ctaLabel}
              </Button>
            )
          }
        />
      </div>
    </section>
  )
}
