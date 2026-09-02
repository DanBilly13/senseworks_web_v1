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
        {/* FR-003: grey placeholder container, no real asset required */}
        <div
          className="h-80 w-full rounded-lg bg-muted md:w-1/2"
          role="img"
          aria-label="Placeholder image"
        />
        <div className="flex w-full flex-col gap-small-medium md:w-1/2">
          {eyebrow && (
            <p className="text-caption font-semibold text-muted-foreground uppercase">
              {eyebrow}
            </p>
          )}
          <h2 className="max-w-prose-md text-h2 font-semibold text-foreground">{heading}</h2>
          {body && <p className="max-w-prose-sm text-body text-muted-foreground">{body}</p>}
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
