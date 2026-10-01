import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'

// Same formula as SectionIntro's own gapToLineHeight (heading's full
// line-height, minus the container's base gap-medium) — this block
// hand-rolls its own heading/subhead/body stack instead of going
// through SectionIntro, so it needs its own copy rather than the prop.
const HEADING_LINE_HEIGHT_GAP = 'calc(var(--text-h3--full-line-height) - var(--spacing-medium))'

type FeatureSplitDarkBlockProps = {
  heading?: string
  subhead?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  imagePosition?: 'left' | 'right'
  media?: MediaField
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

export function FeatureSplitDarkBlock({
  heading,
  subhead,
  body,
  ctaLabel,
  ctaHref,
  imagePosition = 'right',
  media,
  spacing = 'loose',
}: FeatureSplitDarkBlockProps) {
  // p-medium-large/md:p-2xl (24/64) — same "boxed panel" mobile rhythm
  // as DarkBannerBlock: paired with SectionShell's px="boxed" (8px)
  // below, the panel's own padding lands its text on the site-wide
  // 32px-from-edge line. Desktop's p-2xl is unchanged.
  const panelClassName = [
    'flex w-full flex-col gap-large rounded-lg bg-foreground p-medium-large md:items-center md:gap-2xl md:p-2xl',
    imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse',
  ].join(' ')

  return (
    <SectionShell px="boxed" py={spacing}>
      <div className={panelClassName}>
        <div className="w-full md:max-w-prose-xs md:shrink-0">
          <div className="flex flex-col gap-medium">
            {heading && <h3 className="text-h3 font-bold text-balance text-background">{heading}</h3>}
            {subhead && (
              <p
                className="text-body-lg font-medium text-background"
                style={heading ? { marginTop: HEADING_LINE_HEIGHT_GAP } : undefined}
              >
                {subhead}
              </p>
            )}
            {body && (
              <p
                className="text-body text-background/70"
                style={heading && !subhead ? { marginTop: HEADING_LINE_HEIGHT_GAP } : undefined}
              >
                {body}
              </p>
            )}
            {ctaLabel && ctaHref && (
              // Same line-height gap as subhead/body above — was a flat
              // mt-medium/mt-medium-large, outside this gap-medium
              // container entirely, so it never matched.
              <div style={subhead || body ? { marginTop: HEADING_LINE_HEIGHT_GAP } : undefined}>
                <Button href={ctaHref} variant="filled-light">
                  {ctaLabel}
                </Button>
              </div>
            )}
          </div>
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
