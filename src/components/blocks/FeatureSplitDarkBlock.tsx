import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

type FeatureSplitDarkBlockProps = {
  heading?: string
  subhead?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  imagePosition?: 'left' | 'right'
  media?: MediaField
}

export function FeatureSplitDarkBlock({
  heading,
  subhead,
  body,
  ctaLabel,
  ctaHref,
  imagePosition = 'right',
  media,
}: FeatureSplitDarkBlockProps) {
  const panelClassName = [
    'flex w-full flex-col gap-large rounded-lg bg-foreground p-2xl md:items-center md:gap-2xl',
    imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse',
  ].join(' ')

  return (
    <SectionShell>
      <div className={panelClassName}>
        <div className="w-full md:max-w-prose-xs md:shrink-0">
          <div className="flex flex-col gap-medium">
            {heading && (
              <h3 className="text-h3 font-semibold text-balance text-background">{heading}</h3>
            )}
            {subhead && <p className="text-body-lg font-medium text-background">{subhead}</p>}
            {body && <p className="text-body text-background/70">{body}</p>}
          </div>
          {ctaLabel && ctaHref && (
            <div className={subhead || body ? 'mt-medium' : 'mt-medium-large'}>
              <Button href={ctaHref} variant="filled-light">
                {ctaLabel}
              </Button>
            </div>
          )}
        </div>
        <Media
          media={media}
          alt={heading ?? ''}
          className="aspect-media w-full rounded-md md:flex-1"
          fit="contain"
        />
      </div>
    </SectionShell>
  )
}
