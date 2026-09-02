import { Button } from '@/components/ui/Button'

type FeatureSplitBlockProps = {
  eyebrow?: string
  heading: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  imagePosition?: 'left' | 'right'
}

export function FeatureSplitBlock({
  eyebrow,
  heading,
  body,
  ctaLabel,
  ctaHref,
  imagePosition = 'left',
}: FeatureSplitBlockProps) {
  const rowClassName = [
    'mx-auto flex w-full max-w-page flex-col gap-large px-medium-large md:items-center md:gap-2xl',
    imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row',
  ].join(' ')

  return (
    <section className="py-3xl">
      <div className={rowClassName}>
        {/* FR-003: grey placeholder container, no real asset required.
            Fills remaining space (not a 50/50 split) — matches the
            agreed Figma, where the text column is a fixed 460px and
            the image takes whatever's left, verified against the
            actual Figma node rather than approximated. */}
        <div
          className="aspect-media w-full rounded-lg bg-muted md:flex-1"
          role="img"
          aria-label="Placeholder image"
        />
        <div className="flex w-full flex-col gap-small-medium md:max-w-prose-xs md:shrink-0">
          {eyebrow && (
            <p className="text-caption font-semibold text-muted-foreground uppercase">
              {eyebrow}
            </p>
          )}
          <h2 className="text-h2 font-semibold text-foreground">{heading}</h2>
          {body && <p className="text-body text-muted-foreground">{body}</p>}
          {ctaLabel && ctaHref && (
            <div>
              <Button href={ctaHref} variant="secondary">
                {ctaLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
