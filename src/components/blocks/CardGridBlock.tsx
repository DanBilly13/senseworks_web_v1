import type { SanityImageSource } from '@sanity/image-url'
import Image from 'next/image'
import { SectionShell } from '@/components/ui/SectionShell'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { renderNumberedEyebrow } from '@/components/ui/numberedEyebrow'
import { urlFor } from '@/lib/sanity/image'

type CardGridItem = {
  image?: SanityImageSource
  imageAlt?: string
  // Fades the image's right/bottom edges to true transparency (the
  // card's own background shows through, not the yellow gradient
  // backdrop — see the wrapper's bg-accent-gradient toggle below) — a
  // per-card choice, not every image on a grid necessarily wants it,
  // so it lives on the item itself rather than as a block-level toggle.
  imageFade?: boolean
  eyebrow: string
  heading: string
  body?: string
}

// Two separate directional gradients (right fade, bottom fade)
// intersected together — not one diagonal gradient, which fades the
// whole image toward one corner instead of tapering each edge on its
// own axis. `mask-composite: intersect` (and its pre-standard WebKit
// equivalent, `-webkit-mask-composite: source-in`) keeps only where
// both masks are opaque, so a pixel fades if EITHER gradient fades it.
// Multiple stops (rather than a single opaque->transparent step) so
// the fade itself reads as smooth rather than banded.
const IMAGE_FADE_MASK = `linear-gradient(
    to right,
    #000 0%,
    #000 40%,
    rgba(0, 0, 0, 0.85) 60%,
    rgba(0, 0, 0, 0.4) 80%,
    transparent 100%
  ),
  linear-gradient(
    to bottom,
    #000 0%,
    #000 40%,
    rgba(0, 0, 0, 0.85) 60%,
    rgba(0, 0, 0, 0.4) 80%,
    transparent 100%
  )`
type CardTone = 'default' | 'dark' | 'accent'
type CardGridBlockProps = {
  columns?: '1' | '2' | '3' | '4'
  items?: CardGridItem[]
  tone?: CardTone
  headingLevel?: 'h3' | 'h4'
  // Highlights each item's eyebrow leading word (e.g. "01") as a small
  // colored badge instead of plain text — off by default since not
  // every Card Grid is numbered.
  numberedEyebrow?: boolean
  // Adds an optional 7:5 image above each card's eyebrow — off by
  // default, and only shown on a card that actually has one uploaded.
  showImage?: boolean
  // 'cards' (default): every item is its own separately rounded,
  // backgrounded box with a real gap between them — today's look.
  // 'merged': the tone's background/rounding/border move from each
  // item onto the grid itself instead — one shared panel, columns
  // sitting flush with no gap between them, no divider either (Dan's
  // call — "start with nothing"). Goes full screen width on mobile
  // (0 outer margin, rounding dropped there — same reasoning as Media
  // Block's full-bleed image) with each item's own padding widened to
  // match, so text still lands 32px from the true screen edge.
  layout?: 'cards' | 'merged'
  spacing?: 'loose' | 'medium' | 'tight' | 'none'
}

const GRID_COLS_CLASS: Record<'1' | '2' | '3' | '4', string> = {
  '1': '',
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
}

// dark: black bg, white text (border dropped — bg-foreground already
// contrasts against the page). accent: our accent-yellow bg, plain
// black text — same default SectionIntro tone as the light card,
// since --color-accent-foreground already resolves to --color-foreground.
// Rounding lives separately from this (see TONE_SURFACE_CLASS call
// sites below) since 'merged' layout needs it on the grid itself
// instead of each item, and drops it on mobile entirely.
const TONE_SURFACE_CLASS: Record<CardTone, string> = {
  default: 'border border-border bg-background',
  dark: 'bg-foreground',
  accent: 'bg-accent',
}

// Mirrors SectionIntro's own HEADING_LINE_HEIGHT_GAP but without the
// "minus the container's base gap" adjustment — this is a standalone
// padding value, not stacking on top of any other gap, so it should
// equal the heading's full line-height exactly (matching the visual
// gap SectionIntro now produces between heading and body).
const CARD_PADDING_BOTTOM_VAR: Record<'h3' | 'h4', string> = {
  h3: 'var(--text-h3--full-line-height)',
  h4: 'var(--text-h4--full-line-height)',
}


