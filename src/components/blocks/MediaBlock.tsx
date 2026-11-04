import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { SECTION_GAP_PB_CLASS, SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import type { MediaField } from '@/lib/sanity/media'
import { BandFill, bandShellPadding, type BandTone, type BandSpacing } from '@/components/ui/BandFill'
import { StickToBottom } from '@/components/ui/StickToBottom'

type MediaBlockProps = {
  media?: MediaField
  eyebrow?: string
  headline?: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
  align?: 'left' | 'center'
  // 'full': edge to edge at every screen size, square corners, and the
  // same height as a CTA Banner with a background image (75vh, image
  // cropped to fill) so the two match when used near each other.
  width?: 'content' | 'full'
  // The content-width frame's shape on desktop: 7:5 (the original), 7:4
  // (the Hero image's) or a wide 3:1 strip. Mobile keeps its tall
  // full-bleed frame whichever.
  ratio?: '7:5' | '7:4' | '3:1'
  // The gap below the block, before the next one.
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
  // Content width only: a full screen width background behind the
  // media, with its Top/Bottom padding (see ui/BandFill).
  tone?: BandTone
  paddingTop?: BandSpacing
  paddingBottom?: BandSpacing
  // Stays put while the rest of the page scrolls up over it (the
  // wrapper is BlockRenderer's, which also takes over the gap below).
  pinned?: boolean
}

const RATIO_CLASS: Record<NonNullable<MediaBlockProps['ratio']>, string> = {
  '7:5': 'md:aspect-media',
  '7:4': 'md:aspect-hero',
  '3:1': 'md:aspect-banner',
}

function MediaBlockContent({
  media,
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  align = 'left',
  width = 'content',
  ratio = '7:5',
  spacing = 'loose',
  tone = 'none',
  paddingTop,
  paddingBottom,
}: MediaBlockProps) {
  // The background wraps the content-width layouts below; without one,
  // they're as they always were.
  const banded = (shell: (py: { pt?: BandSpacing; pb: BandSpacing }) => ReactNode) =>
    tone === 'none' ? shell({ pb: spacing }) : (
      <BandFill tone={tone} spacing={spacing}>
        {shell(bandShellPadding({ tone, paddingTop, paddingBottom }))}
      </BandFill>
    )
  const hasOverlay = Boolean(eyebrow || headline || body || (ctaLabel && ctaHref))

  if (width === 'full') {
    // Same bottom gap as SectionShell, but no width cap or side padding
    // — the media is the full width of the screen.
    return (
      <section className={SECTION_GAP_PB_CLASS[spacing]}>
        <div className="relative h-cta-banner-image w-full overflow-hidden">
          <div className="absolute inset-0">
            <Media
              media={media}
              alt={hasOverlay ? headline || media?.alt || '' : media?.alt ?? ''}
              className="size-full rounded-none"
            />
          </div>
          {hasOverlay && (
            // Text lines up with the page content, not the screen edge.
            <div
              className={[
                'relative mx-auto flex size-full max-w-page flex-col justify-center px-large md:px-gutter',
                align === 'center' ? 'items-center' : 'items-start',
              ].join(' ')}
            >
              <SectionIntro
                as="h2"
                eyebrow={eyebrow}
                heading={headline}
                body={body}
                align={align}
                maxWidth="md"
                tone="inverse"
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
          )}
        </div>
      </section>
    )
  }

  // Plain media, no text — the original, still-common case. Scale/
  // Position (on the media object itself, in Studio) let an editor
  // back an image or animation off 100%/cover if they want the
  // frame's gradient showing around it, rather than this block
  // special-casing that layout in code.
  //
  // Full-bleed and a true 75vh on mobile (not an aspect-ratio — see
  // --height-media-mobile), contained and aspect-media from md: up —
  // same "-mx-large cancels SectionShell's own mobile px-large" trick
  // as the overlay branch below. No explicit width utility: a plain
  // block's width:auto already expands to fill (or, with the negative
  // margin, overflow) its container — adding w-full would fight the
  // negative margin instead of cooperating with it.
  if (!hasOverlay) {
    return banded((py) => (
      <SectionShell py={py.pb} pt={py.pt}>
        <Media
          media={media}
          alt={media?.alt ?? ''}
          className={`-mx-large h-media-mobile rounded-none md:mx-0 ${RATIO_CLASS[ratio]} md:h-auto md:w-full md:rounded-xl`}
        />
      </SectionShell>
    ))
  }

  return banded((py) => (
    <SectionShell py={py.pb} pt={py.pt}>
      {/* Same structure as Hero's "image overlay" layout: an absolute
          media layer, then the copy as a normal relative sibling on
          top (no scrim — Dan asked for the dark tint over the image
          removed; legibility over a busy image is now down to the
          image/text combination chosen in Studio, not a built-in
          darken). This box owns the aspect ratio/rounding instead of
          Media itself, since Media's own root is `relative` and can't
          also take `absolute` from here without the two conflicting in
          the same class list.

          Full-bleed and a true 75vh on mobile (not an aspect-ratio —
          see --height-media-mobile), contained and aspect-media from
          md: up — same "-mx-large cancels SectionShell's own mobile
          px-large" trick as the mobile Hero card (SectionShell's
          default mobile padding — see its own px="default" comment).
          No explicit width utility: a plain block's width:auto already
          expands to fill (or, with the negative margin below,
          overflow) its container — adding w-full here would fight the
          negative margin (both non-auto, over-constrained) instead of
          cooperating with it. */}
      <div className={`relative -mx-large h-media-mobile overflow-hidden rounded-none md:mx-0 ${RATIO_CLASS[ratio]} md:h-auto md:rounded-xl`}>
        <div className="absolute inset-0">
          <Media media={media} alt={headline || media?.alt || ''} className="size-full" />
        </div>
        <div
          className={[
            // 32px on mobile (this box is full-bleed, 0 section
            // padding, so this IS the only thing landing the text on
            // the site-wide 32px-from-edge line), tripled to 96px on
            // desktop, as before.
            'relative flex size-full flex-col justify-center p-large md:p-3xl',
            align === 'center' ? 'items-center' : 'items-start',
          ].join(' ')}
        >
          <SectionIntro
            as="h2"
            eyebrow={eyebrow}
            heading={headline}
            body={body}
            align={align}
            maxWidth="md"
            tone="inverse"
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
      </div>
    </SectionShell>
  ))
}

export function MediaBlock({ pinned = false, ...props }: MediaBlockProps) {
  if (!pinned) return <MediaBlockContent {...props} />
  // Pinned: sticky, with the gap below moved to the top of the panel
  // that scrolls over it (BlockRenderer).
  return (
    <div className="sticky">
      <StickToBottom />
      <MediaBlockContent {...props} spacing="none" />
    </div>
  )
}
