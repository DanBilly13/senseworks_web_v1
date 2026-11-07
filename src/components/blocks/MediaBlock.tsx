import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { MD_SECTION_GAP_PB_CLASS, SECTION_GAP_PB_CLASS, SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { Media } from '@/components/ui/Media'
import { hasMedia, type MediaField } from '@/lib/sanity/media'
import { BandFill, bandShellPadding, type BandTone, type BandSpacing } from '@/components/ui/BandFill'
import { StickToBottom } from '@/components/ui/StickToBottom'
import { KeepNavUntilCovered } from '@/components/ui/KeepNavUntilCovered'
import { ScrollGrow } from '@/components/ui/ScrollGrow'

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
  // Content width, no text, on phones: 'fill' (default) edge to edge and
  // tall (cropped); 'edge' edge to edge in the desktop ratio; 'frame' the
  // desktop ratio inside the page margins, rounded, nothing cropped.
  mobileFit?: 'fill' | 'edge' | 'frame'
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
  // Content width only: zooms up to full size as it scrolls into view
  // (ui/ScrollGrow). Off, the frame isn't wrapped at all.
  growOnScroll?: boolean
  // Content width only: a 1px line in the foreground colour around the
  // frame (.media-keyline-* in globals.css).
  keyline?: boolean
  // The Mobile tab: phone versions of the settings above, 'inherit'
  // (or unset) meaning the same as desktop. mobileFit is above.
  mobileMedia?: MediaField
  mobileRatio?: 'inherit' | '7:5' | '7:4' | '3:1' | '1:1' | '4:5'
  mobileGrow?: 'inherit' | 'on' | 'off'
  mobileKeyline?: 'inherit' | 'on' | 'off'
  mobileAlign?: 'inherit' | 'left' | 'center'
  mobileBackground?: 'inherit' | 'none'
  mobileSpacing?: 'inherit' | BandSpacing
}

