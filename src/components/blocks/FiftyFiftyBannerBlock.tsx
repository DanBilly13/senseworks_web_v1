import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type FiftyFiftyBannerBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  imagePosition?: 'left' | 'right'
  media?: MediaField
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

export function FiftyFiftyBannerBlock({
  eyebrow,
  heading,
  body,
  ctaLabel,
  ctaHref,
  imagePosition = 'right',
  media,
  spacing = 'loose',
}: FiftyFiftyBannerBlockProps) {
  // Text renders first in the DOM either way (keeps reading order/
  // accessibility sane regardless of visual position) — 'left'
  // reorders visually via md:order-*, standard Tailwind utilities,
  // rather than duplicating this markup per position.
  const imageFirst = imagePosition === 'left'

  return (
    // px="boxed" (8px mobile / 24px desktop) — same single-boxed-panel
    // rhythm as Dark Banner/Feature Split Dark.
    <SectionShell px="boxed" py={spacing}>
      {/* Fixed height, not aspect-ratio, on desktop — sized to the
          700x500 reference asset (see --height-banner-5050) so an
          image at that resolution fills its half with no
          cropping/scaling surprise. overflow-hidden clips the image
          to the panel's own rounded corners; the text half doesn't
          need its own rounding since it's the same fill as the panel
          behind it. Mobile drops the fixed height (doesn't make sense
          once stacked) for a plain grid-cols-1 stack instead. */}
      <div className="overflow-hidden rounded-lg bg-foreground md:h-banner-5050">
        <div className="grid grid-cols-1 md:h-full md:grid-cols-2">
          <div
            className={[
              'flex flex-col justify-center gap-medium p-medium-large md:p-2xl',
              imageFirst ? 'md:order-2' : '',
            ].join(' ')}
          >
            <SectionIntro
              as="h3"
              eyebrow={eyebrow}
              heading={heading}
              body={body}
              tone="inverse"
              eyebrowColor="text-accent"
              cta={
                ctaLabel &&
                ctaHref && (
                  <Button href={ctaHref} variant="filled-accent">
                    {ctaLabel}
                  </Button>
                )
              }
            />
          </div>
          {/* aspect-media (7:5) on mobile once stacked; the fixed
              md:h-full on the parent takes over at desktop instead. */}
          <div className={['relative aspect-media md:aspect-auto', imageFirst ? 'md:order-1' : ''].join(' ')}>
            <Media media={media} alt={heading} className="absolute inset-0 size-full" />
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