// No eyebrow/heading/body of its own — pair it with a separate intro
// block (e.g. Section Headline) above it when one's needed.
export function CardGridBlock({
  columns = '3',
  items = [],
  tone = 'default',
  headingLevel = 'h4',
  numberedEyebrow = false,
  showImage = false,
  layout = 'cards',
  spacing = 'loose',
}: CardGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  const merged = layout === 'merged'

  return (
    <SectionShell px={merged ? 'full' : 'boxed'} py={spacing}>
      {/* Grid's default align-items: stretch makes every card in a row
          match the tallest one, on desktop's multi-column row — no
          extra height/flex wiring needed for that. Single column on
          mobile just stacks them at their own natural heights instead.
          'cards': gap-small/md:gap-large pairs with SectionShell's
          px="boxed" (8px) and each card's own horizontal
          px-medium-large (24px): the card's TEXT lands 8+24=32px from
          the edge either way, same as every non-boxed section's direct
          32px padding — only the box itself hugs closer to the edge on
          mobile. Desktop's horizontal padding (32px gap, 32px card
          padding) is unchanged. 'merged': no gap at all (columns sit
          flush — see TONE_SURFACE_CLASS above), and the surface/
          rounding move here instead of onto each item — rounded-none
          on mobile since the panel goes full screen width there (same
          reasoning as Media Block's full-bleed image), rounded-lg
          again once SectionShell's own px="full" restores a page
          margin at md:. The card's own TOP padding is separate from
          this rhythm and responds to whether it has an image — see
          hasImage below. */}
      <div
        className={[
          'grid grid-cols-1',
          merged ? 'overflow-hidden rounded-none md:rounded-lg' : 'gap-small md:gap-large',
          merged ? TONE_SURFACE_CLASS[tone] : '',
          GRID_COLS_CLASS[columns],
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {items.map((item, index) => {
          const hasImage = showImage && !!item.image
          return (
            <div
              key={index}
              className={`flex flex-col ${merged ? '' : `rounded-lg ${TONE_SURFACE_CLASS[tone]}`}`}
            >
              {/* Image (when present) sits below the text, inset within
                  the card's own padding like Bento Grid's media — not
                  flush against the card's edges. Top padding is always
                  32px now (image or not, it's never up here anymore).
                  With an image, bottom padding is a fixed 24px (the
                  image-to-card-edge gap) and the image's own mt-large
                  supplies the 32px gap up from the body text. With no
                  image, bottom padding falls back to the heading-line-
                  height-based gap it always used. Horizontal padding is
                  wider on mobile in 'merged' layout (flat px-large,
                  32px) than 'cards' (px-medium-large, 24px) — 'merged'
                  has no outer section padding of its own on mobile to
                  combine with, so this is the only thing standing
                  between the text and the true screen edge there. */}
              <div
                className={`flex flex-1 flex-col pt-large ${merged ? 'px-large' : 'px-medium-large md:px-large'}`}
                style={{ paddingBottom: hasImage ? undefined : CARD_PADDING_BOTTOM_VAR[headingLevel] }}
              >
                <SectionIntro
                  as={headingLevel}
                  eyebrow={renderNumberedEyebrow(item.eyebrow, numberedEyebrow, tone === 'dark')}
                  heading={item.heading}
                  body={item.body}
                  tone={tone === 'dark' ? 'inverse' : 'default'}
                  // On the dark card specifically, the kicker reads as an
                  // accent highlight rather than faded white — a look Dan
                  // asked for after seeing the plain white/70% version.
                  // Numbered eyebrows go full foreground instead of the
                  // usual muted grey — next to a bold number badge, grey
                  // text read washed out.
                  eyebrowColor={
                    tone === 'dark' ? 'text-accent' : numberedEyebrow ? 'text-foreground' : undefined
                  }
                  // Card headings vary per instance (h3 or h4), so a single
                  // fixed gap would only ever suit one of them — see
                  // SectionIntro's own comment on this prop.
                  gapToLineHeight
                />
                {hasImage && (
                  // bg-accent-gradient backdrop — same treatment
                  // Media.tsx gives every media slot by default (see
                  // Bento Grid). Temporary: Dan wants a different
                  // gradient behind dark-tone cards eventually, but is
                  // using the same yellow one everywhere for now. Skipped
                  // entirely when fading, so the image fades to true
                  // transparency (the card's own background) instead of
                  // fading into this yellow backdrop.
                  <div
                    className={`relative mt-large mb-medium-large aspect-media w-full overflow-hidden rounded-md ${item.imageFade ? '' : 'bg-accent-gradient'}`}
                  >
                    <Image
                      src={urlFor(item.image!).url()}
                      alt={item.imageAlt || ''}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="size-full object-cover"
                      style={
                        item.imageFade
                          ? {
                              maskImage: IMAGE_FADE_MASK,
                              WebkitMaskImage: IMAGE_FADE_MASK,
                              maskComposite: 'intersect',
                              WebkitMaskComposite: 'source-in',
                            }
                          : undefined
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </SectionShell>
  )
}
