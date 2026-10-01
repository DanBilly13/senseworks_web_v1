import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro, HALF_HEADING_LINE_HEIGHT_GAP } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import { renderNumberedEyebrow } from '@/components/ui/numberedEyebrow'
import { urlFor } from '@/lib/sanity/image'
import type { MediaField } from '@/lib/sanity/media'

type ButtonVariant = 'filled-dark' | 'filled-accent' | 'filled-light' | 'ghost'
type FullWidthSingleBlockTone = 'default' | 'inverse' | 'accent'
type SpacingValue = 'loose' | 'medium' | 'tight' | 'none'
type FullWidthSingleBlockProps = {
  eyebrow?: string
  // Highlights the eyebrow's leading word (e.g. "01") as a small
  // colored badge instead of plain text — same treatment as Card
  // Grid's numbered eyebrow.
  numberedEyebrow?: boolean
  heading?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  tone?: FullWidthSingleBlockTone
  align?: 'left' | 'center'
  // Overrides the button's color — leave unset to keep the same auto
  // behavior CTA Banner uses (filled-light on the inverse/dark tone,
  // filled-dark on every other tone, since filled-dark would be
  // invisible there).
  buttonVariant?: ButtonVariant
  media?: MediaField
  // Independent top/bottom internal padding — same four tiers/values
  // as the shared Section spacing field, just settable per edge since
  // this panel has no neighboring section to supply the other half.
  paddingTop?: SpacingValue
  paddingBottom?: SpacingValue
  // The gap AFTER the colored panel, before the next block — distinct
  // from paddingBottom above, which is INSIDE the panel. Every other
  // block's "Section spacing" governs the space outside its own
  // content; this block needs that too, on top of (not instead of)
  // its own internal padding, since the panel's tone fill makes the
  // two visually very different things (inside the color vs. the page
  // background showing again after it).
  spacing?: SpacingValue
}

// Same three tones as CTA Banner, same reasoning.
const SECTION_BG: Record<FullWidthSingleBlockTone, string> = {
  default: 'bg-muted',
  inverse: 'bg-foreground',
  accent: 'bg-accent',
}

// Margin equivalents of SectionShell's own SECTION_GAP_PB_CLASS — same
// four values, applied to the outer tone-filled div's bottom margin
// instead of SectionShell's inner padding (which this block already
// uses for paddingTop/paddingBottom).
const SECTION_GAP_MB_CLASS: Record<SpacingValue, string> = {
  loose: 'mb-section-gap-loose',
  medium: 'mb-section-gap-medium',
  tight: 'mb-section-gap-tight',
  none: 'mb-none',
}

