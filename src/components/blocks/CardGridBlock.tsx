import type { SanityImageSource } from '@sanity/image-url'
import Image from 'next/image'
import { SectionShell } from '@/components/ui/SectionShell'
import { BandFill, bandShellPadding, type BandProps, type BandTone } from '@/components/ui/BandFill'
import { SectionIntro } from '@/components/ui/SectionIntro'
import { renderNumberedEyebrow } from '@/components/ui/numberedEyebrow'
import { EditorialCard, type EditorialBodyFont, type EditorialLinkStyle, type EditorialMark } from '@/components/ui/EditorialCard'
import { urlFor } from '@/lib/sanity/image'
import { hasImage } from '@/lib/sanity/media'

type CardGridItem = {
  image?: SanityImageSource
  imageAlt?: string
  // Fades the image's right/bottom edges to true transparency (the
  // card's own background shows through, not the yellow gradient
  // backdrop — see the wrapper's bg-accent-gradient toggle below) — a
  // per-card choice, not every image on a grid necessarily wants it,
  // so it lives on the item itself rather than as a block-level toggle.
  imageFade?: boolean
  eyebrow?: string
  heading: string
  body?: string
  ctaLabel?: string
  ctaHref?: string
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
type CardTone = 'white' | 'dark' | 'accent' | 'none'
// background/paddingTop/paddingBottom/spacing: the optional full screen
// width background behind the cards, see ui/BandFill (`tone` here is the
// cards' own style, so the band's is `background`).
type CardGridBlockProps = Omit<BandProps, 'tone'> & {
  background?: BandTone
  columns?: '1' | '2' | '3' | '4'
  items?: CardGridItem[]
  tone?: CardTone
  titleSize?: 'h3' | 'h4'
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
  // Editorial cards (ui/EditorialCard): boxed in the card style, or no
  // fill at all; with an optional wave mark, numbers and link style.
  cardDesign?: 'standard' | 'editorial'
  cardMark?: EditorialMark
  cardNumbers?: boolean
  linkStyle?: EditorialLinkStyle
  bodyFont?: EditorialBodyFont
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
const TONE_SURFACE_CLASS: Record<Exclude<CardTone, 'none'>, string> = {
  white: 'border border-border bg-background',
  dark: 'bg-foreground',
  accent: 'bg-accent',
}

// The card's bottom padding: the heading's full line-height, so it
// scales with h3 vs h4 like the gaps inside the card do (those are
// half the line-height, SectionIntro's site-wide rule).
const CARD_PADDING_BOTTOM_VAR: Record<'h3' | 'h4', string> = {
  h3: 'var(--text-h3--full-line-height)',
  h4: 'var(--text-h4--full-line-height)',
}


// No eyebrow/heading/body of its own — pair it with a separate intro
// block (e.g. Section Headline) above it when one's needed.
export function CardGridBlock({
  columns = '3',
  items = [],
  tone = 'white',
  titleSize = 'h4',
  numberedEyebrow = false,
  showImage = false,
  layout = 'cards',
  background = 'none',
  cardDesign = 'standard',
  cardMark,
  cardNumbers = false,
  linkStyle,
  bodyFont,
  ...band
}: CardGridBlockProps) {
  // D7: a block with no content simply doesn't render.
  if (!items.length) return null

  if (cardDesign === 'editorial') {
    const noFill = tone === 'none'
    const onDark = background === 'dark' || background === 'accentDark'
    return (
      <BandFill tone={background} {...band}>
        {/* Boxed: 8px out, 16px in on phones (the boxed rule), as the
            standard cards. No fill: the page's own 24px margin, and more
            air between cards that have no box to separate them. */}
        <SectionShell px={noFill ? 'default' : 'boxed'} {...bandShellPadding({ tone: background, ...band })}>
          <div className={`grid grid-cols-1 ${noFill ? 'gap-xl md:gap-large' : 'gap-small md:gap-large'} ${GRID_COLS_CLASS[columns]}`}>
            {items.map((item, index) => (
              <EditorialCard
                key={index}
                surface={tone}
                onDark={onDark}
                padX="px-medium md:px-large"
                number={cardNumbers ? String(index + 1).padStart(2, '0') : undefined}
                label={item.eyebrow}
                mark={cardMark}
                title={item.heading}
                titleSize={titleSize === 'h3' ? 'h4' : 'h5'}
                body={item.body}
                bodyFont={bodyFont}
                action={item.ctaLabel && item.ctaHref ? { label: item.ctaLabel, href: item.ctaHref, style: linkStyle } : undefined}
                visual={
                  showImage && hasImage(item.image) ? (
                    <div className="relative aspect-media w-full bg-accent-gradient">
                      <Image src={urlFor(item.image!).url()} alt={item.imageAlt || ''} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                    </div>
                  ) : undefined
                }
              />
            ))}
          </div>
        </SectionShell>
      </BandFill>
    )
  }

  const merged = layout === 'merged'
  // A Standard card has no "No fill"; it falls back to White.
  const surfaceTone = tone === 'none' ? 'white' : tone

  return (
    <BandFill tone={background} {...band}>
      <SectionShell px={merged ? 'full' : 'boxed'} {...bandShellPadding({ tone: background, ...band })}>
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
            withImage below. */}
        <div
          className={[
            'grid grid-cols-1',
            merged ? 'overflow-hidden rounded-none md:rounded-lg' : 'gap-small md:gap-large',
            merged ? TONE_SURFACE_CLASS[surfaceTone] : '',
            GRID_COLS_CLASS[columns],
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {items.map((item, index) => {
            const withImage = showImage && hasImage(item.image)
            return (
              <div
                key={index}
                className={`flex flex-col ${merged ? '' : `rounded-lg ${TONE_SURFACE_CLASS[surfaceTone]}`}`}
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
                  className={`flex flex-1 flex-col pt-large ${merged ? 'px-edge md:px-large' : 'px-medium md:px-large'}`}
                  style={{ paddingBottom: withImage ? undefined : CARD_PADDING_BOTTOM_VAR[titleSize] }}
                >
                  <SectionIntro
                    as={titleSize}
                    eyebrow={item.eyebrow ? renderNumberedEyebrow(item.eyebrow, numberedEyebrow, surfaceTone === 'dark') : undefined}
                    heading={item.heading}
                    body={item.body}
                    // Keeps the line breaks typed into the body (e.g. an
                    // address, one line per row).
                    bodyClassName="whitespace-pre-line"
                    tone={surfaceTone === 'dark' ? 'inverse' : 'default'}
                    // On the dark card specifically, the kicker reads as an
                    // accent highlight rather than faded white — a look Dan
                    // asked for after seeing the plain white/70% version.
                    // Numbered eyebrows go full foreground instead of the
                    // usual muted grey — next to a bold number badge, grey
                    // text read washed out.
                    eyebrowColor={
                      surfaceTone === 'dark' ? 'text-accent' : numberedEyebrow ? 'text-foreground' : undefined
                    }
                    // Gaps follow the site-wide rule (half the heading's own
                    // line-height, SectionIntro's default), which already
                    // scales with h3 vs h4. Card Grid used to opt into the
                    // full line-height, which read noticeably loose.
                  />
                  {item.ctaLabel && item.ctaHref && (
                    <a
                      href={item.ctaHref}
                      className={`mt-medium-large self-start text-body-sm font-medium underline underline-offset-4 ${surfaceTone === 'dark' ? 'text-accent' : 'text-foreground'}`}
                    >
                      {item.ctaLabel}
                    </a>
                  )}
                  {withImage && (
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
    </BandFill>
  )
}