const RATIO_CLASS: Record<NonNullable<MediaBlockProps['ratio']>, string> = {
  '7:5': 'md:aspect-media',
  '7:4': 'md:aspect-hero',
  '3:1': 'md:aspect-banner',
}
// The phone shapes (Edge to edge / Inside margins), before md.
const PHONE_RATIO_CLASS: Record<Exclude<NonNullable<MediaBlockProps['mobileRatio']>, 'inherit'>, string> = {
  '7:5': 'aspect-media',
  '7:4': 'aspect-hero',
  '3:1': 'aspect-banner',
  '1:1': 'aspect-square',
  '4:5': 'aspect-4/5',
}
// "Same as desktop" or the phone's own value.
const phoneOr = <T,>(value: T | 'inherit' | undefined, desktop: T): T => (value === undefined || value === 'inherit' ? desktop : value)
// Items alignment for the text over the media, phones and desktop.
const itemsClass = (align: 'left' | 'center', phone: 'left' | 'center') =>
  phone === align
    ? align === 'center' ? 'items-center' : 'items-start'
    : phone === 'center' ? 'items-center md:items-start' : 'items-start md:items-center'

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
  mobileFit = 'fill',
  spacing = 'loose',
  tone = 'none',
  paddingTop,
  paddingBottom,
  growOnScroll = false,
  keyline = false,
  mobileMedia,
  mobileRatio,
  mobileGrow,
  mobileKeyline,
  mobileAlign,
  mobileBackground,
  mobileSpacing,
}: MediaBlockProps) {
  const hasOverlay = Boolean(eyebrow || headline || body || (ctaLabel && ctaHref))
  // Phone values (the Mobile tab), each falling back to desktop's.
  const phoneGrow = mobileGrow === 'on' ? true : mobileGrow === 'off' ? false : growOnScroll
  const phoneKeyline = (mobileKeyline === 'on' ? true : mobileKeyline === 'off' ? false : keyline) && mobileFit === 'frame' && !hasOverlay
  const phoneRatio = phoneOr(mobileRatio, ratio)
  const phoneAlign = phoneOr(mobileAlign, align)
  const phoneSpacing = phoneOr(mobileSpacing, spacing)
  const phoneNoBg = mobileBackground === 'none' && tone !== 'none'
  // The desktop media, or (with Phone media set) each on its own screen.
  const media2 = hasMedia(mobileMedia) ? mobileMedia : undefined
  const responsiveMedia = (alt: string, className: string) =>
    media2 ? (
      <>
        <Media media={media2} alt={alt} className={`${className} md:hidden`} />
        <Media media={media} alt={alt} className={`${className} max-md:hidden`} />
      </>
    ) : (
      <Media media={media} alt={alt} className={className} />
    )
  // The outline sits inside the grow wrapper, so it can undo the scale.
  const outlined = (frame: ReactNode) =>
    keyline || phoneKeyline ? (
      <div className={`relative ${phoneKeyline ? 'media-keyline-phone' : ''} ${keyline ? 'media-keyline-desktop' : ''}`}>{frame}</div>
    ) : (
      frame
    )
  const grow = (frame: ReactNode) =>
    growOnScroll || phoneGrow ? (
      <ScrollGrow phone={phoneGrow} desktop={growOnScroll}>
        {outlined(frame)}
      </ScrollGrow>
    ) : (
      outlined(frame)
    )
  // The background wraps the content-width layouts below; without one,
  // they're as they always were. Phones can drop it (and its padding) or
  // set their own gap after the block.
  type Pads = { pt?: BandSpacing; pb: BandSpacing; phonePt?: BandSpacing; phonePb?: BandSpacing }
  const banded = (shell: (py: Pads) => ReactNode) => {
    if (tone === 'none') return shell({ pb: spacing, phonePb: phoneSpacing })
    const pads = bandShellPadding({ tone, paddingTop, paddingBottom })
    return phoneNoBg ? (
      <BandFill tone={tone} spacing={spacing} phoneNoBg phoneSpacing="none">
        {shell({ ...pads, phonePt: 'none', phonePb: phoneSpacing })}
      </BandFill>
    ) : (
      <BandFill tone={tone} spacing={spacing} phoneSpacing={phoneSpacing}>
        {shell(pads)}
      </BandFill>
    )
  }

  if (width === 'full') {
    // Same bottom gap as SectionShell, but no width cap or side padding
    // — the media is the full width of the screen.
    return (
      <section className={phoneSpacing === spacing ? SECTION_GAP_PB_CLASS[spacing] : `${SECTION_GAP_PB_CLASS[phoneSpacing]} ${MD_SECTION_GAP_PB_CLASS[spacing]}`}>
        <div className="relative h-cta-banner-image w-full overflow-hidden">
          <div className="absolute inset-0">
            {responsiveMedia(hasOverlay ? headline || media?.alt || '' : media?.alt ?? '', 'size-full rounded-none')}
          </div>
          {hasOverlay && (
            // Text lines up with the page content, not the screen edge.
            <div
              className={[
                'relative mx-auto flex size-full max-w-page flex-col justify-center px-edge md:px-gutter',
                itemsClass(align, phoneAlign),
              ].join(' ')}
            >
              <SectionIntro
                as="h2"
                eyebrow={eyebrow}
                heading={headline}
                body={body}
                align={align}
                phoneAlign={phoneAlign}
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
  // same "-mx-edge cancels SectionShell's own mobile px-edge" trick
  // as the overlay branch below. No explicit width utility: a plain
  // block's width:auto already expands to fill (or, with the negative
  // margin, overflow) its container — adding w-full would fight the
  // negative margin instead of cooperating with it.
  if (!hasOverlay) {
    return banded((py) => (
      <SectionShell py={py.pb} pt={py.pt} phonePb={py.phonePb} phonePt={py.phonePt}>
        {grow(
          responsiveMedia(
            media?.alt ?? '',
            mobileFit === 'frame'
              ? `w-full rounded-xl ${PHONE_RATIO_CLASS[phoneRatio]} ${RATIO_CLASS[ratio]}`
              : mobileFit === 'edge'
                ? `-mx-edge rounded-none md:mx-0 md:w-full md:rounded-xl ${PHONE_RATIO_CLASS[phoneRatio]} ${RATIO_CLASS[ratio]}`
                : `-mx-edge h-media-mobile rounded-none md:mx-0 ${RATIO_CLASS[ratio]} md:h-auto md:w-full md:rounded-xl`,
          ),
        )}
      </SectionShell>
    ))
  }

  return banded((py) => (
    <SectionShell py={py.pb} pt={py.pt} phonePb={py.phonePb} phonePt={py.phonePt}>
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
          md: up — same "-mx-edge cancels SectionShell's own mobile
          px-edge" trick as the mobile Hero card (SectionShell's
          default mobile padding — see its own px="default" comment).
          No explicit width utility: a plain block's width:auto already
          expands to fill (or, with the negative margin below,
          overflow) its container — adding w-full here would fight the
          negative margin (both non-auto, over-constrained) instead of
          cooperating with it. */}
      {grow(
        <div className={`relative -mx-edge h-media-mobile overflow-hidden rounded-none md:mx-0 ${RATIO_CLASS[ratio]} md:h-auto md:rounded-xl`}>
          <div className="absolute inset-0">
            {responsiveMedia(headline || media?.alt || '', 'size-full')}
          </div>
          <div
            className={[
              // 32px on mobile (this box is full-bleed, 0 section
              // padding, so this IS the only thing landing the text on
              // the site-wide 32px-from-edge line), tripled to 96px on
              // desktop, as before.
              'relative flex size-full flex-col justify-center p-large md:p-3xl',
              itemsClass(align, phoneAlign),
            ].join(' ')}
          >
            <SectionIntro
              as="h2"
              eyebrow={eyebrow}
              heading={headline}
              body={body}
              align={align}
              phoneAlign={phoneAlign}
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
        </div>,
      )}
    </SectionShell>
  ))
}

export function MediaBlock({ pinned = false, ...props }: MediaBlockProps) {
  if (!pinned) return <MediaBlockContent {...props} />
  // Pinned (from tablet up; phones just scroll): sticky, 64px below the nav bar where the screen has room
  // (Dan's call: not jammed against the top), with the gap below moved to
  // a see-through gap above the panel that scrolls over it (BlockRenderer).
  return (
    <div className="md:sticky">
      <StickToBottom belowHeader={64} />
      {/* The nav bar and ticker stay until the video is covered. */}
      <KeepNavUntilCovered />
      <MediaBlockContent {...props} spacing="none" mobileSpacing="none" />
    </div>
  )
}