// Like CTA Banner, but the background is the only thing that's full
// screen width — the text AND the image both stay within the normal
// page content width, stacked (image below the text), not a 50/50
// split like Feature Split/Dark Banner.
export function FullWidthSingleBlock({
  eyebrow,
  numberedEyebrow = false,
  heading,
  body,
  ctaLabel,
  ctaHref,
  tone = 'default',
  align = 'center',
  buttonVariant,
  media,
  paddingTop = 'loose',
  paddingBottom = 'loose',
  spacing = 'loose',
}: FullWidthSingleBlockProps) {
  const resolvedButtonVariant = buttonVariant ?? (tone === 'inverse' ? 'filled-light' : 'filled-dark')
  // Body renders outside SectionIntro (see below) rather than through
  // its own body prop — neither of SectionIntro's two built-in body
  // treatments (the h1/h2 "subtitle" size, or h3/h4's body-lg) lands
  // on the plain 16px Body size this block wants.
  const bodyColor = tone === 'inverse' ? 'text-background/80' : 'text-muted-foreground'
  const hasImage = media?.mediaType === 'image' && !!media.image
  // Media is optional — no placeholder/gradient box when nothing's
  // uploaded, unlike most other blocks' media slots. Mirrors Media's
  // own internal hasAsset check rather than just `!!media`, since a
  // media object can exist with its type set but no asset attached yet.
  const hasAsset =
    hasImage ||
    (media?.mediaType === 'video' && !!media.videoUrl) ||
    (media?.mediaType === 'lottie' && !!media.lottieUrl) ||
    (media?.mediaType === 'reactAnimation' && !!media.animation)

  return (
    <div className={`${SECTION_BG[tone]} ${SECTION_GAP_MB_CLASS[spacing]}`}>
      {/* pt/pb independently, not py/pad="both" — this section has no
          neighboring section to supply the other half of a gap (its
          own tone fill IS the section, same reasoning as CTA Banner/
          Dark Banner's own pad="both"), but unlike those, each edge is
          its own editor choice here. */}
      <SectionShell pt={paddingTop} pb={paddingBottom} className="flex flex-col gap-2xl">
        {/* gap-medium is the container's own base gap SectionIntro's
            formula is built on top of (see HALF_HEADING_LINE_HEIGHT_GAP's
            own comment) — the body/button marginTop below adds the
            remainder needed to reach exactly half the heading's line-
            height, same as eyebrow-to-heading already gets inside
            SectionIntro itself. */}
        <div className={`flex flex-col gap-medium ${align === 'center' ? 'items-center text-center' : ''}`}>
          <SectionIntro
            as="h2"
            eyebrow={eyebrow && renderNumberedEyebrow(eyebrow, numberedEyebrow, tone === 'inverse')}
            // Numbered eyebrows go full-strength instead of the usual
            // muted/70% — next to a bold number badge, the faded
            // default read washed out (same call Card Grid made).
            eyebrowColor={
              numberedEyebrow ? (tone === 'inverse' ? 'text-background' : 'text-foreground') : undefined
            }
            heading={heading}
            align={align}
            // "8 columns" — same prose-lg token the FAQ block's question/
            // answer column uses for the same "8 columns" mental model,
            // reused here rather than inventing a new one-off width.
            maxWidth="lg"
            tone={tone === 'inverse' ? 'inverse' : 'default'}
          />
          {body && (
            <p
              className={`max-w-prose-lg text-body ${bodyColor}`}
              style={heading ? { marginTop: HALF_HEADING_LINE_HEIGHT_GAP.h2 } : undefined}
            >
              {body}
            </p>
          )}
          {ctaLabel && ctaHref && (
            // Button has no style prop of its own (unlike the p above) —
            // wrapped in a plain div for the marginTop, same as
            // SectionIntro's own cta slot does internally.
            <div style={body ? { marginTop: HALF_HEADING_LINE_HEIGHT_GAP.h2 } : undefined}>
              <Button href={ctaHref} variant={resolvedButtonVariant}>
                {ctaLabel}
              </Button>
            </div>
          )}
        </div>
        {hasAsset &&
          (hasImage ? (
            // Bypasses Media here — it has no hook for either effect
            // below (object-position at full scale, or a mask), both
            // of which only make sense for a real image anyway (video/
            // lottie fall back to Media underneath). 7:5 on mobile,
            // wider/shorter on desktop (2:1), cropping more off the
            // BOTTOM there (object-top) rather than evenly off both
            // sides — paired with a bottom fade (desktop only,
            // --media-fade-bottom is 'none' below md:) using the exact
            // same multi-stop curve as Card Grid's own image-fade
            // feature, just one direction and capped at 10% opacity
            // instead of fully transparent, so the panel's own
            // background shows through gradually rather than the image
            // just stopping dead at a hard edge. Bottom corners drop
            // their rounding at desktop too — a rounded corner reads
            // as a deliberate edge, which the fade is specifically
            // trying not to look like.
            <div className="relative aspect-media w-full overflow-hidden rounded-lg md:aspect-media-wide md:rounded-t-lg md:rounded-b-none">
              <Image
                src={urlFor(media.image!).url()}
                alt={media?.alt || heading || ''}
                fill
                sizes="100vw"
                className="object-cover object-center md:object-top"
                style={{ maskImage: 'var(--media-fade-bottom)', WebkitMaskImage: 'var(--media-fade-bottom)' }}
              />
            </div>
          ) : (
            <Media media={media} alt={heading ?? ''} className="aspect-media w-full rounded-lg" />
          ))}
      </SectionShell>
    </div>
  )
}
